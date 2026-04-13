import { useState } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  analyzeCatHung,
  analyzeFullPhone,
  extractLastSixDigits,
  extractAllPhoneDigits,
  validateLicensePlate,
  analyzeCompatibility,
  analyzeCompatibilityWithDOB,
  computeNameNumber,
  computePhoneEnergyNumber,
  computeLifePathFromDOB,
  LEVEL_CONFIG,
  type CatHungResult,
  type CompatibilityResult,
  type FullPhoneAnalysis,
} from "@/lib/cat-hung";
import { CatHungKnowledge } from "@/components/knowledge-base";
import { useSSEChat } from "@/hooks/use-sse-chat";
import { MarkdownRenderer } from "@/components/ui/markdown-renderer";

type PhoneMode = "6" | "10";

function VerdictBadge({ result, label: overrideLabel }: { result: CatHungResult; label?: string }) {
  const bgMap: Record<string, string> = {
    "dai-cat": "from-yellow-500/30 to-yellow-600/10 border-yellow-400/60",
    cat: "from-green-500/30 to-green-600/10 border-green-400/60",
    "binh-thuong": "from-blue-500/20 to-blue-600/10 border-blue-400/40",
    hung: "from-orange-500/30 to-orange-600/10 border-orange-400/60",
    "dai-hung": "from-red-600/30 to-red-700/10 border-red-500/60",
  };
  return (
    <div className={`rounded-2xl border bg-gradient-to-br ${bgMap[result.verdict]} p-6 text-center space-y-2`}>
      {overrideLabel && <p className="text-xs uppercase tracking-widest text-muted-foreground">{overrideLabel}</p>}
      {!overrideLabel && <p className="text-xs uppercase tracking-widest text-muted-foreground">Luận đoán cát hung</p>}
      <p className={`text-5xl font-serif font-bold ${result.verdictColor}`}>{result.verdictLabel}</p>
      <p className="text-sm text-foreground/70 mt-2 leading-relaxed max-w-sm mx-auto">{result.verdictDescription}</p>
      <p className="text-xs text-muted-foreground mt-1">Điểm tổng: {result.totalScore.toFixed(1)}</p>
    </div>
  );
}

