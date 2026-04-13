import { useState } from "react";
import { useAISettings, type AIProvider, DEFAULT_OPENAI_MODEL, DEFAULT_GEMINI_MODEL } from "@/contexts/ai-settings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Props {
  open: boolean;
  onClose: () => void;
}

const OPENAI_MODELS: { value: string; label: string; badge: string; desc: string }[] = [
  { value: "gpt-4.1",        label: "GPT-4.1",        badge: "Mới nhất",       desc: "Model flagship mới nhất của OpenAI, mạnh mẽ và chính xác nhất" },
  { value: "gpt-4.1-mini",   label: "GPT-4.1 Mini",   badge: "Nhanh & Tiết kiệm", desc: "Phiên bản nhỏ hơn của GPT-4.1, cân bằng tốc độ và chất lượng" },
  { value: "gpt-4o",         label: "GPT-4o",          badge: "Phổ biến",       desc: "Đa năng, hỗ trợ văn bản, hình ảnh và âm thanh" },
  { value: "gpt-4o-mini",    label: "GPT-4o Mini",     badge: "Tiết kiệm",      desc: "Nhanh hơn và rẻ hơn GPT-4o, phù hợp cho luận giải đơn giản" },
  { value: "o3-mini",        label: "o3-mini",          badge: "Suy luận",       desc: "Model suy luận nhanh của OpenAI, giỏi phân tích logic và số học" },
  { value: "o4-mini",        label: "o4-mini",          badge: "Suy luận mới",   desc: "Phiên bản suy luận mới nhất, cực nhanh và chính xác" },
];

const GEMINI_MODELS: { value: string; label: string; badge: string; desc: string }[] = [
  { value: "gemini-2.5-pro-preview-05-06", label: "Gemini 2.5 Pro",    badge: "Mạnh nhất",   desc: "Model mạnh nhất của Google, hỗ trợ suy luận nâng cao" },
  { value: "gemini-2.5-flash-preview-04-17", label: "Gemini 2.5 Flash", badge: "Nhanh & Mới", desc: "Phiên bản 2.5 nhanh, cân bằng tốc độ và hiệu suất" },
  { value: "gemini-2.0-flash",             label: "Gemini 2.0 Flash",   badge: "Ổn định",     desc: "Phiên bản 2.0 flash ổn định, đáng tin cậy và nhanh chóng" },
  { value: "gemini-1.5-pro",               label: "Gemini 1.5 Pro",     badge: "Tin cậy",     desc: "Model 1.5 Pro ổn định với cửa sổ ngữ cảnh 1 triệu token" },
  { value: "gemini-1.5-flash",             label: "Gemini 1.5 Flash",   badge: "Phổ biến",    desc: "Nhanh và tiết kiệm, phù hợp cho hầu hết tác vụ thông thường" },
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
  accentColor,
}: {
  models: typeof OPENAI_MODELS;
  value: string;
  onChange: (v: string) => void;
  accentColor: string;
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
                ? `${accentColor} border-opacity-60`
                : "border-border/30 bg-background/20 hover:border-border/60"
            }`}
          >
            <div className={`w-3.5 h-3.5 rounded-full border-2 flex-shrink-0 mt-0.5 transition-all ${
              isSelected ? "border-current bg-current" : "border-muted-foreground"
            }`} style={{ color: isSelected ? undefined : undefined }} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-semibold text-foreground">{m.label}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                  isSelected ? "bg-current/20 text-current" : "bg-primary/10 text-primary/70"
                }`}>{m.badge}</span>
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
                  accentColor="border-green-500/50 bg-green-500/10 text-green-400"
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
                  accentColor="border-blue-500/50 bg-blue-500/10 text-blue-400"
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
