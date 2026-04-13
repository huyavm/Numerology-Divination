import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Trang chủ" },
  { href: "/than-so-hoc", label: "Thần số học" },
  { href: "/bat-tu", label: "Bát tự" },
  { href: "/xem-que", label: "Xem quẻ" },
  { href: "/ai-chat", label: "Trợ lý AI" },
];

export function Navbar() {
  const [location] = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold tracking-widest text-primary">
          HUYỀN BÍ
        </Link>
        <div className="flex items-center gap-6">
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
        </div>
      </div>
    </nav>
  );
}
