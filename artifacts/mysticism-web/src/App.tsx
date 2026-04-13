import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import NumerologyPage from "@/pages/than-so-hoc";
import BatuPage from "@/pages/bat-tu";
import IChingPage from "@/pages/xem-que";
import AIChatPage from "@/pages/ai-chat";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/than-so-hoc" component={NumerologyPage} />
      <Route path="/bat-tu" component={BatuPage} />
      <Route path="/xem-que" component={IChingPage} />
      <Route path="/ai-chat" component={AIChatPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL?.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
