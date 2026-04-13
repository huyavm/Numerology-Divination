import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export type AIProvider = "default" | "openai" | "gemini";

export interface AISettings {
  provider: AIProvider;
  openaiKey: string;
  geminiKey: string;
}

interface AISettingsContextValue {
  settings: AISettings;
  updateSettings: (next: Partial<AISettings>) => void;
  activeKey: string;
  isConfigured: boolean;
}

const STORAGE_KEY = "huyen-bi-ai-settings";

const defaultSettings: AISettings = {
  provider: "default",
  openaiKey: "",
  geminiKey: "",
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

  const isConfigured =
    settings.provider === "default" ||
    (settings.provider === "openai" && !!settings.openaiKey.trim()) ||
    (settings.provider === "gemini" && !!settings.geminiKey.trim());

  return (
    <AISettingsContext.Provider value={{ settings, updateSettings, activeKey, isConfigured }}>
      {children}
    </AISettingsContext.Provider>
  );
}

export function useAISettings() {
  return useContext(AISettingsContext);
}