function SmallVerdictCard({ result, title, numStr }: { result: CatHungResult; title: string; numStr: string }) {
  const bgMap: Record<string, string> = {
    "dai-cat": "border-yellow-400/40 bg-yellow-500/5",
    cat: "border-green-400/40 bg-green-500/5",
    "binh-thuong": "border-blue-400/30 bg-blue-500/5",
    hung: "border-orange-400/40 bg-orange-500/5",
    "dai-hung": "border-red-500/40 bg-red-500/5",
  };
  return (
    <div className={`rounded-xl border p-4 ${bgMap[result.verdict]}`}>
      <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">{title}</p>
      <div className="flex items-center justify-between">
        <span className="font-mono text-sm tracking-widest text-foreground/70">{numStr}</span>
        <span className={`text-lg font-serif font-bold ${result.verdictColor}`}>{result.verdictLabel}</span>
      </div>
      <p className="text-xs text-muted-foreground mt-1">Điểm: {result.totalScore.toFixed(1)}</p>
      {result.combinations.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {result.combinations.map((c, i) => {
            const cfg = LEVEL_CONFIG[c.level];
            return (
              <span key={i} className={`text-[10px] px-2 py-0.5 rounded-full border ${cfg.badge}`}>
                {c.pattern} {c.name}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}

function CompatibilityPanel({
  compat,
  numStr,
  ownerLabel,
  ownerSubLabel,
}: {
  compat: CompatibilityResult;
  numStr: string;
  ownerLabel: string;
  ownerSubLabel: string;
}) {
  const bgMap: Record<CompatibilityResult["level"], string> = {
    perfect: "from-yellow-500/30 to-yellow-600/10 border-yellow-400/60",
    good: "from-green-500/30 to-green-600/10 border-green-400/60",
    neutral: "from-blue-500/20 to-blue-600/10 border-blue-400/40",
    clash: "from-red-600/30 to-red-700/10 border-red-500/60",
  };
  const symMap: Record<CompatibilityResult["level"], string> = {
    perfect: "=", good: "~", neutral: "?", clash: "✕",
  };
  const symColor: Record<CompatibilityResult["level"], string> = {
    perfect: "text-yellow-400", good: "text-green-400", neutral: "text-blue-400", clash: "text-red-400",
  };
  return (
    <div className={`rounded-2xl border bg-gradient-to-br ${bgMap[compat.level]} p-5 space-y-4`}>
      <p className="text-xs uppercase tracking-widest text-muted-foreground text-center">Tương hợp chủ nhân & số</p>
      <p className={`text-2xl font-serif font-bold text-center ${compat.labelColor}`}>{compat.label}</p>
      <div className="flex items-center justify-center gap-6 py-1">
        <div className="text-center">
          <div className="text-3xl font-bold font-serif text-primary">{compat.nameNumber}</div>
          <div className="text-xs text-muted-foreground mt-0.5">{ownerLabel}</div>
          <div className="text-xs text-foreground/50">{ownerSubLabel}</div>
        </div>
        <div className={`text-2xl font-bold ${symColor[compat.level]}`}>{symMap[compat.level]}</div>
        <div className="text-center">
          <div className="text-3xl font-bold font-serif text-primary">{compat.phoneNumber}</div>
          <div className="text-xs text-muted-foreground mt-0.5">Năng lượng số</div>
          <div className="text-xs text-foreground/50 font-mono tracking-widest">{numStr}</div>
        </div>
      </div>
      <p className="text-sm text-foreground/75 text-center leading-relaxed">{compat.description}</p>
    </div>
  );
}

function DigitRow({ digits }: { digits: CatHungResult["digits"] }) {
  return (
    <div className="flex gap-2 justify-center flex-wrap">
      {digits.map((d, i) => {
        const cfg = LEVEL_CONFIG[d.level];
        return (
          <div key={i} className={`flex flex-col items-center gap-1 rounded-xl border px-2.5 py-2.5 min-w-[54px] ${cfg.bg} ${cfg.border}`}>
            <span className={`text-2xl font-bold font-serif ${cfg.text}`}>{d.digit}</span>
            <span className="text-[9px] text-muted-foreground text-center leading-tight">{d.element}</span>
            <span className={`text-[9px] font-semibold ${cfg.text}`}>{d.score > 0 ? `+${d.score}` : d.score}</span>
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
      <p className="text-xs uppercase tracking-widest text-muted-foreground text-center">Tổ hợp đặc biệt</p>
      <div className="flex flex-wrap gap-2 justify-center">
        {combinations.map((c, i) => {
          const cfg = LEVEL_CONFIG[c.level];
          return (
            <div key={i} className={`rounded-lg border px-3 py-2 text-center ${cfg.badge}`}>
              <span className="block text-sm font-bold tracking-widest">{c.pattern}</span>
              <span className="block text-xs font-semibold">{c.name}</span>
              <span className="block text-[10px] opacity-80 max-w-[140px]">{c.meaning}</span>
              <span className="block text-xs font-bold">{c.score > 0 ? `+${c.score}` : c.score}</span>
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
              <span className={`text-xs font-semibold ${cfg.text}`}>{d.score > 0 ? `+${d.score}` : d.score}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AIPanel({ onAsk, isStreaming, messages }: {
  onAsk: () => void;
  isStreaming: boolean;
  messages: { role: string; content: string }[];
}) {
  return (
    <Card className="bg-card/40 backdrop-blur-sm border-primary/20 shadow-xl">
      <CardHeader>
        <CardTitle className="text-xl text-primary flex items-center justify-between flex-wrap gap-2">
          <span>Luận giải chuyên sâu từ AI</span>
          <Button onClick={onAsk} disabled={isStreaming} variant="outline" className="border-primary/50 text-primary hover:bg-primary/10">
            {isStreaming ? "Đang lắng nghe vũ trụ..." : "Nhận thông điệp"}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {messages.filter((m) => m.role === "assistant").map((msg, i) => (
          <div key={i} className="px-5 py-4 rounded-lg bg-background/40 border border-primary/15 shadow-inner">
            {msg.content ? <MarkdownRenderer content={msg.content} /> : (
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
  );
}

function SixDigitResult({
  result, numStr, ownerName, compat,
}: {
  result: CatHungResult; numStr: string; ownerName?: string; compat?: CompatibilityResult;
}) {
  const { messages, streamResponse, isStreaming } = useSSEChat();
  const handleAskAI = () => {
    const ownerPart = ownerName
      ? ` Chủ sở hữu: ${ownerName} (số mệnh: ${compat?.nameNumber}, năng lượng số: ${compat?.phoneNumber}, tương hợp: ${compat?.label}).`
      : "";
    const context = `Phân tích cát hung cho 6 số cuối số điện thoại: ${numStr}.${ownerPart} Kết quả: ${result.verdictLabel} (điểm: ${result.totalScore.toFixed(1)}). Chữ số: ${result.digits.map((d) => `${d.digit}(${d.meaning})`).join(", ")}. ${result.combinations.length > 0 ? `Tổ hợp: ${result.combinations.map((c) => `${c.pattern} - ${c.name}: ${c.meaning}`).join("; ")}.` : ""}`;
    streamResponse("/api/mysticism/ai-interpret", { type: "cat-hung", context });
  };
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <VerdictBadge result={result} />
      {compat && ownerName && (
        <CompatibilityPanel compat={compat} numStr={numStr} ownerLabel="Số mệnh" ownerSubLabel="chủ nhân" />
      )}
      <DigitRow digits={result.digits} />
      <ComboBadges combinations={result.combinations} />
      <DigitMeaningList digits={result.digits} />
      <AIPanel onAsk={handleAskAI} isStreaming={isStreaming} messages={messages} />
    </div>
  );
}

function TenDigitResult({
  analysis, ownerName, dob, compatName, compatDOB,
}: {
  analysis: FullPhoneAnalysis;
  ownerName?: string;
  dob?: string;
  compatName?: CompatibilityResult;
  compatDOB?: CompatibilityResult;
}) {
  const { messages, streamResponse, isStreaming } = useSSEChat();
  const handleAskAI = () => {
    const ownerPart = ownerName
      ? ` Chủ sở hữu: ${ownerName}.`
      : "";
    const dobPart = dob
      ? ` Ngày sinh: ${dob} (số đường đời: ${computeLifePathFromDOB(dob)}, tương hợp: ${compatDOB?.label}).`
      : "";
    const context = `Phân tích cát hung toàn bộ 10 số điện thoại: ${analysis.allDigits}.${ownerPart}${dobPart} Đầu số ${analysis.prefixDigits}: ${analysis.prefixResult.verdictLabel}. Số thuê bao ${analysis.subscriberDigits}: ${analysis.subscriberResult.verdictLabel}. Tổng thể: ${analysis.fullResult.verdictLabel} (điểm: ${analysis.fullResult.totalScore.toFixed(1)}). Năng lượng số tổng: ${analysis.energyNumber}. Tổ hợp đặc biệt: ${analysis.fullResult.combinations.map((c) => `${c.pattern} - ${c.name}`).join(", ") || "không có"}.`;
    streamResponse("/api/mysticism/ai-interpret", { type: "cat-hung", context });
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <VerdictBadge result={analysis.fullResult} label="Tổng luận đoán 10 số" />

      {compatDOB && dob && (
        <CompatibilityPanel
          compat={compatDOB}
          numStr={analysis.allDigits}
          ownerLabel="Số đường đời"
          ownerSubLabel={`sinh ${dob}`}
        />
      )}
      {compatName && !compatDOB && ownerName && (
        <CompatibilityPanel compat={compatName} numStr={analysis.allDigits} ownerLabel="Số mệnh" ownerSubLabel="chủ nhân" />
      )}

      <div className="grid md:grid-cols-2 gap-4">
        <SmallVerdictCard result={analysis.prefixResult} title="Đầu số (nhà mạng)" numStr={analysis.prefixDigits} />
        <SmallVerdictCard result={analysis.subscriberResult} title="Số thuê bao (6 cuối)" numStr={analysis.subscriberDigits} />
      </div>

      <div className="space-y-2">
        <p className="text-xs uppercase tracking-widest text-muted-foreground text-center">Toàn bộ 10 chữ số</p>
        <DigitRow digits={analysis.fullResult.digits} />
      </div>

      <ComboBadges combinations={analysis.fullResult.combinations} />

      <div className="space-y-3">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">Chi tiết từng chữ số</p>
        <div className="space-y-2">
          <p className="text-[11px] text-primary/70 uppercase tracking-widest font-semibold pl-1">Đầu số — {analysis.prefixDigits}</p>
          <DigitMeaningList digits={analysis.prefixResult.digits} />
          <p className="text-[11px] text-primary/70 uppercase tracking-widest font-semibold pl-1 mt-3">Số thuê bao — {analysis.subscriberDigits}</p>
          <DigitMeaningList digits={analysis.subscriberResult.digits} />
        </div>
      </div>

      <AIPanel onAsk={handleAskAI} isStreaming={isStreaming} messages={messages} />
    </div>
  );
}

function PlateResult({ result, numStr }: { result: CatHungResult; numStr: string }) {
  const { messages, streamResponse, isStreaming } = useSSEChat();
  const handleAskAI = () => {
    const context = `Phân tích cát hung biển số xe: ${numStr}. Kết quả: ${result.verdictLabel} (điểm: ${result.totalScore.toFixed(1)}). Chữ số: ${result.digits.map((d) => `${d.digit}(${d.meaning})`).join(", ")}. ${result.combinations.length > 0 ? `Tổ hợp: ${result.combinations.map((c) => `${c.pattern} - ${c.name}: ${c.meaning}`).join("; ")}.` : ""}`;
    streamResponse("/api/mysticism/ai-interpret", { type: "cat-hung", context });
  };
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <VerdictBadge result={result} />
      <DigitRow digits={result.digits} />
      <ComboBadges combinations={result.combinations} />
      <DigitMeaningList digits={result.digits} />
      <AIPanel onAsk={handleAskAI} isStreaming={isStreaming} messages={messages} />
    </div>
  );
}

interface PhoneState {
  mode: PhoneMode;
  sixResult?: { result: CatHungResult; numStr: string; ownerName?: string; compat?: CompatibilityResult };
  tenResult?: { analysis: FullPhoneAnalysis; ownerName?: string; dob?: string; compatName?: CompatibilityResult; compatDOB?: CompatibilityResult };
}

export default function CatHungPage() {
  const [phone, setPhone] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [dob, setDob] = useState("");
  const [phoneMode, setPhoneMode] = useState<PhoneMode>("6");
  const [phoneState, setPhoneState] = useState<PhoneState | null>(null);

  const [plate, setPlate] = useState("");
  const [plateResult, setPlateResult] = useState<{ result: CatHungResult; numStr: string } | null>(null);
  const [activeTab, setActiveTab] = useState("phone");

  const last6 = extractLastSixDigits(phone);
  const all10 = extractAllPhoneDigits(phone);
  const previewDigits = phoneMode === "6" ? last6 : all10;
  const previewReady = phoneMode === "6" ? last6.length === 6 : all10.length === 10;

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneMode === "6") {
      if (last6.length < 6) return;
      const result = analyzeCatHung(last6);
      const compat = ownerName.trim() ? analyzeCompatibility(ownerName.trim(), last6) : undefined;
      setPhoneState({ mode: "6", sixResult: { result, numStr: last6, ownerName: ownerName.trim(), compat } });
    } else {
      if (all10.length < 10) return;
      const analysis = analyzeFullPhone(phone);
      const compatName = ownerName.trim() ? analyzeCompatibility(ownerName.trim(), all10) : undefined;
      const compatDOB = dob.trim() && computeLifePathFromDOB(dob) > 0
        ? analyzeCompatibilityWithDOB(dob.trim(), all10)
        : undefined;
      setPhoneState({ mode: "10", tenResult: { analysis, ownerName: ownerName.trim(), dob: dob.trim(), compatName, compatDOB } });
    }
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
              Luận đoán may mắn từ số điện thoại và biển số xe theo huyền số học phương Đông.
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
                    Chọn chế độ phân tích và nhập thông tin chủ sở hữu để xem tương hợp.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="flex gap-2">
                    {([
                      { value: "6" as PhoneMode, label: "6 Số Cuối" },
                      { value: "10" as PhoneMode, label: "10 Số Đầy Đủ" },
                    ] as { value: PhoneMode; label: string }[]).map((m) => (
                      <button
                        key={m.value}
                        type="button"
                        onClick={() => { setPhoneMode(m.value); setPhoneState(null); }}
                        className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-all ${
                          phoneMode === m.value
                            ? "bg-primary/20 border-primary/60 text-primary"
                            : "bg-transparent border-border/40 text-muted-foreground hover:border-primary/30 hover:text-foreground"
                        }`}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>

                  <form onSubmit={handlePhoneSubmit} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
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
                      <div className="space-y-1.5">
                        <Label htmlFor="ownerName" className="text-primary-foreground">
                          Họ tên chủ sở hữu <span className="text-muted-foreground font-normal">(tùy chọn)</span>
                        </Label>
                        <Input
                          id="ownerName"
                          value={ownerName}
                          onChange={(e) => setOwnerName(e.target.value)}
                          placeholder="Ví dụ: Nguyễn Văn An"
                          className="bg-background/50 border-border/50 focus:border-primary/50 text-foreground"
                        />
                      </div>
                    </div>

                    {phoneMode === "10" && (
                      <div className="space-y-1.5">
                        <Label htmlFor="dob" className="text-primary-foreground">
                          Ngày tháng năm sinh <span className="text-muted-foreground font-normal">(tùy chọn — để kiểm tra tương hợp theo số đường đời)</span>
                        </Label>
                        <Input
                          id="dob"
                          value={dob}
                          onChange={(e) => setDob(e.target.value)}
                          placeholder="Ví dụ: 15/08/1990"
                          className="bg-background/50 border-border/50 focus:border-primary/50 text-foreground"
                        />
                      </div>
                    )}

                    {previewReady && (
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm bg-primary/5 border border-primary/15 rounded-lg px-4 py-2.5">
                        <span className="text-muted-foreground">
                          {phoneMode === "6" ? "6 số cuối:" : "10 số đầy đủ:"}
                        </span>
                        <span className="text-primary font-bold tracking-[0.18em] text-base font-serif">{previewDigits}</span>
                        {ownerName.trim() && (
                          <span className="text-muted-foreground">
                            Số mệnh <span className="text-foreground font-medium">{ownerName}</span>:{" "}
                            <span className="text-primary font-bold">{computeNameNumber(ownerName)}</span>
                          </span>
                        )}
                        {phoneMode === "10" && dob.trim() && computeLifePathFromDOB(dob) > 0 && (
                          <span className="text-muted-foreground">
                            Đường đời: <span className="text-primary font-bold">{computeLifePathFromDOB(dob)}</span>
                          </span>
                        )}
                        <span className="text-muted-foreground">
                          Năng lượng số: <span className="text-primary font-bold">{computePhoneEnergyNumber(previewDigits)}</span>
                        </span>
                      </div>
                    )}

                    <Button
                      type="submit"
                      disabled={!previewReady}
                      className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold tracking-wider"
                    >
                      LUẬN ĐOÁN
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {phoneState?.mode === "6" && phoneState.sixResult && (
                <SixDigitResult
                  result={phoneState.sixResult.result}
                  numStr={phoneState.sixResult.numStr}
                  ownerName={phoneState.sixResult.ownerName}
                  compat={phoneState.sixResult.compat}
                />
              )}
              {phoneState?.mode === "10" && phoneState.tenResult && (
                <TenDigitResult
                  analysis={phoneState.tenResult.analysis}
                  ownerName={phoneState.tenResult.ownerName}
                  dob={phoneState.tenResult.dob}
                  compatName={phoneState.tenResult.compatName}
                  compatDOB={phoneState.tenResult.compatDOB}
                />
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
              {plateResult && <PlateResult result={plateResult.result} numStr={plateResult.numStr} />}
            </TabsContent>
          </Tabs>

          <CatHungKnowledge />
        </div>
      </main>
    </div>
  );
}
