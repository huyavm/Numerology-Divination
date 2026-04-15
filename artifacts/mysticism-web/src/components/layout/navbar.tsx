import { useState } from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useAISettings } from "@/contexts/ai-settings";
import { useTheme } from "@/contexts/theme";
import { AISettingsModal } from "@/components/ai-settings-modal";

const navItems = [
  { href: "/", label: "Trang chủ" },
  { href: "/than-so-hoc", label: "Thần số học" },
  { href: "/bat-tu", label: "Bát tự" },
  { href: "/xem-que", label: "Xem quẻ" },
  { href: "/cat-hung", label: "Cát Hung" },
  { href: "/lich-van-nien", label: "Lịch" },
  { href: "/tu-vi", label: "Tử Vi" },
  { href: "/phong-thuy", label: "Phong Thuỷ" },
  { href: "/xem-ten", label: "Xem Tên" },
  { href: "/lich-ca-nhan", label: "Lịch Cá Nhân" },
  { href: "/tu-dien", label: "Từ Điển" },
  { href: "/hop-tuoi", label: "Hợp Tuổi" },
  { href: "/xem-ngay-tot", label: "Ngày Tốt" },
  { href: "/sao-han", label: "Sao Hạn" },
  { href: "/lich-su", label: "Lịch Sử" },
  { href: "/ai-chat", label: "Trợ lý AI" },
];

const PROVIDER_BADGE: Record<string, { label: string; color: string }> = {
  server: { label: "AI", color: "bg-primary/20 text-primary border-primary/40" },
  openai: { label: "GPT", color: "bg-green-500/20 text-green-400 border-green-500/40" },
  gemini: { label: "Gem", color: "bg-blue-500/20 text-blue-400 border-blue-500/40" },
};

function SunIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4"/><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/>
      <line x1="4.22" y1="4.22" x2="7.05" y2="7.05"/><line x1="16.95" y1="16.95" x2="19.78" y2="19.78"/>
      <line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/>
      <line x1="4.22" y1="19.78" x2="7.05" y2="16.95"/><line x1="16.95" y1="7.05" x2="19.78" y2="4.22"/>
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  );
}

export function Navbar() {
  const [location] = useLocation();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { settings, isConfigured } = useAISettings();
  const { theme, toggleTheme } = useTheme();

  const badge = PROVIDER_BADGE[settings.provider] ?? PROVIDER_BADGE["server"];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/85 backdrop-blur-md no-print">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold tracking-widest text-primary shrink-0">
            HUYỀN BÍ
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-4 flex-1 justify-center px-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-xs tracking-wide transition-colors hover:text-primary whitespace-nowrap",
                  location === item.href ? "text-primary font-semibold" : "text-muted-foreground"
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              title={theme === "dark" ? "Chuyển sang chế độ sáng" : "Chuyển sang chế độ tối"}
              className="w-8 h-8 rounded-full border border-border/50 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 transition-all"
            >
              {theme === "dark" ? <SunIcon /> : <MoonIcon />}
            </button>

            {/* AI settings */}
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

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="lg:hidden w-8 h-8 rounded-lg border border-border/50 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 transition-all"
            >
              {mobileOpen ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-border/40 bg-background/95 backdrop-blur-md px-4 py-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "block px-3 py-2.5 rounded-lg text-sm transition-colors",
                  location === item.href
                    ? "bg-primary/15 text-primary font-semibold"
                    : "text-muted-foreground hover:bg-primary/8 hover:text-foreground"
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </nav>

      <AISettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </>
  );
}
