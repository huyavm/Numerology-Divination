import { useState } from "react";
import { useAISettings, type AIProvider, DEFAULT_OPENAI_MODEL, DEFAULT_GEMINI_MODEL } from "@/contexts/ai-settings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Props {
  open: boolean;
  onClose: () => void;
}

const OPENAI_MODELS: { value: string; label: string; badge: string; badgeColor: string; desc: string }[] = [
  {
    value: "gpt-5.4",
    label: "GPT-5.4",
    badge: "Flagship mới nhất",
    badgeColor: "bg-yellow-500/20 text-yellow-300",
    desc: "Model hàng đầu hiện tại của OpenAI. Suy luận mạnh mẽ, lập trình xuất sắc, hỗ trợ computer use. Context 1M token.",
  },
  {
    value: "gpt-5.4-thinking",
    label: "GPT-5.4 Thinking",
    badge: "Suy luận sâu",
    badgeColor: "bg-purple-500/20 text-purple-300",
    desc: "Phiên bản suy luận chuyên sâu của GPT-5.4. Phân tích kỹ lưỡng, nghiên cứu phức tạp.",
  },
  {
    value: "gpt-5.4-mini",
    label: "GPT-5.4 Mini",
    badge: "Nhanh & Tiết kiệm",
    badgeColor: "bg-green-500/20 text-green-300",
    desc: "Sức mạnh GPT-5.4 trong gói nhỏ gọn hơn. Lý tưởng cho khối lượng lớn, nhanh và kinh tế.",
  },
  {
    value: "gpt-5.4-nano",
    label: "GPT-5.4 Nano",
    badge: "Siêu nhanh",
    badgeColor: "bg-blue-500/20 text-blue-300",
    desc: "Tối ưu cho tốc độ và chi phí. Phù hợp các tác vụ đơn giản, khối lượng rất lớn.",
  },
  {
    value: "gpt-5.3",
    label: "GPT-5.3",
    badge: "Ổn định",
    badgeColor: "bg-slate-500/20 text-slate-300",
    desc: "Phiên bản 5.3 hội thoại nhanh. Phản hồi mượt mà, ổn định cho hầu hết tác vụ.",
  },
  {
    value: "gpt-4.1",
    label: "GPT-4.1",
    badge: "Thế hệ trước",
    badgeColor: "bg-slate-500/15 text-slate-400",
    desc: "Thế hệ GPT-4 mới nhất. Vẫn mạnh mẽ trong lập trình, tuân thủ lệnh và xử lý văn bản dài.",
  },
  {
    value: "gpt-4.1-mini",
    label: "GPT-4.1 Mini",
    badge: "Tiết kiệm",
    badgeColor: "bg-slate-500/15 text-slate-400",
    desc: "Model nhỏ gọn của dòng GPT-4.1. Nhanh, hiệu quả, chi phí thấp.",
  },
];

const GEMINI_MODELS: { value: string; label: string; badge: string; badgeColor: string; desc: string }[] = [
  {
    value: "gemini-3.1-pro-preview",
    label: "Gemini 3.1 Pro",
    badge: "Mới nhất (Preview)",
    badgeColor: "bg-yellow-500/20 text-yellow-300",
    desc: "Model thông minh nhất của Google. Suy luận nâng cao, agentic workflows, lập trình, context 1M token.",
  },
  {
    value: "gemini-3-flash-preview",
    label: "Gemini 3.1 Flash",
    badge: "Nhanh & Mạnh (Preview)",
    badgeColor: "bg-purple-500/20 text-purple-300",
    desc: "Sức mạnh Pro trong tốc độ Flash. Cân bằng hoàn hảo giữa trí tuệ và độ trễ thấp.",
  },
  {
    value: "gemini-3.1-flash-lite-preview",
    label: "Gemini 3.1 Flash-Lite",
    badge: "Tiết kiệm nhất (Preview)",
    badgeColor: "bg-blue-500/20 text-blue-300",
    desc: "Tối ưu chi phí, độ trễ thấp nhất. Lý tưởng cho khối lượng lớn.",
  },
  {
    value: "gemini-2.5-pro",
    label: "Gemini 2.5 Pro",
    badge: "Ổn định - Khuyến nghị",
    badgeColor: "bg-green-500/20 text-green-300",
    desc: "Phiên bản stable mạnh nhất, sẵn sàng production. Suy luận thích ứng, context 1M token.",
  },
  {
    value: "gemini-2.5-flash",
    label: "Gemini 2.5 Flash",
    badge: "Ổn định - Phổ biến",
    badgeColor: "bg-green-500/15 text-green-400",
    desc: "Phiên bản stable nhanh nhất, cân bằng trí tuệ và tốc độ. Kinh tế, đáng tin cậy.",
  },
  {
    value: "gemini-2.5-flash-lite",
    label: "Gemini 2.5 Flash-Lite",
    badge: "Ổn định - Tiết kiệm",
    badgeColor: "bg-slate-500/20 text-slate-300",
    desc: "Stable, tối ưu cho quy mô lớn. Chi phí thấp nhất trong dòng 2.5.",
  },
];

