import { useState, useRef, useEffect } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useListOpenaiConversations, useCreateOpenaiConversation, useGetOpenaiConversation, useDeleteOpenaiConversation } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Trash2, MessageSquarePlus, Send } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MarkdownRenderer } from "@/components/ui/markdown-renderer";

export default function AIChatPage() {
  const queryClient = useQueryClient();
  const [activeConvId, setActiveConvId] = useState<number | null>(null);
  const [input, setInput] = useState("");
  const [localMessages, setLocalMessages] = useState<{role: string, content: string}[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data: conversations, isLoading: isLoadingConvs } = useListOpenaiConversations();
  const createConv = useCreateOpenaiConversation();
  const deleteConv = useDeleteOpenaiConversation();
  
  const { data: activeConvData, isLoading: isLoadingConvData } = useGetOpenaiConversation(activeConvId!, {
    query: { enabled: !!activeConvId }
  });

  useEffect(() => {
    if (activeConvData) {
      setLocalMessages(activeConvData.messages || []);
    }
  }, [activeConvData]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [localMessages]);

  const handleNewChat = () => {
    createConv.mutate({ data: { title: "Trò chuyện mới" } }, {
      onSuccess: (newConv) => {
        queryClient.invalidateQueries({ queryKey: ["/api/openai/conversations"] });
        setActiveConvId(newConv.id);
        setLocalMessages([]);
      }
    });
  };

  const handleDelete = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    deleteConv.mutate({ id }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["/api/openai/conversations"] });
        if (activeConvId === id) {
          setActiveConvId(null);
          setLocalMessages([]);
        }
      }
    });
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !activeConvId || isStreaming) return;

    const userMessage = input.trim();
    setInput("");
    setLocalMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setLocalMessages(prev => [...prev, { role: "assistant", content: "" }]);
    setIsStreaming(true);

    try {
      const response = await fetch(`/api/openai/conversations/${activeConvId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: userMessage }),
      });

      if (!response.body) throw new Error('No response body');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const dataStr = line.replace('data: ', '').trim();
            if (!dataStr || dataStr === '[DONE]') continue;

            try {
              const data = JSON.parse(dataStr);
              if (data.done) {
                break;
              }
              if (data.content) {
                setLocalMessages((prev) => {
                  const newMessages = [...prev];
                  const lastMessage = newMessages[newMessages.length - 1];
                  if (lastMessage && lastMessage.role === 'assistant') {
                    lastMessage.content += data.content;
                  }
                  return newMessages;
                });
              }
            } catch (err) {
              console.error('SSE JSON parse error', err, dataStr);
            }
          }
        }
      }
    } catch (error) {
      console.error('Chat error:', error);
    } finally {
      setIsStreaming(false);
      queryClient.invalidateQueries({ queryKey: [`/api/openai/conversations/${activeConvId}`] });
    }
  };

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background pointer-events-none" />
      <Navbar />
      
      <main className="flex-1 flex pt-16 z-10 relative overflow-hidden h-[100dvh]">
        {/* Sidebar */}
        <div className="w-80 border-r border-border/50 bg-card/20 backdrop-blur-md flex flex-col">
          <div className="p-4 border-b border-border/50">
            <Button onClick={handleNewChat} className="w-full bg-primary/20 text-primary hover:bg-primary/30 border border-primary/50" disabled={createConv.isPending}>
              <MessageSquarePlus className="w-4 h-4 mr-2" />
              Tạo trò chuyện mới
            </Button>
          </div>
          <ScrollArea className="flex-1">
            <div className="p-2 space-y-2">
              {isLoadingConvs ? (
                <div className="text-center text-sm text-muted-foreground p-4">Đang tải...</div>
              ) : conversations?.map((conv) => (
                <div 
                  key={conv.id}
                  onClick={() => setActiveConvId(conv.id)}
                  className={`p-3 rounded-md cursor-pointer transition-colors flex items-center justify-between group ${activeConvId === conv.id ? 'bg-primary/20 border border-primary/50' : 'hover:bg-primary/10 border border-transparent'}`}
                >
                  <div className="truncate text-sm font-medium text-foreground/90">{conv.title}</div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6 opacity-0 group-hover:opacity-100 hover:text-destructive transition-opacity"
                    onClick={(e) => handleDelete(e, conv.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col bg-background/50">
          {!activeConvId ? (
            <div className="flex-1 flex items-center justify-center p-8 text-center">
              <div className="space-y-4 max-w-md">
                <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl">✨</span>
                </div>
                <h2 className="text-2xl font-serif text-primary">Trợ lý Tâm linh Huyền Bí</h2>
                <p className="text-muted-foreground">Chọn hoặc tạo một cuộc trò chuyện mới để bắt đầu. Hãy đặt câu hỏi về thần số học, kinh dịch, lá số bát tự hay những thắc mắc về vận mệnh của bạn.</p>
              </div>
            </div>
          ) : (
            <>
              <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
                {isLoadingConvData ? (
                  <div className="text-center text-muted-foreground">Đang kết nối tâm thức...</div>
                ) : (
                  localMessages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      {msg.role === 'user' ? (
                        <div className="max-w-[75%] rounded-2xl rounded-tr-sm px-4 py-3 text-sm leading-relaxed bg-primary text-primary-foreground">
                          {msg.content}
                        </div>
                      ) : (
                        <div className="max-w-[85%] rounded-2xl rounded-tl-sm px-5 py-4 bg-card/60 backdrop-blur-sm border border-primary/20 text-foreground">
                          {!msg.content && isStreaming && i === localMessages.length - 1 ? (
                            <div className="flex items-center gap-1.5 py-1">
                              <span className="w-2 h-2 rounded-full bg-primary/70 animate-bounce" style={{ animationDelay: "0ms" }} />
                              <span className="w-2 h-2 rounded-full bg-primary/70 animate-bounce" style={{ animationDelay: "150ms" }} />
                              <span className="w-2 h-2 rounded-full bg-primary/70 animate-bounce" style={{ animationDelay: "300ms" }} />
                            </div>
                          ) : (
                            <MarkdownRenderer content={msg.content} />
                          )}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
              <div className="p-4 border-t border-border/50 bg-background/80 backdrop-blur-md">
                <form onSubmit={handleSend} className="max-w-4xl mx-auto relative flex items-center">
                  <Input 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Hỏi về vận mệnh, thần số học, kinh dịch..."
                    className="pr-12 bg-card/50 border-primary/30 focus-visible:ring-primary h-12 rounded-full"
                    disabled={isStreaming || isLoadingConvData}
                  />
                  <Button 
                    type="submit" 
                    size="icon" 
                    disabled={isStreaming || !input.trim()}
                    className="absolute right-1 w-10 h-10 rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </form>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
