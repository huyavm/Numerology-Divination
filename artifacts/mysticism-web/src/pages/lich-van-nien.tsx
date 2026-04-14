import { useState, useMemo } from "react";
import { Navbar } from "@/components/layout/navbar";
import { buildMonthCalendar, formatLunar, getGioHoangDao, type DayInfo } from "@/lib/lunar-calendar";

const DOW = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
const MONTH_NAMES = ["", "Tháng Giêng", "Tháng Hai", "Tháng Ba", "Tháng Tư", "Tháng Năm", "Tháng Sáu",
  "Tháng Bảy", "Tháng Tám", "Tháng Chín", "Tháng Mười", "Tháng Mười Một", "Tháng Chạp"];

const RATING_CONFIG = {
  "Đại Cát": { bg: "bg-amber-500/20 border-amber-500/40", text: "text-amber-400", dot: "bg-amber-400" },
  "Cát": { bg: "bg-green-500/20 border-green-500/40", text: "text-green-400", dot: "bg-green-400" },
  "Bình": { bg: "bg-blue-500/10 border-blue-500/20", text: "text-blue-400", dot: "bg-blue-400" },
  "Hung": { bg: "bg-red-500/15 border-red-500/30", text: "text-red-400", dot: "bg-red-400" },
};

export default function LichVanNienPage() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [selected, setSelected] = useState<DayInfo | null>(null);

  const calendar = useMemo(() => buildMonthCalendar(year, month), [year, month]);

  const firstDow = new Date(year, month - 1, 1).getDay();
  const emptyCells = Array.from({ length: firstDow });

  const prevMonth = () => {
    if (month === 1) { setMonth(12); setYear((y) => y - 1); }
    else setMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (month === 12) { setMonth(1); setYear((y) => y + 1); }
    else setMonth((m) => m + 1);
  };

  const todayInfo = calendar.find((d) => {
    const t = new Date();
    return d.solar.getDate() === t.getDate() && year === t.getFullYear() && month === t.getMonth() + 1;
  });

  const sel = selected || todayInfo || calendar[0];

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 pt-20 pb-16 px-4">
        <div className="max-w-6xl mx-auto space-y-8">

          {/* Header */}
          <div className="text-center space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <p className="text-xs uppercase tracking-[0.3em] text-primary/60">Âm Dương Lịch</p>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">Lịch Vạn Niên</h1>
            <p className="text-muted-foreground">Tra cứu ngày âm lịch, Can Chi và ngày Hoàng Đạo</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
            {/* Calendar */}
            <div className="lg:col-span-2 border border-primary/20 rounded-2xl bg-card/30 overflow-hidden">
              {/* Nav */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-primary/10 bg-primary/5">
                <button onClick={prevMonth} className="w-9 h-9 rounded-full border border-primary/30 flex items-center justify-center text-primary hover:bg-primary/10 transition-colors">‹</button>
                <div className="text-center">
                  <div className="text-xl font-bold text-foreground">{MONTH_NAMES[month]} {year}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">Dương Lịch</div>
                </div>
                <button onClick={nextMonth} className="w-9 h-9 rounded-full border border-primary/30 flex items-center justify-center text-primary hover:bg-primary/10 transition-colors">›</button>
              </div>

              {/* Day of week header */}
              <div className="grid grid-cols-7 border-b border-primary/10">
                {DOW.map((d, i) => (
                  <div key={d} className={`py-2 text-center text-xs font-semibold tracking-wide ${i === 0 ? "text-red-400" : i === 6 ? "text-amber-400" : "text-muted-foreground"}`}>
                    {d}
                  </div>
                ))}
              </div>

              {/* Days grid */}
              <div className="grid grid-cols-7">
                {emptyCells.map((_, i) => <div key={`e-${i}`} />)}
                {calendar.map((day) => {
                  const dow = day.solar.getDay();
                  const isToday = day.solar.toDateString() === new Date().toDateString();
                  const isSelected = sel?.solar.toDateString() === day.solar.toDateString();
                  const cfg = RATING_CONFIG[day.rating];
                  return (
                    <button
                      key={day.solar.getDate()}
                      onClick={() => setSelected(day)}
                      className={`relative p-2 border border-transparent flex flex-col items-center gap-0.5 transition-all duration-150 hover:bg-primary/10 ${
                        isSelected ? "bg-primary/15 border-primary/40 rounded-lg" : ""
                      }`}
                    >
                      <span className={`text-sm font-semibold ${
                        isToday ? "w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center" :
                        dow === 0 ? "text-red-400" : dow === 6 ? "text-amber-400" : "text-foreground"
                      }`}>
                        {day.solar.getDate()}
                      </span>
                      <span className="text-[10px] text-muted-foreground/70 leading-none">{day.lunar.day}/{day.lunar.month}</span>
                      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                    </button>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="px-4 py-3 border-t border-primary/10 flex flex-wrap gap-4 text-xs text-muted-foreground">
                {Object.entries(RATING_CONFIG).map(([label, cfg]) => (
                  <div key={label} className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                    <span>{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Day Detail Panel */}
            {sel && (
              <div className="space-y-4">
                {/* Selected day info */}
                <div className={`rounded-2xl border p-5 space-y-4 ${RATING_CONFIG[sel.rating].bg}`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-3xl font-bold text-foreground">{sel.solar.getDate()}</div>
                      <div className="text-sm text-muted-foreground">
                        {["Chủ Nhật","Thứ Hai","Thứ Ba","Thứ Tư","Thứ Năm","Thứ Sáu","Thứ Bảy"][sel.solar.getDay()]},{" "}
                        {String(sel.solar.getDate()).padStart(2,"0")}/{String(month).padStart(2,"0")}/{year}
                      </div>
                    </div>
                    <div className={`text-sm font-bold px-3 py-1 rounded-full border ${RATING_CONFIG[sel.rating].bg} ${RATING_CONFIG[sel.rating].text}`}>
                      {sel.rating}
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <Row label="Âm lịch" value={`${sel.lunar.day} tháng ${sel.lunar.month}${sel.lunar.leap?" (nhuận)":""} năm ${sel.lunar.year}`} />
                    <Row label="Ngày" value={sel.canChiDay} />
                    <Row label="Tháng" value={sel.canChiMonth} />
                    <Row label="Năm" value={sel.canChiYear} />
                    <Row label="Hoàng đạo" value={sel.hoangDao ? "Ngày Hoàng Đạo" : "Ngày Hắc Đạo"} valueClass={sel.hoangDao ? "text-amber-400" : "text-red-400"} />
                  </div>

                  <div className="border-t border-white/10 pt-3">
                    <p className="text-xs text-muted-foreground leading-relaxed">{sel.note}</p>
                  </div>
                </div>

                {/* Giờ Hoàng Đạo */}
                <div className="rounded-2xl border border-primary/20 bg-card/30 p-5 space-y-3">
                  <h3 className="text-sm font-semibold text-primary">Giờ Hoàng Đạo</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {getGioHoangDao(sel.lunar.day).map((gio) => (
                      <span key={gio} className="text-xs px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300">{gio}</span>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">Các giờ tốt trong ngày, thích hợp khởi sự công việc quan trọng</p>
                </div>

                {/* Nên / Không nên */}
                <div className="rounded-2xl border border-primary/20 bg-card/30 p-5 space-y-3">
                  <h3 className="text-sm font-semibold text-primary">Hướng dẫn ngày</h3>
                  {sel.rating === "Đại Cát" || sel.rating === "Cát" ? (
                    <div className="space-y-2 text-xs text-muted-foreground">
                      <p className="text-green-400 font-medium">Nên làm:</p>
                      <p>Ký hợp đồng, khai trương, cưới hỏi, xuất hành, giao dịch lớn, xây dựng, nhập học</p>
                    </div>
                  ) : sel.rating === "Hung" ? (
                    <div className="space-y-2 text-xs text-muted-foreground">
                      <p className="text-red-400 font-medium">Nên tránh:</p>
                      <p>Khai trương, ký kết hợp đồng quan trọng, khởi sự việc lớn, xuất hành xa, phẫu thuật</p>
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground">Ngày bình thường, có thể xử lý các công việc thông thường</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Month overview */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
            {Object.entries(RATING_CONFIG).map(([label, cfg]) => {
              const count = calendar.filter((d) => d.rating === label).length;
              return (
                <div key={label} className={`rounded-xl border p-4 text-center ${cfg.bg}`}>
                  <div className={`text-2xl font-bold ${cfg.text}`}>{count}</div>
                  <div className="text-xs text-muted-foreground mt-1">Ngày {label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}

function Row({ label, value, valueClass = "text-foreground" }: { label: string; value: string; valueClass?: string }) {
  return (
    <div className="flex justify-between gap-2">
      <span className="text-muted-foreground">{label}:</span>
      <span className={`font-medium text-right ${valueClass}`}>{value}</span>
    </div>
  );
}
