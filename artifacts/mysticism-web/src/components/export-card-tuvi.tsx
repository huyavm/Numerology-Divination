import { forwardRef } from "react";
import { type TuViResult, DIA_CHI } from "@/lib/tu-vi";

interface Props {
  result: TuViResult;
  birthInfo: string;
  aiText?: string;
}

const GOLD = "#c9a227";
const BG = "#0d0818";
const BG2 = "#140d24";
const TEXT = "#f0e6d0";
const MUTED = "#9b8e78";
const BORDER = "#2e2040";

export const TuViExportCard = forwardRef<HTMLDivElement, Props>(
  ({ result, birthInfo, aiText }, ref) => {
    return (
      <div
        ref={ref}
        style={{
          width: 900,
          background: BG,
          color: TEXT,
          fontFamily: "Georgia, 'Times New Roman', serif",
          padding: "40px",
          boxSizing: "border-box",
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 28, borderBottom: `1px solid ${BORDER}`, paddingBottom: 24 }}>
          <div style={{ color: GOLD, fontSize: 13, letterSpacing: "0.4em", textTransform: "uppercase", marginBottom: 6 }}>
            HUYỀN BÍ · Tử Vi Đẩu Số
          </div>
          <div style={{ fontSize: 22, fontWeight: "bold", color: TEXT, marginBottom: 4 }}>Lá Số Tử Vi</div>
          <div style={{ fontSize: 13, color: MUTED }}>{birthInfo}</div>
        </div>

        {/* Summary row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 24 }}>
          {[
            { label: "Mệnh Cục", value: result.cuccDesc, sub: `Ngũ hành: ${result.nguHanhCuc}` },
            { label: "Can Chi Năm", value: `${result.canNam} ${result.chiNam}`, sub: `Cung Mệnh: ${DIA_CHI[result.cungMenh]}` },
            { label: "Cung Thân", value: DIA_CHI[result.cungThanMenh], sub: "Cung Thân Mệnh" },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                background: BG2,
                border: `1px solid ${BORDER}`,
                borderRadius: 10,
                padding: "14px 16px",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 10, color: MUTED, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 6 }}>
                {item.label}
              </div>
              <div style={{ fontSize: 18, fontWeight: "bold", color: GOLD, marginBottom: 3 }}>{item.value}</div>
              <div style={{ fontSize: 10, color: MUTED }}>{item.sub}</div>
            </div>
          ))}
        </div>

        {/* Mệnh description */}
        <div
          style={{
            background: BG2,
            border: `1px solid ${BORDER}`,
            borderRadius: 10,
            padding: "14px 18px",
            marginBottom: 24,
            fontSize: 12,
            color: MUTED,
            lineHeight: 1.7,
            fontStyle: "italic",
          }}
        >
          {result.menhDesc}
        </div>

        {/* 12 Palaces grid */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 12, color: GOLD, textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 12 }}>
            12 Cung Mệnh
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
            {result.cungList.map((cung) => {
              const isMenh = cung.index === result.cungMenh;
              const isThan = cung.index === result.cungThanMenh;
              const chinhTinh = cung.stars.filter((s) => s.type === "chinh-tinh").map((s) => s.name);
              const phuTinh = cung.stars.filter((s) => s.type === "phu-tinh").map((s) => s.name).slice(0, 2);
              return (
                <div
                  key={cung.index}
                  style={{
                    background: isMenh ? "rgba(201,162,39,0.1)" : BG2,
                    border: `1px solid ${isMenh ? GOLD : isThan ? "#d97706" : BORDER}`,
                    borderRadius: 8,
                    padding: "10px",
                    position: "relative",
                  }}
                >
                  {(isMenh || isThan) && (
                    <div
                      style={{
                        position: "absolute",
                        top: -8,
                        left: 6,
                        background: isMenh ? GOLD : "#d97706",
                        color: "#000",
                        fontSize: 8,
                        fontWeight: "bold",
                        padding: "2px 6px",
                        borderRadius: 99,
                        letterSpacing: "0.1em",
                      }}
                    >
                      {isMenh ? "MỆNH" : "THÂN"}
                    </div>
                  )}
                  <div style={{ fontSize: 9, color: MUTED, marginBottom: 3 }}>
                    {cung.thienCan} {cung.diaChi}
                  </div>
                  <div style={{ fontSize: 11, fontWeight: "bold", color: isMenh ? GOLD : TEXT, marginBottom: 6 }}>
                    {cung.name}
                  </div>
                  {chinhTinh.slice(0, 2).map((s) => (
                    <div
                      key={s}
                      style={{
                        fontSize: 9,
                        color: GOLD,
                        background: "rgba(201,162,39,0.1)",
                        borderRadius: 99,
                        padding: "1px 5px",
                        marginBottom: 2,
                        display: "inline-block",
                        marginRight: 2,
                      }}
                    >
                      {s}
                    </div>
                  ))}
                  {phuTinh.map((s) => (
                    <div
                      key={s}
                      style={{
                        fontSize: 9,
                        color: "#4ade80",
                        background: "rgba(74,222,128,0.08)",
                        borderRadius: 99,
                        padding: "1px 5px",
                        marginBottom: 2,
                        display: "inline-block",
                        marginRight: 2,
                      }}
                    >
                      {s}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
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
              Luận giải AI
            </div>
            <div style={{ fontSize: 12, color: MUTED, lineHeight: 1.8, whiteSpace: "pre-wrap" }}>
              {aiText.slice(0, 700)}{aiText.length > 700 ? "…" : ""}
            </div>
          </div>
        )}

        {/* Footer */}
        <div style={{ textAlign: "center", borderTop: `1px solid ${BORDER}`, paddingTop: 18 }}>
          <div style={{ fontSize: 11, color: MUTED }}>
            Huyền Bí · Mọi luận giải chỉ mang tính tham khảo · {new Date().toLocaleDateString("vi-VN")}
          </div>
        </div>
      </div>
    );
  }
);
TuViExportCard.displayName = "TuViExportCard";
