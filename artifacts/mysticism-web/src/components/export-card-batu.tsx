import { forwardRef } from "react";
import { type Pillar, type NguyenHanhItem } from "@/lib/batu";

interface Props {
  date: string;
  time: string;
  gio: Pillar;
  ngay: Pillar;
  thang: Pillar;
  nam: Pillar;
  nguHanhAnalysis: NguyenHanhItem[];
  aiText?: string;
}

const GOLD = "#c9a227";
const BG = "#0d0818";
const BG2 = "#140d24";
const TEXT = "#f0e6d0";
const MUTED = "#9b8e78";
const BORDER = "#2e2040";
const FONT = '"Arial", "Helvetica Neue", Helvetica, sans-serif';

const NGU_HANH_COLOR: Record<string, string> = {
  "Moc": "#4ade80",
  "Hoa": "#f87171",
  "Tho": "#fbbf24",
  "Kim": "#94a3b8",
  "Thuy": "#60a5fa",
  "Mộc": "#4ade80",
  "Hỏa": "#f87171",
  "Thổ": "#fbbf24",
  "Thủy": "#60a5fa",
};

export const BatuExportCard = forwardRef<HTMLDivElement, Props>(
  ({ date, time, gio, ngay, thang, nam, nguHanhAnalysis, aiText }, ref) => {
    const pillars = [
      { title: "Tru Gio", data: gio },
      { title: "Tru Ngay", data: ngay },
      { title: "Tru Thang", data: thang },
      { title: "Tru Nam", data: nam },
    ];

    return (
      <div
        ref={ref}
        style={{
          width: 800,
          background: BG,
          color: TEXT,
          fontFamily: FONT,
          padding: "40px",
          boxSizing: "border-box",
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 32, borderBottom: `1px solid ${BORDER}`, paddingBottom: 24 }}>
          <div style={{ color: GOLD, fontSize: 12, letterSpacing: "0.35em", textTransform: "uppercase", marginBottom: 6 }}>
            HUYEN BI · BAT TU TU TRU
          </div>
          <div style={{ fontSize: 22, fontWeight: "bold", color: TEXT, marginBottom: 4 }}>
            La So Bat Tu — {date}
          </div>
          <div style={{ fontSize: 13, color: MUTED }}>Gio sinh: {time}</div>
        </div>

        {/* 4 pillars — flex, equal width */}
        <div style={{ display: "flex", gap: 14, marginBottom: 28 }}>
          {pillars.map((p) => {
            const elementKey = p.data.nguHanh.split("/")[0];
            const elColor = NGU_HANH_COLOR[elementKey] || MUTED;
            return (
              <div
                key={p.title}
                style={{
                  flex: 1,
                  background: BG2,
                  border: `1px solid ${BORDER}`,
                  borderTop: `3px solid ${GOLD}`,
                  borderRadius: 12,
                  padding: "18px 12px",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: 11, color: MUTED, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 14 }}>
                  {p.title}
                </div>
                <div style={{ fontSize: 40, fontWeight: "bold", color: GOLD, marginBottom: 6 }}>{p.data.thienCan}</div>
                <div style={{ fontSize: 40, fontWeight: "bold", color: TEXT, marginBottom: 10 }}>{p.data.diaChi}</div>
                <div
                  style={{
                    fontSize: 11,
                    color: elColor,
                    background: "rgba(255,255,255,0.05)",
                    borderRadius: 999,
                    padding: "3px 10px",
                    display: "inline-block",
                  }}
                >
                  {p.data.nguHanh}
                </div>
              </div>
            );
          })}
        </div>

        {/* Ngũ Hành */}
        <div
          style={{
            background: BG2,
            border: `1px solid ${BORDER}`,
            borderRadius: 12,
            padding: "20px",
            marginBottom: 24,
          }}
        >
          <div style={{ fontSize: 13, color: GOLD, textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 16 }}>
            Phan Tich Ngu Hanh
          </div>
          {nguHanhAnalysis.map((item) => {
            const elColor = NGU_HANH_COLOR[item.element] || TEXT;
            return (
              <div key={item.element} style={{ marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 13, color: elColor, fontWeight: "bold" }}>
                    {item.element}
                  </span>
                  <span style={{ fontSize: 12, color: MUTED }}>{item.percentage}%</span>
                </div>
                <div style={{ height: 6, background: "#1e1530", borderRadius: 3 }}>
                  <div
                    style={{
                      height: 6,
                      width: `${item.percentage}%`,
                      background: elColor,
                      borderRadius: 3,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* AI text */}
        {aiText && (
          <div
            style={{
              background: BG2,
              border: `1px solid ${BORDER}`,
              borderLeft: `3px solid ${GOLD}`,
              borderRadius: "0 12px 12px 0",
              padding: "16px 20px",
              marginBottom: 24,
            }}
          >
            <div style={{ fontSize: 11, color: GOLD, textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 8 }}>
              Luan Giai AI
            </div>
            <div style={{ fontSize: 12, color: MUTED, lineHeight: 1.8, whiteSpace: "pre-wrap" }}>
              {aiText.slice(0, 600)}{aiText.length > 600 ? "…" : ""}
            </div>
          </div>
        )}

        {/* Footer */}
        <div style={{ textAlign: "center", borderTop: `1px solid ${BORDER}`, paddingTop: 18 }}>
          <div style={{ fontSize: 11, color: MUTED }}>
            Huyen Bi · Moi luan giai chi mang tinh tham khao · {new Date().toLocaleDateString("vi-VN")}
          </div>
        </div>
      </div>
    );
  }
);
BatuExportCard.displayName = "BatuExportCard";
