import { useState } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { computeBatu, Pillar, NguyenHanhItem } from "@/lib/batu";
import { useAISSEChat } from "@/hooks/use-ai-sse-chat";
import { useExportImage } from "@/hooks/use-export-image";
import { Progress } from "@/components/ui/progress";
import { MarkdownRenderer } from "@/components/ui/markdown-renderer";
import { BatuKnowledge } from "@/components/knowledge-base";
import { BatuExportCard } from "@/components/export-card-batu";
import { ExportDownloadBar } from "@/components/export-download-bar";
import { cn } from "@/lib/utils";
import { dateInputToDisplay, validateDateDisplay, hourToCanChi } from "@/lib/form-utils";

export default function BatuPage() {
  const [date, setDate] = useState("");
  const [dateInput, setDateInput] = useState("");
  const [time, setTime] = useState("06:00");
  const [errors, setErrors] = useState({ date: "", time: "" });
  const [touched, setTouched] = useState({ date: false, time: false });
  const [results, setResults] = useState<{
    nam: Pillar;
    thang: Pillar;
    ngay: Pillar;
    gio: Pillar;
    nguHanhAnalysis: NguyenHanhItem[];
  } | null>(null);

  const { messages, streamResponse, isStreaming } = useAISSEChat();
  const { exportRef, downloadAsImage, downloadAsText, isExporting } = useExportImage();

  const handleDateChange = (val: string) => {
    setDateInput(val);
    const display = dateInputToDisplay(val);
    setDate(display);
    if (touched.date) setErrors((e) => ({ ...e, date: validateDateDisplay(display) }));
  };

  const selectedHour = time ? parseInt(time.split(":")[0], 10) : null;

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    const dateErr = validateDateDisplay(date);
    const timeErr = !time ? "Vui lòng chọn giờ sinh." : "";
    setErrors({ date: dateErr, time: timeErr });
    setTouched({ date: true, time: true });
    if (dateErr || timeErr) return;
    setResults(computeBatu(date, time));
  };

  const handleAskAI = () => {
    if (!results) return;
    const context = `Lá số Bát Tự. Trụ Năm: ${results.nam.thienCan} ${results.nam.diaChi} (${results.nam.nguHanh}). Trụ Tháng: ${results.thang.thienCan} ${results.thang.diaChi} (${results.thang.nguHanh}). Trụ Ngày: ${results.ngay.thienCan} ${results.ngay.diaChi} (${results.ngay.nguHanh}). Trụ Giờ: ${results.gio.thienCan} ${results.gio.diaChi} (${results.gio.nguHanh}). Phân tích ngũ hành: ${results.nguHanhAnalysis.map((x) => `${x.element}: ${x.percentage}%`).join(", ")}.`;
    streamResponse("/api/mysticism/ai-interpret", { type: "batu", context });
  };

  const aiText = messages.filter((m) => m.role === "assistant").map((m) => m.content).join("");

  const buildTextContent = () => {
    if (!results) return "";
    return [
      `Ngày sinh: ${date} | Giờ sinh: ${time}`,
      "",
      "TỨ TRỤ:",
      `Trụ Giờ:   ${results.gio.thienCan} ${results.gio.diaChi} (${results.gio.nguHanh})`,
      `Trụ Ngày:  ${results.ngay.thienCan} ${results.ngay.diaChi} (${results.ngay.nguHanh})`,
      `Trụ Tháng: ${results.thang.thienCan} ${results.thang.diaChi} (${results.thang.nguHanh})`,
      `Trụ Năm:   ${results.nam.thienCan} ${results.nam.diaChi} (${results.nam.nguHanh})`,
      "",
      "PHÂN TÍCH NGŨ HÀNH:",
      ...results.nguHanhAnalysis.map((x) => `${x.element}: ${x.percentage}%`),
      aiText ? `\nLUẬN GIẢI AI:\n${aiText}` : "",
    ].join("\n");
  };

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background pointer-events-none" />
      <Navbar />

      {/* Hidden export card */}
      <div style={{ position: "absolute", left: -9999, top: 0, pointerEvents: "none", zIndex: -1 }}>
        {results && (
          <BatuExportCard
            ref={exportRef}
            date={date}
            time={time}
            gio={results.gio}
            ngay={results.ngay}
            thang={results.thang}
            nam={results.nam}
            nguHanhAnalysis={results.nguHanhAnalysis}
            aiText={aiText || undefined}
          />
        )}
      </div>

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
                  {/* Ngày sinh */}
                  <div className="space-y-2">
                    <Label htmlFor="date-batu" className="flex items-center gap-1.5 text-sm font-medium text-foreground/80">
                      <svg className="w-4 h-4 text-primary/70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeWidth={1.8}/><line x1="16" y1="2" x2="16" y2="6" strokeWidth={1.8}/><line x1="8" y1="2" x2="8" y2="6" strokeWidth={1.8}/><line x1="3" y1="10" x2="21" y2="10" strokeWidth={1.8}/></svg>
                      Ngày sinh (dương lịch)
                    </Label>
                    <div className="relative">
                      <input
                        id="date-batu"
                        type="date"
                        value={dateInput}
                        onChange={(e) => { handleDateChange(e.target.value); setTouched((t) => ({ ...t, date: true })); }}
                        onBlur={() => { setTouched((t) => ({ ...t, date: true })); setErrors((e) => ({ ...e, date: validateDateDisplay(date) })); }}
                        min="1900-01-01"
                        max={new Date().toISOString().split("T")[0]}
                        className={cn(
                          "flex h-10 w-full rounded-md border bg-background/50 px-3 py-2 pl-10 text-sm [color-scheme:dark] transition-all duration-200 outline-none",
                          touched.date && errors.date ? "border-red-500/70 focus:ring-1 focus:ring-red-500/40"
                            : dateInput ? "border-green-500/50 focus:ring-1 focus:ring-green-500/30"
                            : "border-border/50 focus:border-primary/50 focus:ring-1 focus:ring-primary/20"
                        )}
                      />
                      <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeWidth={1.8}/><line x1="16" y1="2" x2="16" y2="6" strokeWidth={1.8}/><line x1="8" y1="2" x2="8" y2="6" strokeWidth={1.8}/><line x1="3" y1="10" x2="21" y2="10" strokeWidth={1.8}/></svg>
                    </div>
                    {touched.date && errors.date && <p className="text-xs text-red-400 flex items-center gap-1"><svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/></svg>{errors.date}</p>}
                    {dateInput && !errors.date && <p className="text-xs text-muted-foreground">Dương lịch: <span className="text-primary/80 font-medium">{date}</span></p>}
                  </div>

                  {/* Giờ sinh */}
                  <div className="space-y-2">
                    <Label htmlFor="time-batu" className="flex items-center gap-1.5 text-sm font-medium text-foreground/80">
                      <svg className="w-4 h-4 text-primary/70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" strokeWidth={1.8}/><polyline points="12 6 12 12 16 14" strokeWidth={1.8}/></svg>
                      Giờ sinh
                    </Label>
                    <div className="relative">
                      <input
                        id="time-batu"
                        type="time"
                        value={time}
                        onChange={(e) => { setTime(e.target.value); setTouched((t) => ({ ...t, time: true })); }}
                        className={cn(
                          "flex h-10 w-full rounded-md border bg-background/50 px-3 py-2 pl-10 text-sm [color-scheme:dark] transition-all duration-200 outline-none",
                          time ? "border-green-500/50 focus:ring-1 focus:ring-green-500/30"
                            : "border-border/50 focus:border-primary/50 focus:ring-1 focus:ring-primary/20"
                        )}
                      />
                      <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" strokeWidth={1.8}/><polyline points="12 6 12 12 16 14" strokeWidth={1.8}/></svg>
                    </div>
                    {selectedHour !== null && (
                      <p className="text-xs text-primary/70 flex items-center gap-1">
                        <span className="text-primary font-semibold">✦</span>
                        {hourToCanChi(selectedHour)}
                      </p>
                    )}
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={!dateInput || !time}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold tracking-wider disabled:opacity-40"
                >
                  LẬP LÁ SỐ
                </Button>
              </form>
            </CardContent>
          </Card>

          {results && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
              {/* Export bar */}
              <ExportDownloadBar
                onDownloadImage={() => downloadAsImage(`bat-tu-${date.replace(/\//g, "-")}`)}
                onDownloadText={() => downloadAsText(buildTextContent(), `bat-tu-${date.replace(/\//g, "-")}`)}
                isExporting={isExporting}
              />

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { title: "Trụ Giờ", data: results.gio },
                  { title: "Trụ Ngày", data: results.ngay },
                  { title: "Trụ Tháng", data: results.thang },
                  { title: "Trụ Năm", data: results.nam },
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
                  <CardTitle className="text-2xl text-primary flex items-center justify-between flex-wrap gap-3">
                    <span>Hỏi AI về lá số của bạn</span>
                    <Button onClick={handleAskAI} disabled={isStreaming} variant="outline" className="border-primary/50 text-primary hover:bg-primary/10">
                      {isStreaming ? "Đang lắng nghe vũ trụ..." : "Luận giải lá số"}
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
