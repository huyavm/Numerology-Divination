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
          </TooltipProvider>
        </QueryClientProvider>
      </AISettingsProvider>
    </ThemeProvider>
  );
}

export default App;
