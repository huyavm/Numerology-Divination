import { useState } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { calculateTuVi, THIEN_CAN, DIA_CHI, NGU_HANH_COLOR, type TuViResult, type CungInfo } from "@/lib/tu-vi";
import { TuViKnowledge } from "@/components/knowledge-base";
import { solarToLunar } from "@/lib/lunar-calendar";
import { useAISSEChat } from "@/hooks/use-ai-sse-chat";
import { useExportImage } from "@/hooks/use-export-image";
import { MarkdownRenderer } from "@/components/ui/markdown-renderer";
import { ResultActions } from "@/components/result-actions";
import { TuViExportCard } from "@/components/export-card-tuvi";
import { ExportDownloadBar } from "@/components/export-download-bar";

const CUONG_TUOC = ["Vượng", "Miếu", "Đắc", "Bình", "Hãm"];

function StarBadge({ name, type }: { name: string; type: string }) {
  const style =
    type === "chinh-tinh" ? "bg-primary/20 border-primary/50 text-primary" :
    type === "phu-tinh" ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400" :
    "bg-red-500/15 border-red-500/30 text-red-400";
  return (
    <span className={`inline-flex text-[10px] px-1.5 py-0.5 rounded border font-medium leading-none ${style}`}>
      {name}
    </span>
  );
}

function CungCard({ cung, isMenh, isThan, onClick, selected }: {
  cung: CungInfo;
  isMenh: boolean;
  isThan: boolean;
  onClick: () => void;
  selected: boolean;
}) {
  const border = isMenh ? "border-primary/70 ring-1 ring-primary/40" :
    isThan ? "border-amber-500/50 ring-1 ring-amber-500/30" :
    selected ? "border-primary/40" : "border-primary/15";

  return (
    <button
      onClick={onClick}
      className={`relative text-left p-3 rounded-xl border bg-card/30 hover:bg-card/60 transition-all duration-200 ${border}`}
    >
      {(isMenh || isThan) && (
        <div className={`absolute -top-2 left-2 text-[9px] px-1.5 py-0.5 rounded-full font-bold ${isMenh ? "bg-primary text-primary-foreground" : "bg-amber-500 text-black"}`}>
          {isMenh ? "MỆNH" : "THÂN"}
        </div>
      )}
      <div className="flex items-start justify-between gap-1 mb-1.5">
        <div>
          <div className="text-[10px] text-muted-foreground">{cung.thienCan} {cung.diaChi}</div>
          <div className="text-xs font-bold text-foreground">{cung.name}</div>
        </div>
        <div className="text-[10px] text-muted-foreground text-right shrink-0">{cung.nguHanh}</div>
      </div>
      <div className="flex flex-wrap gap-1">
        {cung.stars.slice(0, 4).map((s) => (
          <StarBadge key={s.name} name={s.name} type={s.type} />
        ))}
        {cung.stars.length > 4 && (
          <span className="text-[10px] text-muted-foreground">+{cung.stars.length - 4}</span>
        )}
      </div>
    </button>
  );
}

