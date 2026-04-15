import { useEffect, useRef } from "react";
import { Switch, Route, Router as WouterRouter, useLocation, Redirect } from "wouter";
import { ClerkProvider, Show, useClerk, useUser } from "@clerk/react";
import { QueryClient, QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AISettingsProvider } from "@/contexts/ai-settings";
import { ThemeProvider } from "@/contexts/theme";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import NumerologyPage from "@/pages/than-so-hoc";
import BatuPage from "@/pages/bat-tu";
import IChingPage from "@/pages/xem-que";
import AIChatPage from "@/pages/ai-chat";
import CatHungPage from "@/pages/cat-hung";
import LichVanNienPage from "@/pages/lich-van-nien";
import TuViPage from "@/pages/tu-vi";
import PhongThuyPage from "@/pages/phong-thuy";
import XemTenPage from "@/pages/xem-ten";
import LichCaNhanPage from "@/pages/lich-ca-nhan";
import TuDienPage from "@/pages/tu-dien";
import HopTuoiPage from "@/pages/hop-tuoi";
import XemNgayTotPage from "@/pages/xem-ngay-tot";
import SaoHanPage from "@/pages/sao-han";
import LichSuPage from "@/pages/lich-su";
import ProfilePage from "@/pages/profile";
import SignInPage from "@/pages/sign-in";
import SignUpPage from "@/pages/sign-up";
import { PwaInstallPrompt } from "@/components/pwa-install-prompt";
import { MysticCursor } from "@/components/mystic-cursor";

const queryClient = new QueryClient();

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const clerkProxyUrl: string | undefined = import.meta.env.PROD
  ? (import.meta.env.VITE_CLERK_PROXY_URL ?? `${window.location.origin}/api/__clerk`)
  : undefined;
const basePath = import.meta.env.BASE_URL?.replace(/\/$/, "") || "";

function stripBase(path: string): string {
  return basePath && path.startsWith(basePath) ? path.slice(basePath.length) || "/" : path;
}

function ClerkQueryClientCacheInvalidator() {
  const { addListener } = useClerk();
  const qc = useQueryClient();
  const prevUserIdRef = useRef<string | null | undefined>(undefined);

  useEffect(() => {
    const unsubscribe = addListener(({ user }) => {
      const userId = user?.id ?? null;
      if (prevUserIdRef.current !== undefined && prevUserIdRef.current !== userId) {
        qc.clear();
      }
      prevUserIdRef.current = userId;
    });
    return unsubscribe;
  }, [addListener, qc]);

  return null;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/sign-in/*?" component={SignInPage} />
      <Route path="/sign-up/*?" component={SignUpPage} />
      <Route path="/profile" component={ProfilePage} />
      <Route path="/than-so-hoc" component={NumerologyPage} />
      <Route path="/bat-tu" component={BatuPage} />
      <Route path="/xem-que" component={IChingPage} />
      <Route path="/cat-hung" component={CatHungPage} />
      <Route path="/lich-van-nien" component={LichVanNienPage} />
      <Route path="/tu-vi" component={TuViPage} />
      <Route path="/ai-chat" component={AIChatPage} />
      <Route path="/phong-thuy" component={PhongThuyPage} />
      <Route path="/xem-ten" component={XemTenPage} />
      <Route path="/lich-ca-nhan" component={LichCaNhanPage} />
      <Route path="/tu-dien" component={TuDienPage} />
      <Route path="/hop-tuoi" component={HopTuoiPage} />
      <Route path="/xem-ngay-tot" component={XemNgayTotPage} />
      <Route path="/sao-han" component={SaoHanPage} />
      <Route path="/lich-su" component={LichSuPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function ClerkProviderWithRoutes() {
  const [, setLocation] = useLocation();

  return (
    <ClerkProvider
      publishableKey={clerkPubKey ?? ""}
      proxyUrl={clerkProxyUrl}
      routerPush={(to) => setLocation(stripBase(to))}
      routerReplace={(to) => setLocation(stripBase(to), { replace: true })}
    >
      <QueryClientProvider client={queryClient}>
        <ClerkQueryClientCacheInvalidator />
        <TooltipProvider>
          <AISettingsProvider>
            <Router />
            <Toaster />
            <PwaInstallPrompt />
            <MysticCursor />
          </AISettingsProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
}

function App() {
  return (
    <ThemeProvider>
      <WouterRouter base={basePath}>
        <ClerkProviderWithRoutes />
      </WouterRouter>
    </ThemeProvider>
  );
}

export default App;
