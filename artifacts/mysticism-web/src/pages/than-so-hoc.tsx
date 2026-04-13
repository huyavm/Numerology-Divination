import { useState } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { computeLifePathNumber, computeSoulNumber, computeDestinyNumber, computePersonalityNumber, getNumberMeaning } from "@/lib/numerology";
import { useAISSEChat } from "@/hooks/use-ai-sse-chat";
import { MarkdownRenderer } from "@/components/ui/markdown-renderer";
import { NumerologyKnowledge } from "@/components/knowledge-base";

export default function NumerologyPage() {
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [results, setResults] = useState<{
    lifePath: number;
    soul: number;
    destiny: number;
    personality: number;
  } | null>(null);

  const { messages, streamResponse, isStreaming } = useAISSEChat();

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !dob) return;

    setResults({
      lifePath: computeLifePathNumber(dob),
      soul: computeSoulNumber(name),
      destiny: computeDestinyNumber(name),
      personality: computePersonalityNumber(name)
    });
  };

  const handleAskAI = () => {
    if (!results) return;
    
    const lp = getNumberMeaning(results.lifePath);
    const context = `Người này tên là ${name}, sinh ngày ${dob}. Số đường đời: ${results.lifePath} (${lp.title}). Số linh hồn: ${results.soul}. Số sứ mệnh: ${results.destiny}. Số nhân cách: ${results.personality}.`;

    streamResponse('/api/mysticism/ai-interpret', { type: "numerology", context });
  };

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background pointer-events-none" />
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 pt-24 pb-16 z-10 relative">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground drop-shadow-md">Thần số học</h1>
            <p className="text-muted-foreground text-lg">Khám phá ý nghĩa ẩn giấu đằng sau tên gọi và ngày sinh của bạn.</p>
          </div>

          <Card className="bg-card/40 backdrop-blur-sm border-primary/20 shadow-xl shadow-primary/5">
            <CardHeader>
              <CardTitle className="text-2xl text-primary">Nhập thông tin</CardTitle>
              <CardDescription>Nhập đầy đủ họ tên và ngày sinh theo định dạng DD/MM/YYYY.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCalculate} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-primary-foreground">Họ và tên</Label>
                    <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ví dụ: NGUYỄN VĂN A" className="bg-background/50 border-border/50 focus:border-primary/50 text-foreground" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dob" className="text-primary-foreground">Ngày sinh (DD/MM/YYYY)</Label>
                    <Input id="dob" value={dob} onChange={(e) => setDob(e.target.value)} placeholder="Ví dụ: 01/01/1990" className="bg-background/50 border-border/50 focus:border-primary/50 text-foreground" required />
                  </div>
                </div>
                <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold tracking-wider">
                  LUẬN GIẢI
                </Button>
              </form>
            </CardContent>
          </Card>

          {results && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  { label: "Đường Đời", value: results.lifePath },
                  { label: "Sứ Mệnh", value: results.destiny },
                  { label: "Linh Hồn", value: results.soul },
                  { label: "Nhân Cách", value: results.personality }
                ].map((item, idx) => {
                  const meaning = getNumberMeaning(item.value);
                  return (
                    <Card key={idx} className="bg-card/40 backdrop-blur-sm border-primary/20 shadow-lg relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-4 opacity-10 text-8xl font-bold font-sans pointer-events-none group-hover:scale-110 group-hover:text-primary transition-all duration-500">{item.value}</div>
                      <CardHeader>
                        <CardTitle className="text-xl text-primary font-sans">Số {item.label}: {item.value}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4 relative z-10">
                        <p className="text-sm text-foreground/80 leading-relaxed">{meaning.description}</p>
                        <div className="space-y-2">
                          <p className="text-xs font-semibold text-primary">Điểm mạnh:</p>
                          <p className="text-xs text-muted-foreground">{meaning.strengths.join(", ")}</p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-xs font-semibold text-primary">Thách thức:</p>
                          <p className="text-xs text-muted-foreground">{meaning.challenges.join(", ")}</p>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              <Card className="bg-card/40 backdrop-blur-sm border-primary/20 shadow-xl shadow-primary/5 mt-8">
                <CardHeader>
                  <CardTitle className="text-2xl text-primary flex items-center justify-between">
                    <span>Hỏi AI về kết quả của bạn</span>
                    <Button onClick={handleAskAI} disabled={isStreaming} variant="outline" className="border-primary/50 text-primary hover:bg-primary/10">
                      {isStreaming ? "Đang lắng nghe vũ trụ..." : "Nhận thông điệp"}
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {messages.filter(m => m.role === 'assistant').map((msg, i) => (
                    <div key={i} className="px-5 py-4 rounded-lg bg-background/40 border border-primary/15 shadow-inner">
                      {msg.content ? (
                        <MarkdownRenderer content={msg.content} />
                      ) : (
                        <div className="flex items-center gap-2 text-muted-foreground text-sm">
                          <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }} />
                          <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: "150ms" }} />
                          <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: "300ms" }} />
                        </div>
                      )}
                    </div>
                  ))}
                  {!messages.some(m => m.role === 'assistant') && !isStreaming && (
                    <p className="text-sm text-muted-foreground text-center italic py-8">Nhấn nút bên trên để AI luận giải chi tiết về các con số của bạn.</p>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
          <NumerologyKnowledge />
        </div>
      </main>
    </div>
  );
}
