import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AIMentor } from "@/components/AIMentor";
import Index from "./pages/Index";
import Module from "./pages/Module";
import Auth from "./pages/Auth";
import Contests from "./pages/Contests";
import Admin from "./pages/Admin";
import CodePlayground from "./pages/CodePlayground";
import CarouselShowcase from "./pages/CarouselShowcase";
import Leaderboard from "./pages/Leaderboard"; // Added import for Leaderboard
import Store from "./pages/Store"; // Added import for Store
import Premium from "./pages/Premium"; // Added import for Premium
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/contests" element={<Contests />} />
            <Route path="/module/:id" element={<Module />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/playground" element={<CodePlayground />} />
            <Route path="/showcase" element={<CarouselShowcase />} />
            <Route path="/leaderboard" element={<Leaderboard />} /> {/* Added Route for Leaderboard */}
            <Route path="/store" element={<Store />} /> {/* Added Route for Store */}
            <Route path="/premium" element={<Premium />} /> {/* Added Route for Premium */}
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <AIMentor />
        </BrowserRouter>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
