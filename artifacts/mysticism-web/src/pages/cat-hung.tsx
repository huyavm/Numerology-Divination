import { useState } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  analyzeCatHung,
  extractLastFourDigits,
  validateLicensePlate,
  LEVEL_CONFIG,
  type CatHungResult,
} from "@/lib/cat-hung";
import { useSSEChat } from "@/hooks/use-sse-chat";
import { MarkdownRenderer } from "@/components/ui/markdown-renderer";

function VerdictBadge({ result }: { result: CatHungResult }) {
  const bgMap: Record<string, string> = {
    "dai-cat": "from-yellow-500/30 to-yellow-600/10 border-yellow-400/60",
    cat: "from-green-500/30 to-green-600/10 border-green-400/60",
    "binh-thuong": "from-blue-500/20 to-blue-600/10 border-blue-400/40",
    hung: "from-orange-500/30 to-orange-600/10 border-orange-400/60",
    "dai-hung": "from-red-600/30 to-red-700/10 border-red-500/60",
  };
  return (
    <div className={`rounded-2xl border bg-gradient-to-br ${bgMap[result.verdict]} p-6 text-center space-y-2`}>
      <p className="text-xs uppercase tracking-widest text-muted-foreground">Luận đoán</p>
      <p className={`text-5xl font-serif font-bold ${result.verdictColor}`}>{result.verdictLabel}</p>
      <p className="text-sm text-foreground/70 mt-2 leading-relaxed max-w-sm mx-auto">{result.verdictDescription}</p>
      <p className="text-xs text-muted-foreground mt-1">Điểm tổng: {result.totalScore.toFixed(1)}</p>
    </div>
  );
}