const PROVIDER_INFO = {
  default: {
    label: "Mặc định (Replit AI)",
    desc: "Sử dụng AI tích hợp sẵn của hệ thống. Không cần khóa API.",
    color: "border-primary/60 bg-primary/10",
  },
  openai: {
    label: "OpenAI ChatGPT",
    desc: "Sử dụng khóa API OpenAI riêng.",
    color: "border-green-500/60 bg-green-500/10",
  },
  gemini: {
    label: "Google Gemini",
    desc: "Sử dụng khóa API Google AI riêng.",
    color: "border-blue-500/60 bg-blue-500/10",
  },
};

function ModelSelector({
  models,
  value,
  onChange,
  selectedBorderColor,
}: {
  models: typeof OPENAI_MODELS;
  value: string;
  onChange: (v: string) => void;
  selectedBorderColor: string;
}) {
  return (
    <div className="grid gap-2">
      {models.map((m) => {
        const isSelected = value === m.value;
        return (
          <button
            key={m.value}
            type="button"
            onClick={() => onChange(m.value)}
            className={`w-full text-left rounded-lg border px-3 py-2.5 transition-all flex items-start gap-3 ${
              isSelected
                ? `${selectedBorderColor} bg-white/5`
                : "border-border/30 bg-background/20 hover:border-border/60"
            }`}
          >
            <div className={`w-3.5 h-3.5 rounded-full border-2 flex-shrink-0 mt-0.5 transition-all ${
              isSelected ? "border-primary bg-primary" : "border-muted-foreground"
            }`} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-semibold text-foreground">{m.label}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${m.badgeColor}`}>{m.badge}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{m.desc}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
}

export function AISettingsModal({ open, onClose }: Props) {
  const { settings, updateSettings } = useAISettings();
  const [local, setLocal] = useState({ ...settings });
  const [showOpenAIKey, setShowOpenAIKey] = useState(false);
  const [showGeminiKey, setShowGeminiKey] = useState(false);

  if (!open) return null;

  const handleSave = () => {
    updateSettings(local);
    onClose();
  };

  const handleReset = () => {
    const reset = {
      provider: "default" as AIProvider,
      openaiKey: "",
      geminiKey: "",
      openaiModel: DEFAULT_OPENAI_MODEL,
      geminiModel: DEFAULT_GEMINI_MODEL,
    };
    setLocal(reset);
    updateSettings(reset);
    onClose();
  };

  const setProvider = (p: AIProvider) => setLocal((v) => ({ ...v, provider: p }));

  const currentOpenAIModel = local.openaiModel || DEFAULT_OPENAI_MODEL;
  const currentGeminiModel = local.geminiModel || DEFAULT_GEMINI_MODEL;
  const selectedOpenAILabel = OPENAI_MODELS.find((m) => m.value === currentOpenAIModel)?.label ?? currentOpenAIModel;
  const selectedGeminiLabel = GEMINI_MODELS.find((m) => m.value === currentGeminiModel)?.label ?? currentGeminiModel;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-background border border-primary/30 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        <div className="p-6 pb-4 border-b border-primary/10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-primary">Cài đặt AI</h2>
              <p className="text-sm text-muted-foreground mt-0.5">Chọn nhà cung cấp, model và nhập khóa API.</p>
            </div>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground text-xl leading-none p-1">✕</button>
          </div>
        </div>

        <div className="overflow-y-auto flex-1 p-6 space-y-6">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Nhà cung cấp</p>
            <div className="grid gap-2">
              {(["default", "openai", "gemini"] as AIProvider[]).map((p) => {
                const info = PROVIDER_INFO[p];
                const isActive = local.provider === p;
                const sublabel =
                  p === "openai" ? `Model: ${selectedOpenAILabel}` :
                  p === "gemini" ? `Model: ${selectedGeminiLabel}` :
                  "gpt-5.2";
                return (
                  <button
                    key={p}
                    onClick={() => setProvider(p)}
                    className={`w-full text-left rounded-xl border-2 px-4 py-3 transition-all ${
                      isActive ? info.color : "border-border/40 bg-card/20 hover:border-primary/30"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 transition-all ${
                        isActive ? "border-primary bg-primary" : "border-muted-foreground"
                      }`} />
                      <div>
                        <div className="font-semibold text-sm text-foreground">{info.label}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">{isActive ? sublabel : info.desc}</div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {local.provider === "openai" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="openai-key" className="text-sm text-foreground/80">Khóa API OpenAI</Label>
                <div className="relative">
                  <Input
                    id="openai-key"
                    type={showOpenAIKey ? "text" : "password"}
                    value={local.openaiKey}
                    onChange={(e) => setLocal((v) => ({ ...v, openaiKey: e.target.value }))}
                    placeholder="sk-..."
                    className="bg-background/50 border-border/50 focus:border-primary/50 pr-20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowOpenAIKey((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground"
                  >
                    {showOpenAIKey ? "Ẩn" : "Hiện"}
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Lấy khóa tại{" "}
                  <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2">
                    platform.openai.com/api-keys
                  </a>
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-xs uppercase tracking-widest text-muted-foreground">Chọn model OpenAI</p>
                <ModelSelector
                  models={OPENAI_MODELS}
                  value={currentOpenAIModel}
                  onChange={(v) => setLocal((s) => ({ ...s, openaiModel: v }))}
                  selectedBorderColor="border-green-500/50"
                />
              </div>
            </>
          )}

          {local.provider === "gemini" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="gemini-key" className="text-sm text-foreground/80">Khóa API Google AI (Gemini)</Label>
                <div className="relative">
                  <Input
                    id="gemini-key"
                    type={showGeminiKey ? "text" : "password"}
                    value={local.geminiKey}
                    onChange={(e) => setLocal((v) => ({ ...v, geminiKey: e.target.value }))}
                    placeholder="AIza..."
                    className="bg-background/50 border-border/50 focus:border-primary/50 pr-20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowGeminiKey((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground"
                  >
                    {showGeminiKey ? "Ẩn" : "Hiện"}
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Lấy khóa tại{" "}
                  <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2">
                    aistudio.google.com/app/apikey
                  </a>
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-xs uppercase tracking-widest text-muted-foreground">Chọn model Gemini</p>
                <ModelSelector
                  models={GEMINI_MODELS}
                  value={currentGeminiModel}
                  onChange={(v) => setLocal((s) => ({ ...s, geminiModel: v }))}
                  selectedBorderColor="border-blue-500/50"
                />
              </div>
            </>
          )}

          <div className="bg-primary/5 border border-primary/15 rounded-lg px-4 py-3 text-xs text-muted-foreground leading-relaxed">
            Khóa API được lưu cục bộ trong trình duyệt và chỉ gửi đến máy chủ khi thực hiện luận giải AI. Chúng tôi không lưu trữ khóa của bạn.
          </div>
        </div>

        <div className="p-6 pt-4 border-t border-primary/10 flex gap-3">
          <Button onClick={handleSave} className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold">
            Lưu cài đặt
          </Button>
          <Button onClick={handleReset} variant="outline" className="border-border/50 text-muted-foreground hover:text-foreground">
            Đặt lại
          </Button>
        </div>
      </div>
    </div>
  );
}
