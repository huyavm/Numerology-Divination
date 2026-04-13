import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export type AIProvider = "default" | "openai" | "gemini";

export interface AISettings {
  provider: AIProvider;
  openaiKey: string;
  geminiKey: string;
  openaiModel: string;
  geminiModel: string;
}

interface AISettingsContextValue {
  settings: AISettings;
  updateSettings: (next: Partial<AISettings>) => void;
  activeKey: string;
  activeModel: string;
  isConfigured: boolean;
}

const STORAGE_KEY = "huyen-bi-ai-settings";

export const DEFAULT_OPENAI_MODEL = "gpt-4o";
export const DEFAULT_GEMINI_MODEL = "gemini-2.0-flash";

const defaultSettings: AISettings = {
  provider: "default",
  openaiKey: "",
  geminiKey: "",
  openaiModel: DEFAULT_OPENAI_MODEL,
  geminiModel: DEFAULT_GEMINI_MODEL,
};

function loadSettings(): AISettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultSettings;
    return { ...defaultSettings, ...JSON.parse(raw) };
  } catch {
    return defaultSettings;
  }
}

const AISettingsContext = createContext<AISettingsContextValue>({
  settings: defaultSettings,
  updateSettings: () => {},
  activeKey: "",
  activeModel: "",
  isConfigured: false,
});

export function AISettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AISettings>(loadSettings);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  const updateSettings = (next: Partial<AISettings>) => {
    setSettings((prev) => ({ ...prev, ...next }));
  };

  const activeKey =
    settings.provider === "openai"
      ? settings.openaiKey
      : settings.provider === "gemini"
        ? settings.geminiKey
        : "";

  const activeModel =
    settings.provider === "openai"
      ? settings.openaiModel || DEFAULT_OPENAI_MODEL
      : settings.provider === "gemini"
        ? settings.geminiModel || DEFAULT_GEMINI_MODEL
        : "";

  const isConfigured =
    settings.provider === "default" ||
    (settings.provider === "openai" && !!settings.openaiKey.trim()) ||
    (settings.provider === "gemini" && !!settings.geminiKey.trim());

  return (
    <AISettingsContext.Provider value={{ settings, updateSettings, activeKey, activeModel, isConfigured }}>
      {children}
    </AISettingsContext.Provider>
  );
}

export function useAISettings() {
  return useContext(AISettingsContext);
}
