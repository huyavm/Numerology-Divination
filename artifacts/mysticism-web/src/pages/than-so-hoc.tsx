import { useState } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { computeLifePathNumber, computeSoulNumber, computeDestinyNumber, computePersonalityNumber, getNumberMeaning } from "@/lib/numerology";
import { useAISSEChat } from "@/hooks/use-ai-sse-chat";
import { useExportImage } from "@/hooks/use-export-image";
import { MarkdownRenderer } from "@/components/ui/markdown-renderer";
import { NumerologyKnowledge } from "@/components/knowledge-base";
import { NumerologyExportCard } from "@/components/export-card-numerology";
import { ExportDownloadBar } from "@/components/export-download-bar";
import { cn } from "@/lib/utils";
import { dateInputToDisplay, validateName, validateDateDisplay } from "@/lib/form-utils";

export default function NumerologyPage() {
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [dobInput, setDobInput] = useState("");
  const [errors, setErrors] = useState({ name: "", dob: "" });
  const [touched, setTouched] = useState({ name: false, dob: false });
  const [results, setResults] = useState<{
    lifePath: number;
    soul: number;
    destiny: number;
    personality: number;
  } | null>(null);

  const { messages, streamResponse, isStreaming } = useAISSEChat();
  const { exportRef, downloadAsImage, downloadAsText, isExporting } = useExportImage();

  const handleNameChange = (val: string) => {
    const upper = val.toUpperCase();
    setName(upper);
    if (touched.name) setErrors((e) => ({ ...e, name: validateName(upper) }));
  };

  const handleDateChange = (val: string) => {
    setDobInput(val);
    const display = dateInputToDisplay(val);
    setDob(display);
    if (touched.dob) setErrors((e) => ({ ...e, dob: validateDateDisplay(display) }));
  };

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    const nameErr = validateName(name);
    const dobErr = validateDateDisplay(dob);
    setErrors({ name: nameErr, dob: dobErr });
    setTouched({ name: true, dob: true });
    if (nameErr || dobErr) return;
    setResults({
      lifePath: computeLifePathNumber(dob),
      soul: computeSoulNumber(name),
      destiny: computeDestinyNumber(name),
      personality: computePersonalityNumber(name),
    });
  };

  const handleAskAI = () => {
    if (!results) return;
    const lp = getNumberMeaning(results.lifePath);
    const context = `Người này tên là ${name}, sinh ngày ${dob}. Số đường đời: ${results.lifePath} (${lp.title}). Số linh hồn: ${results.soul}. Số sứ mệnh: ${results.destiny}. Số nhân cách: ${results.personality}.`;
    streamResponse("/api/mysticism/ai-interpret", { type: "numerology", context });
  };

  const aiText = messages.filter((m) => m.role === "assistant").map((m) => m.content).join("");

  const buildTextContent = () => {
    if (!results) return "";
    const lp = getNumberMeaning(results.lifePath);
    return [
      `Họ tên: ${name}`,
      `Ngày sinh: ${dob}`,
      "",
      `SỐ ĐƯỜNG ĐỜI: ${results.lifePath}`,
      getNumberMeaning(results.lifePath).description,
      `Điểm mạnh: ${getNumberMeaning(results.lifePath).strengths.join(", ")}`,
      `Thách thức: ${getNumberMeaning(results.lifePath).challenges.join(", ")}`,
      "",
      `SỐ SỨ MỆNH: ${results.destiny}`,
      getNumberMeaning(results.destiny).description,
      "",
      `SỐ LINH HỒN: ${results.soul}`,
      getNumberMeaning(results.soul).description,
      "",
      `SỐ NHÂN CÁCH: ${results.personality}`,
      getNumberMeaning(results.personality).description,
      aiText ? `\nLUẬN GIẢI AI:\n${aiText}` : "",
    ].join("\n");
  };

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background pointer-events-none" />
      <Navbar />

      {/* Hidden export card — off-screen for html2canvas */}
      <div style={{ position: "absolute", left: -9999, top: 0, pointerEvents: "none", zIndex: -1 }}>
        {results && (
          <NumerologyExportCard
            ref={exportRef}
            name={name}
            dob={dob}
            lifePath={results.lifePath}
            soul={results.soul}
            destiny={results.destiny}
            personality={results.personality}
            aiText={aiText || undefined}
          />
        )}
      </div>

      <main className="flex-1 container mx-auto px-4 pt-24 pb-16 z-10 relative">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground drop-shadow-md">Thần số học</h1>
            <p className="text-muted-foreground text-lg">Khám phá ý nghĩa ẩn giấu đằng sau tên gọi và ngày sinh của bạn.</p>
          </div>

          <Card className="bg-card/40 backdrop-blur-sm border-primary/20 shadow-xl shadow-primary/5">
            <CardHeader>
              <CardTitle className="text-2xl text-primary">Nhập thông tin</CardTitle>
              <CardDescription>Họ tên đầy đủ và ngày sinh dương lịch để tính các con số huyền học.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCalculate} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Họ tên */}
                  <div className="space-y-2">
                    <Label htmlFor="name" className="flex items-center gap-1.5 text-sm font-medium text-foreground/80">
                      <svg className="w-4 h-4 text-primary/70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                      Họ và tên đầy đủ
                    </Label>
                    <div className="relative">
                      <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => handleNameChange(e.target.value)}
                        onBlur={() => { setTouched((t) => ({ ...t, name: true })); setErrors((e) => ({ ...e, name: validateName(name) })); }}
                        placeholder="NGUYỄN VĂN A"
                        className={cn(
                          "flex h-10 w-full rounded-md border bg-background/50 px-3 py-2 pl-10 text-sm uppercase tracking-wider transition-all duration-200 outline-none",
                          "placeholder:text-muted-foreground/50 placeholder:normal-case placeholder:tracking-normal",
                          touched.name && errors.name ? "border-red-500/70 focus:ring-1 focus:ring-red-500/40"
                            : name && !errors.name ? "border-green-500/50 focus:ring-1 focus:ring-green-500/30"
                            : "border-border/50 focus:border-primary/50 focus:ring-1 focus:ring-primary/20"
                        )}
                      />
                      <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                    </div>
                    {touched.name && errors.name && <p className="text-xs text-red-400 flex items-center gap-1"><svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/></svg>{errors.name}</p>}
                    {name && !errors.name && <p className="text-xs text-green-400 flex items-center gap-1"><svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>Tên hợp lệ</p>}
                  </div>

                  {/* Ngày sinh */}
                  <div className="space-y-2">
                    <Label htmlFor="dob" className="flex items-center gap-1.5 text-sm font-medium text-foreground/80">
                      <svg className="w-4 h-4 text-primary/70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeWidth={1.8}/><line x1="16" y1="2" x2="16" y2="6" strokeWidth={1.8}/><line x1="8" y1="2" x2="8" y2="6" strokeWidth={1.8}/><line x1="3" y1="10" x2="21" y2="10" strokeWidth={1.8}/></svg>
                      Ngày sinh (dương lịch)
                    </Label>
                    <div className="relative">
                      <input
                        id="dob"
                        type="date"
                        value={dobInput}
                        onChange={(e) => { handleDateChange(e.target.value); setTouched((t) => ({ ...t, dob: true })); }}
                        onBlur={() => { setTouched((t) => ({ ...t, dob: true })); setErrors((e) => ({ ...e, dob: validateDateDisplay(dob) })); }}
                        min="1900-01-01"
                        max={new Date().toISOString().split("T")[0]}
                        className={cn(
                          "flex h-10 w-full rounded-md border bg-background/50 px-3 py-2 pl-10 text-sm [color-scheme:dark] transition-all duration-200 outline-none",
                          "placeholder:text-muted-foreground/50",
                          touched.dob && errors.dob ? "border-red-500/70 focus:ring-1 focus:ring-red-500/40"
                            : dobInput ? "border-green-500/50 focus:ring-1 focus:ring-green-500/30"
                            : "border-border/50 focus:border-primary/50 focus:ring-1 focus:ring-primary/20"
                        )}
                      />
                      <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeWidth={1.8}/><line x1="16" y1="2" x2="16" y2="6" strokeWidth={1.8}/><line x1="8" y1="2" x2="8" y2="6" strokeWidth={1.8}/><line x1="3" y1="10" x2="21" y2="10" strokeWidth={1.8}/></svg>
                    </div>
                    {touched.dob && errors.dob && <p className="text-xs text-red-400 flex items-center gap-1"><svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/></svg>{errors.dob}</p>}
                    {dobInput && !errors.dob && <p className="text-xs text-muted-foreground">Dương lịch: <span className="text-primary/80 font-medium">{dob}</span></p>}
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={!!(!name || !dobInput)}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold tracking-wider disabled:opacity-40"
                >
                  LUẬN GIẢI
                </Button>
              </form>
            </CardContent>
          </Card>

          {results && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
              {/* Export bar */}
              <ExportDownloadBar
                onDownloadImage={() => downloadAsImage(`than-so-hoc-${name.replace(/\s+/g, "-")}`)}
                onDownloadText={() => downloadAsText(buildTextContent(), `than-so-hoc-${name.replace(/\s+/g, "-")}`)}
                isExporting={isExporting}
              />

              <div className="grid md:grid-cols-2 gap-6">
                {[
                  { label: "Đường Đời", value: results.lifePath },
                  { label: "Sứ Mệnh", value: results.destiny },
                  { label: "Linh Hồn", value: results.soul },
                  { label: "Nhân Cách", value: results.personality },
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
                  <CardTitle className="text-2xl text-primary flex items-center justify-between flex-wrap gap-3">
                    <span>Hỏi AI về kết quả của bạn</span>
                    <Button onClick={handleAskAI} disabled={isStreaming} variant="outline" className="border-primary/50 text-primary hover:bg-primary/10">
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
                        <div className="flex items-center gap-2 text-muted-foreground text-sm">
                          {[0, 150, 300].map((d) => (
                            <span key={d} className="inline-block w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: `${d}ms` }} />
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                  {!messages.some((m) => m.role === "assistant") && !isStreaming && (
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
