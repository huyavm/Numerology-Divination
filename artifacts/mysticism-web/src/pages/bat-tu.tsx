import { useState } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { computeBatu, Pillar, NguyenHanhItem } from "@/lib/batu";
import { useSSEChat } from "@/hooks/use-sse-chat";
import { Progress } from "@/components/ui/progress";
import { MarkdownRenderer } from "@/components/ui/markdown-renderer";
import { BatuKnowledge } from "@/components/knowledge-base";

export default function BatuPage() {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [results, setResults] = useState<{
    nam: Pillar;
    thang: Pillar;
    ngay: Pillar;
    gio: Pillar;
    nguHanhAnalysis: NguyenHanhItem[];
  } | null>(null);

  const { messages, streamResponse, isStreaming } = useSSEChat();

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !time) return;
    setResults(computeBatu(date, time));
  };

  const handleAskAI = () => {
    if (!results) return;
    
    const context = `Lá số Bát Tự. Trụ Năm: ${results.nam.thienCan} ${results.nam.diaChi} (${results.nam.nguHanh}). Trụ Tháng: ${results.thang.thienCan} ${results.thang.diaChi} (${results.thang.nguHanh}). Trụ Ngày: ${results.ngay.thienCan} ${results.ngay.diaChi} (${results.ngay.nguHanh}). Trụ Giờ: ${results.gio.thienCan} ${results.gio.diaChi} (${results.gio.nguHanh}). Phân tích ngũ hành: ${results.nguHanhAnalysis.map(x => `${x.element}: ${x.percentage}%`).join(", ")}.`;

    streamResponse('/api/mysticism/ai-interpret', { type: "batu", context });
  };

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background pointer-events-none" />
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 pt-24 pb-16 z-10 relative">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground drop-shadow-md">Bát tự Tứ Trụ</h1>
            <p className="text-muted-foreground text-lg">Lập lá số Tử Bình, phân tích sự cân bằng Ngũ Hành.</p>
          </div>

          <Card className="bg-card/40 backdrop-blur-sm border-primary/20 shadow-xl shadow-primary/5">
            <CardHeader>
              <CardTitle className="text-2xl text-primary">Thông tin bản mệnh</CardTitle>
              <CardDescription>Nhập ngày sinh (dương lịch) và giờ sinh để lập lá số.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCalculate} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="date" className="text-primary-foreground">Ngày sinh (DD/MM/YYYY)</Label>
                    <Input id="date" value={date} onChange={(e) => setDate(e.target.value)} placeholder="01/01/1990" className="bg-background/50 border-border/50 focus:border-primary/50 text-foreground" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time" className="text-primary-foreground">Giờ sinh (HH:MM)</Label>
                    <Input id="time" value={time} onChange={(e) => setTime(e.target.value)} placeholder="08:30" className="bg-background/50 border-border/50 focus:border-primary/50 text-foreground" required />
                  </div>
                </div>
                <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold tracking-wider">
                  LẬP LÁ SỐ
                </Button>
              </form>
            </CardContent>
          </Card>

          {results && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { title: "Trụ Giờ", data: results.gio },
                  { title: "Trụ Ngày", data: results.ngay },
                  { title: "Trụ Tháng", data: results.thang },
                  { title: "Trụ Năm", data: results.nam }
                ].map((pillar, idx) => (
                  <Card key={idx} className="bg-card/40 backdrop-blur-sm border-primary/30 text-center py-6">
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-4">{pillar.title}</h3>
                    <div className="text-3xl font-serif text-primary font-bold mb-2">{pillar.data.thienCan}</div>
                    <div className="text-3xl font-serif text-primary font-bold mb-4">{pillar.data.diaChi}</div>
                    <div className="text-xs text-muted-foreground">{pillar.data.nguHanh}</div>
                  </Card>
                ))}
              </div>

              <Card className="bg-card/40 backdrop-blur-sm border-primary/20">
                <CardHeader>
                  <CardTitle className="text-xl text-primary">Phân tích Ngũ Hành</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {results.nguHanhAnalysis.map((item, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="w-12 text-sm font-semibold text-foreground/80">{item.element}</div>
                      <Progress value={item.percentage} className="h-2 flex-1" />
                      <div className="w-12 text-right text-xs text-muted-foreground">{item.percentage}%</div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="bg-card/40 backdrop-blur-sm border-primary/20 shadow-xl shadow-primary/5 mt-8">
                <CardHeader>
                  <CardTitle className="text-2xl text-primary flex items-center justify-between">
                    <span>Hỏi AI về lá số của bạn</span>
                    <Button onClick={handleAskAI} disabled={isStreaming} variant="outline" className="border-primary/50 text-primary hover:bg-primary/10">
                      {isStreaming ? "Đang lắng nghe vũ trụ..." : "Luận giải lá số"}
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
                    <p className="text-sm text-muted-foreground text-center italic py-8">Nhấn nút bên trên để AI phân tích chuyên sâu về bát tự của bạn.</p>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
          <BatuKnowledge />
        </div>
      </main>
    </div>
  );
}
