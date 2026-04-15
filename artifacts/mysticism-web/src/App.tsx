import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
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
import { PwaInstallPrompt } from "@/components/pwa-install-prompt";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
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

function App() {
  return (
    <ThemeProvider>
      <AISettingsProvider>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <WouterRouter base={import.meta.env.BASE_URL?.replace(/\/$/, "")}>
              <Router />
            </WouterRouter>
            <Toaster />
            <PwaInstallPrompt />
          </TooltipProvider>
        </QueryClientProvider>
      </AISettingsProvider>
    </ThemeProvider>
  );
}

export default App;
