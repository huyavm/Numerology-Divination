import { useState } from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useAISettings } from "@/contexts/ai-settings";
import { AISettingsModal } from "@/components/ai-settings-modal";

const navItems = [
  { href: "/", label: "Trang chủ" },
  { href: "/than-so-hoc", label: "Thần số học" },
  { href: "/bat-tu", label: "Bát tự" },
  { href: "/xem-que", label: "Xem quẻ" },
  { href: "/cat-hung", label: "Cát Hung" },
  { href: "/ai-chat", label: "Trợ lý AI" },
];

const PROVIDER_BADGE: Record<string, { label: string; color: string }> = {
  default: { label: "AI", color: "bg-primary/20 text-primary border-primary/40" },
  openai: { label: "GPT", color: "bg-green-500/20 text-green-400 border-green-500/40" },
  gemini: { label: "Gem", color: "bg-blue-500/20 text-blue-400 border-blue-500/40" },
};

export function Navbar() {
  const [location] = useLocation();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { settings, isConfigured } = useAISettings();

  const badge = PROVIDER_BADGE[settings.provider];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold tracking-widest text-primary">
            HUYỀN BÍ
          </Link>
          <div className="flex items-center gap-5">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm tracking-wide transition-colors hover:text-primary",
                  location === item.href ? "text-primary" : "text-muted-foreground"
                )}
              >
                {item.label}
              </Link>
            ))}

            <button
              onClick={() => setSettingsOpen(true)}
              title="Cài đặt AI"
              className={cn(
                "flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border transition-all hover:opacity-80",
                badge.color,
                !isConfigured && "opacity-60 ring-1 ring-red-500/50"
              )}
            >
              <span>{badge.label}</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3"/>
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/>
              </svg>
            </button>
          </div>
        </div>
      </nav>

      <AISettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </>
  );
}