function DigitRow({ digits }: { result: CatHungResult; digits: CatHungResult["digits"] }) {
  return (
    <div className="flex gap-3 justify-center flex-wrap">
      {digits.map((d, i) => {
        const cfg = LEVEL_CONFIG[d.level];
        return (
          <div
            key={i}
            className={`flex flex-col items-center gap-1.5 rounded-xl border px-4 py-3 min-w-[72px] ${cfg.bg} ${cfg.border}`}
          >
            <span className={`text-4xl font-bold font-serif ${cfg.text}`}>{d.digit}</span>
            <span className="text-[10px] text-muted-foreground text-center leading-tight">{d.element}</span>
            <span className={`text-[10px] font-semibold ${cfg.text}`}>
              {d.score > 0 ? `+${d.score}` : d.score}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function ComboBadges({ combinations }: { combinations: CatHungResult["combinations"] }) {
  if (combinations.length === 0) return null;
  return (
    <div className="space-y-2">
      <p className="text-xs uppercase tracking-widest text-muted-foreground text-center">Tổ hợp số</p>
      <div className="flex flex-wrap gap-2 justify-center">
        {combinations.map((c, i) => {
          const cfg = LEVEL_CONFIG[c.level];
          return (
            <div
              key={i}
              className={`rounded-lg border px-3 py-2 text-center ${cfg.badge}`}
            >
              <span className="block text-sm font-bold tracking-widest">{c.pattern}</span>
              <span className="block text-xs font-semibold">{c.name}</span>
              <span className="block text-[10px] opacity-80 max-w-[140px]">{c.meaning}</span>
              <span className="block text-xs font-bold">
                {c.score > 0 ? `+${c.score}` : c.score}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DigitMeaningList({ digits }: { digits: CatHungResult["digits"] }) {
  return (
    <div className="space-y-2">
      <p className="text-xs uppercase tracking-widest text-muted-foreground">Ý nghĩa từng chữ số</p>
      <div className="grid grid-cols-1 gap-2">
        {digits.map((d, i) => {
          const cfg = LEVEL_CONFIG[d.level];
          return (
            <div key={i} className={`flex items-center gap-3 rounded-lg px-3 py-2 border ${cfg.bg} ${cfg.border}`}>
              <span className={`text-2xl font-bold w-8 text-center font-serif ${cfg.text}`}>{d.digit}</span>
              <span className="text-sm text-foreground/80 flex-1">{d.meaning}</span>
              <span className={`text-xs font-semibold ${cfg.text}`}>
                {d.score > 0 ? `+${d.score}` : d.score}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ResultPanel({
  result,
  numStr,
  type,
}: {
  result: CatHungResult;
  numStr: string;
  type: "phone" | "plate";
}) {
  const { messages, streamResponse, isStreaming } = useSSEChat();

  const handleAskAI = () => {
    const typeName = type === "phone" ? "số điện thoại" : "biển số xe";
    const context = `Phân tích cát hung cho ${typeName}: ${numStr}. Kết quả luận đoán: ${result.verdictLabel} (điểm: ${result.totalScore.toFixed(1)}). Các chữ số: ${result.digits.map((d) => `${d.digit}(${d.meaning})`).join(", ")}. ${result.combinations.length > 0 ? `Tổ hợp đặc biệt: ${result.combinations.map((c) => `${c.pattern} - ${c.name}: ${c.meaning}`).join("; ")}.` : ""}`;
    streamResponse("/api/mysticism/ai-interpret", { type: "cat-hung", context });
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <VerdictBadge result={result} />

      <DigitRow result={result} digits={result.digits} />

      <ComboBadges combinations={result.combinations} />

      <DigitMeaningList digits={result.digits} />

      <Card className="bg-card/40 backdrop-blur-sm border-primary/20 shadow-xl">
        <CardHeader>
          <CardTitle className="text-xl text-primary flex items-center justify-between">
            <span>Luận giải chuyên sâu từ AI</span>
            <Button
              onClick={handleAskAI}
              disabled={isStreaming}
              variant="outline"
              className="border-primary/50 text-primary hover:bg-primary/10"
            >
              {isStreaming ? "Đang lắng nghe vũ trụ..." : "Nhận thông điệp"}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {messages.filter((m) => m.role === "assistant").map((msg, i) => (
            <div key={i} className="px-5 py-4 rounded-lg bg-background/40 border border-primary/15 shadow-inner">
              {msg.content ? (
                <MarkdownRenderer content={msg.content} />
              ) : (
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              )}
            </div>
          ))}
          {!messages.some((m) => m.role === "assistant") && !isStreaming && (
            <p className="text-sm text-muted-foreground text-center italic py-6">
              Nhấn nút bên trên để AI luận giải chi tiết về ý nghĩa huyền số.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function CatHungPage() {
  const [phone, setPhone] = useState("");
  const [plate, setPlate] = useState("");
  const [phoneResult, setPhoneResult] = useState<{ result: CatHungResult; numStr: string } | null>(null);
  const [plateResult, setPlateResult] = useState<{ result: CatHungResult; numStr: string } | null>(null);
  const [activeTab, setActiveTab] = useState("phone");

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const last4 = extractLastFourDigits(phone);
    if (last4.length < 4) return;
    setPhoneResult({ result: analyzeCatHung(last4), numStr: last4 });
  };

  const handlePlateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const digits = validateLicensePlate(plate);
    if (digits.length < 4) return;
    setPlateResult({ result: analyzeCatHung(digits), numStr: digits });
  };

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background pointer-events-none" />
      <Navbar />

      <main className="flex-1 container mx-auto px-4 pt-24 pb-16 z-10 relative">
        <div className="max-w-3xl mx-auto space-y-10">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground drop-shadow-md">Xem Cát Hung</h1>
            <p className="text-muted-foreground text-lg">
              Luận đoán may mắn từ 4 số cuối điện thoại và biển số xe theo huyền số học.
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 bg-card/40 border border-primary/20">
              <TabsTrigger value="phone" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                Số Điện Thoại
              </TabsTrigger>
              <TabsTrigger value="plate" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                Biển Số Xe
              </TabsTrigger>
            </TabsList>

            <TabsContent value="phone" className="space-y-8 mt-6">
              <Card className="bg-card/40 backdrop-blur-sm border-primary/20 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-2xl text-primary">Số Điện Thoại</CardTitle>
                  <CardDescription>
                    Nhập số điện thoại — hệ thống sẽ tự động phân tích 4 số cuối mang ý nghĩa huyền số.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePhoneSubmit} className="flex gap-3">
                    <div className="flex-1 space-y-1.5">
                      <Label htmlFor="phone" className="text-primary-foreground">Số điện thoại</Label>
                      <Input
                        id="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Ví dụ: 0901 234 567"
                        className="bg-background/50 border-border/50 focus:border-primary/50 text-foreground"
                        required
                      />
                    </div>
                    <div className="flex items-end">
                      <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold h-10 px-6">
                        LUẬN ĐOÁN
                      </Button>
                    </div>
                  </form>
                  {phone && extractLastFourDigits(phone).length === 4 && (
                    <p className="mt-3 text-sm text-muted-foreground">
                      4 số cuối sẽ phân tích:{" "}
                      <span className="text-primary font-bold tracking-widest text-base">
                        {extractLastFourDigits(phone)}
                      </span>
                    </p>
                  )}
                </CardContent>
              </Card>

              {phoneResult && (
                <ResultPanel result={phoneResult.result} numStr={phoneResult.numStr} type="phone" />
              )}
            </TabsContent>

            <TabsContent value="plate" className="space-y-8 mt-6">
              <Card className="bg-card/40 backdrop-blur-sm border-primary/20 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-2xl text-primary">Biển Số Xe</CardTitle>
                  <CardDescription>
                    Nhập 4 hoặc 5 chữ số cuối của biển số xe để luận đoán cát hung.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePlateSubmit} className="flex gap-3">
                    <div className="flex-1 space-y-1.5">
                      <Label htmlFor="plate" className="text-primary-foreground">Số biển xe (4-5 chữ số)</Label>
                      <Input
                        id="plate"
                        value={plate}
                        onChange={(e) => setPlate(e.target.value.replace(/\D/g, "").slice(0, 5))}
                        placeholder="Ví dụ: 56789 hoặc 8868"
                        className="bg-background/50 border-border/50 focus:border-primary/50 text-foreground font-mono text-lg tracking-widest"
                        maxLength={5}
                        required
                      />
                      <p className="text-xs text-muted-foreground">Chỉ nhập chữ số (4-5 ký tự)</p>
                    </div>
                    <div className="flex items-center pb-5">
                      <Button
                        type="submit"
                        disabled={plate.replace(/\D/g, "").length < 4}
                        className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold h-10 px-6"
                      >
                        LUẬN ĐOÁN
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>

              {plateResult && (
                <ResultPanel result={plateResult.result} numStr={plateResult.numStr} type="plate" />
              )}
            </TabsContent>
          </Tabs>

          <Card className="bg-card/20 backdrop-blur-sm border-primary/10 p-6">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center text-xs">
              {[
                { label: "Đại Cát", color: "text-yellow-400", desc: "≥ 8 điểm" },
                { label: "Cát", color: "text-green-400", desc: "4–7.9 điểm" },
                { label: "Bình Thường", color: "text-blue-400", desc: "0–3.9 điểm" },
                { label: "Hung", color: "text-orange-400", desc: "-4–-0.1 điểm" },
                { label: "Đại Hung", color: "text-red-500", desc: "< -4 điểm" },
              ].map((v, i) => (
                <div key={i} className="space-y-1">
                  <div className={`font-bold text-sm ${v.color}`}>{v.label}</div>
                  <div className="text-muted-foreground">{v.desc}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
