import { useState } from "react";
import { useAISettings, type AIProvider } from "@/contexts/ai-settings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Props {
  open: boolean;
  onClose: () => void;
}

const PROVIDER_INFO = {
  default: {
    label: "Mặc định (Replit AI)",
    desc: "Sử dụng AI tích hợp sẵn của hệ thống. Không cần khóa API.",
    color: "border-primary/60 bg-primary/10",
  },
  openai: {
    label: "OpenAI ChatGPT",
    desc: "Sử dụng khóa API OpenAI riêng. Model gpt-4o.",
    color: "border-green-500/60 bg-green-500/10",
  },
  gemini: {
    label: "Google Gemini",
    desc: "Sử dụng khóa API Google AI riêng. Model gemini-1.5-pro.",
    color: "border-blue-500/60 bg-blue-500/10",
  },
};

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
    const reset = { provider: "default" as AIProvider, openaiKey: "", geminiKey: "" };
    setLocal(reset);
    updateSettings(reset);
    onClose();
  };

  const setProvider = (p: AIProvider) => setLocal((v) => ({ ...v, provider: p }));

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-background border border-primary/30 rounded-2xl shadow-2xl p-6 space-y-6 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-primary">Cài đặt nhà cung cấp AI</h2>
            <p className="text-sm text-muted-foreground mt-0.5">Chọn nguồn AI và nhập khóa API của bạn.</p>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground text-xl leading-none">✕</button>
        </div>

        <div className="space-y-3">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Nhà cung cấp</p>
          {(["default", "openai", "gemini"] as AIProvider[]).map((p) => {
            const info = PROVIDER_INFO[p];
            const isActive = local.provider === p;
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
                    <div className="text-xs text-muted-foreground mt-0.5">{info.desc}</div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {local.provider === "openai" && (
          <div className="space-y-2">
            <Label htmlFor="openai-key" className="text-sm text-foreground/80">
              Khóa API OpenAI
            </Label>
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
        )}

        {local.provider === "gemini" && (
          <div className="space-y-2">
            <Label htmlFor="gemini-key" className="text-sm text-foreground/80">
              Khóa API Google AI (Gemini)
            </Label>
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
        )}

        <div className="bg-primary/5 border border-primary/15 rounded-lg px-4 py-3 text-xs text-muted-foreground leading-relaxed">
          Khóa API được lưu cục bộ trong trình duyệt của bạn và chỉ được gửi đến máy chủ khi thực hiện luận giải AI. Chúng tôi không lưu trữ khóa của bạn.
        </div>

        <div className="flex gap-3">
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