export default function TuViPage() {
  const [form, setForm] = useState({ year: "", month: "", day: "", hour: "12", gender: "nam" as "nam" | "nu" });
  const [result, setResult] = useState<TuViResult | null>(null);
  const [selectedCung, setSelectedCung] = useState<CungInfo | null>(null);
  const [error, setError] = useState("");
  const { messages, streamResponse, isStreaming, setMessages } = useAISSEChat();
  const { exportRef, downloadAsImage, downloadAsText, isExporting } = useExportImage();

  const handleCalculate = () => {
    setError("");
    const { year, month, day, hour, gender } = form;
    const y = parseInt(year), m = parseInt(month), d = parseInt(day), h = parseInt(hour);
    if (!y || !m || !d || m < 1 || m > 12 || d < 1 || d > 31) {
      setError("Vui lòng nhập ngày sinh hợp lệ.");
      return;
    }
    const lunar = solarToLunar(d, m, y);
    const res = calculateTuVi(lunar.year, lunar.month, lunar.day, h, gender);
    setResult(res);
    setSelectedCung(res.cungList[res.cungMenh]);
    setMessages([]);
  };

  const handleAI = () => {
    if (!result || !selectedCung) return;
    const context = `Lá số Tử Vi:\n- Năm sinh: ${form.year}, tháng ${form.month}, ngày ${form.day}, giờ ${form.hour}:00\n- Can năm: ${result.canNam} ${result.chiNam}\n- Mệnh cục: ${result.cuccDesc}\n- ${result.menhDesc}\n- Cung đang xem: ${selectedCung.name} (${selectedCung.diaChi})\n- Sao trong cung: ${selectedCung.stars.map(s => s.name).join(", ")}\n\nHãy luận giải chi tiết cung ${selectedCung.name} với các sao trên trong lá số Tử Vi của người này.`;
    streamResponse("/api/mysticism/ai-interpret", { type: "batu", context });
  };

  const aiText = messages.filter((m) => m.role === "assistant").map((m) => m.content).join("");

  const buildTextContent = () => {
    if (!result) return "";
    const lines = [
      `LÁ SỐ TỬ VI`,
      `Ngày sinh: ${form.day}/${form.month}/${form.year} | Giờ: ${form.hour}:00 | Giới tính: ${form.gender === "nam" ? "Nam" : "Nữ"}`,
      "",
      `MỆNH CỤC: ${result.cuccDesc} | Ngũ hành: ${result.nguHanhCuc}`,
      `Can Chi năm: ${result.canNam} ${result.chiNam}`,
      `${result.menhDesc}`,
      "",
      "12 CUNG MỆNH:",
      ...result.cungList.map((c) => {
        const stars = c.stars.map((s) => s.name).join(", ");
        return `  ${c.name} (${c.thienCan} ${c.diaChi}): ${stars || "—"}`;
      }),
      aiText ? `\nLUẬN GIẢI AI:\n${aiText}` : "",
    ];
    return lines.join("\n");
  };

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background">
      {/* Hidden export card */}
      <div style={{ position: "absolute", left: -9999, top: 0, pointerEvents: "none", zIndex: -1 }}>
        {result && (
          <TuViExportCard
            ref={exportRef}
            result={result}
            birthInfo={`${form.day}/${form.month}/${form.year} giờ ${form.hour}:00 — ${form.gender === "nam" ? "Nam" : "Nữ"}`}
            aiText={aiText || undefined}
          />
        )}
      </div>
      <Navbar />
      <main className="flex-1 pt-20 pb-16 px-4">
        <div className="max-w-6xl mx-auto space-y-8">

          {/* Header */}
          <div className="text-center space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <p className="text-xs uppercase tracking-[0.3em] text-primary/60">Tử Bình Mệnh Lý</p>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">Tử Vi Đẩu Số</h1>
            <p className="text-muted-foreground">Lập lá số Tử Vi 12 cung dựa trên ngày giờ sinh</p>
          </div>

          {/* Input Form */}
          <div className="max-w-2xl mx-auto border border-primary/25 bg-card/30 rounded-2xl p-6 space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
            <h2 className="text-lg font-semibold text-primary">Nhập thông tin</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Ngày sinh DL</Label>
                <Input value={form.day} onChange={(e) => setForm((f) => ({ ...f, day: e.target.value }))}
                  placeholder="DD" maxLength={2} className="text-center" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Tháng sinh</Label>
                <Input value={form.month} onChange={(e) => setForm((f) => ({ ...f, month: e.target.value }))}
                  placeholder="MM" maxLength={2} className="text-center" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Năm sinh</Label>
                <Input value={form.year} onChange={(e) => setForm((f) => ({ ...f, year: e.target.value }))}
                  placeholder="YYYY" maxLength={4} className="text-center" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Giờ sinh (0-23)</Label>
                <Input value={form.hour} onChange={(e) => setForm((f) => ({ ...f, hour: e.target.value }))}
                  placeholder="HH" maxLength={2} className="text-center" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Giới tính</Label>
              <div className="flex gap-3">
                {["nam", "nu"].map((g) => (
                  <button key={g} onClick={() => setForm((f) => ({ ...f, gender: g as "nam" | "nu" }))}
                    className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-all ${form.gender === g ? "border-primary bg-primary/20 text-primary" : "border-border/50 text-muted-foreground hover:border-primary/30"}`}>
                    {g === "nam" ? "Nam" : "Nữ"}
                  </button>
                ))}
              </div>
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button onClick={handleCalculate} className="w-full bg-primary text-primary-foreground font-semibold">
              Lập Lá Số Tử Vi
            </Button>
          </div>

          {/* Result */}
          {result && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
              {/* Export bar */}
              <ExportDownloadBar
                onDownloadImage={() => downloadAsImage(`tu-vi-${form.day}-${form.month}-${form.year}`)}
                onDownloadText={() => downloadAsText(buildTextContent(), `tu-vi-${form.day}-${form.month}-${form.year}`)}
                isExporting={isExporting}
              />
              {/* Summary */}
              <div className="grid sm:grid-cols-3 gap-4">
                <InfoCard label="Mệnh Cục" value={result.cuccDesc} sub={`Ngũ Hành: ${result.nguHanhCuc}`} />
                <InfoCard label="Can Chi Năm" value={`${result.canNam} ${result.chiNam}`} sub={`Cung Mệnh: ${DIA_CHI[result.cungMenh]}`} />
                <InfoCard label="Cung Thân" value={DIA_CHI[result.cungThanMenh]} sub="Cung Thân Mệnh" />
              </div>
              <p className="text-sm text-muted-foreground text-center italic">{result.menhDesc}</p>

              {/* 12 Palaces Grid */}
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-4">12 Cung Mệnh</h2>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {result.cungList.map((cung) => (
                    <CungCard
                      key={cung.index}
                      cung={cung}
                      isMenh={cung.index === result.cungMenh}
                      isThan={cung.index === result.cungThanMenh}
                      selected={selectedCung?.index === cung.index}
                      onClick={() => setSelectedCung(cung)}
                    />
                  ))}
                </div>
              </div>

              {/* Selected Cung Detail */}
              {selectedCung && (
                <div className="border border-primary/25 rounded-2xl p-6 bg-card/30 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-xs text-muted-foreground">{selectedCung.thienCan} {selectedCung.diaChi} — {selectedCung.nguHanh}</div>
                      <h3 className="text-xl font-bold text-primary">Cung {selectedCung.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{selectedCung.desc}</p>
                    </div>
                    <Button onClick={handleAI} disabled={isStreaming}
                      className="text-xs bg-primary/20 text-primary border border-primary/40 hover:bg-primary/30 px-3 py-1.5">
                      {isStreaming ? "Đang luận giải..." : "Luận giải AI"}
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {["chinh-tinh", "phu-tinh", "sat-tinh"].map((type) => {
                      const stars = selectedCung.stars.filter((s) => s.type === type);
                      if (!stars.length) return null;
                      const label = type === "chinh-tinh" ? "Chính Tinh" : type === "phu-tinh" ? "Phụ Tinh" : "Sát Tinh";
                      return (
                        <div key={type}>
                          <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">{label}</div>
                          <div className="space-y-2">
                            {stars.map((s) => (
                              <div key={s.name} className="flex gap-3 items-start">
                                <StarBadge name={s.name} type={s.type} />
                                <p className="text-xs text-muted-foreground leading-relaxed flex-1">{s.desc}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* AI Interpretation */}
              {messages.length > 0 && (
                <div className="border border-primary/25 rounded-2xl p-6 bg-card/30 space-y-4">
                  <h3 className="text-lg font-semibold text-primary">Luận Giải AI</h3>
                  {messages.filter((m) => m.role === "assistant").map((m, i) => (
                    <div key={i} className="text-sm text-foreground/90">
                      {!m.content && isStreaming ? (
                        <div className="flex gap-1.5">
                          {[0, 150, 300].map((d) => (
                            <span key={d} className="w-2 h-2 rounded-full bg-primary/70 animate-bounce" style={{ animationDelay: `${d}ms` }} />
                          ))}
                        </div>
                      ) : (
                        <MarkdownRenderer content={m.content} />
                      )}
                    </div>
                  ))}
                  {aiText && (
                    <ResultActions
                      module="tu-vi"
                      moduleName="Tử Vi Đẩu Số"
                      title={`Cung ${selectedCung?.name || ""} — ${form.day}/${form.month}/${form.year}`}
                      summary={`Lá số Tử Vi: ${result.cuccDesc}, Cung ${selectedCung?.name}`}
                      result={aiText}
                    />
                  )}
                </div>
              )}
            </div>
          )}
          {/* Knowledge Base */}
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
            <TuViKnowledge />
          </div>

        </div>
      </main>
    </div>
  );
}

function InfoCard({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="border border-primary/20 rounded-xl bg-card/30 p-4 text-center">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-lg font-bold text-primary mt-1">{value}</div>
      <div className="text-xs text-muted-foreground/70 mt-0.5">{sub}</div>
    </div>
  );
}
