import { useState } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Hexagram, randomHexagram } from "@/lib/iching";
import { useSSEChat } from "@/hooks/use-sse-chat";

export default function IChingPage() {
  const [hexagram, setHexagram] = useState<Hexagram | null>(null);
  const [isCasting, setIsCasting] = useState(false);
  const { messages, streamResponse, isStreaming, setMessages } = useSSEChat();

  const handleCast = () => {
    setIsCasting(true);
    setHexagram(null);
    setMessages([]);
    // Mock animation delay
    setTimeout(() => {
      setHexagram(randomHexagram());
      setIsCasting(false);
    }, 2000);
  };

  const handleAskAI = () => {
    if (!hexagram) return;
    
    const context = `Người này vừa gieo được quẻ: ${hexagram.name} (${hexagram.vietnameseName}). Mô tả: ${hexagram.description}. Ý nghĩa: ${hexagram.meaning}.`;

    streamResponse('/api/mysticism/ai-interpret', { type: "iching", context });
  };

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background pointer-events-none" />
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 pt-24 pb-16 z-10 relative">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground drop-shadow-md">Kinh Dịch</h1>
            <p className="text-muted-foreground text-lg">Tập trung ý niệm, thành tâm xin quẻ chỉ đường.</p>
          </div>

          <div className="flex flex-col items-center justify-center py-12">
            {!hexagram && (
              <Button 
                onClick={handleCast} 
                disabled={isCasting}
                className={`w-48 h-48 rounded-full bg-primary/20 hover:bg-primary/30 border-2 border-primary text-primary transition-all duration-500 flex flex-col items-center justify-center gap-4 ${isCasting ? 'animate-pulse scale-110 shadow-[0_0_60px_rgba(255,215,0,0.4)]' : 'shadow-[0_0_30px_rgba(255,215,0,0.1)] hover:shadow-[0_0_40px_rgba(255,215,0,0.3)] hover:scale-105'}`}
              >
                {isCasting ? (
                  <span className="text-xl font-serif tracking-widest animate-bounce">ĐANG GIEO...</span>
                ) : (
                  <span className="text-2xl font-serif tracking-widest">GIEO QUẺ</span>
                )}
              </Button>
            )}

            {hexagram && !isCasting && (
              <div className="w-full animate-in fade-in zoom-in duration-1000 space-y-8">
                <Card className="bg-card/40 backdrop-blur-sm border-primary/40 shadow-2xl shadow-primary/10 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
                  <CardHeader className="text-center pb-0">
                    <div className="text-[12rem] leading-none font-sans text-primary opacity-80 mb-[-2rem]">{hexagram.symbol}</div>
                    <CardTitle className="text-4xl text-primary font-serif mb-2">{hexagram.vietnameseName}</CardTitle>
                    <CardDescription className="text-xl text-foreground/80">{hexagram.name}</CardDescription>
                  </CardHeader>
                  <CardContent className="text-center space-y-6 pt-8 pb-12 px-8 max-w-2xl mx-auto">
                    <p className="text-xl font-medium text-foreground italic">"{hexagram.description}"</p>
                    <p className="text-base text-muted-foreground leading-relaxed">{hexagram.meaning}</p>
                    <div className="pt-8">
                       <Button onClick={handleCast} variant="outline" className="border-primary/50 text-primary hover:bg-primary/10">
                        Gieo quẻ khác
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card/40 backdrop-blur-sm border-primary/20 shadow-xl shadow-primary/5 mt-8">
                  <CardHeader>
                    <CardTitle className="text-2xl text-primary flex items-center justify-between">
                      <span>Hỏi AI về quẻ này</span>
                      <Button onClick={handleAskAI} disabled={isStreaming} variant="outline" className="border-primary/50 text-primary hover:bg-primary/10">
                        {isStreaming ? "Đang lắng nghe vũ trụ..." : "Luận giải chi tiết"}
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {messages.filter(m => m.role === 'assistant').map((msg, i) => (
                      <div key={i} className="p-4 rounded-md bg-background/50 border border-border/50 text-foreground whitespace-pre-wrap leading-relaxed font-sans text-sm">
                        {msg.content}
                      </div>
                    ))}
                    {!messages.some(m => m.role === 'assistant') && !isStreaming && (
                      <p className="text-sm text-muted-foreground text-center italic py-8">Nhấn nút bên trên để AI luận giải thông điệp ẩn giấu trong quẻ Dịch.</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
