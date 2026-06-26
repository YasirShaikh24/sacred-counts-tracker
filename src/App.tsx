import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PrayerProvider } from "@/contexts/PrayerContext";
import { QuranProvider } from "@/contexts/QuranContext";
import NotificationContainer from "@/components/NotificationContainer";
import Dashboard from "./pages/Dashboard";
import CardDetail from "./pages/CardDetail";
import AddCard from "./pages/AddCard";
import EditCard from "./pages/EditCard";
import QuranShareef from "./pages/QuranShareef";
import DigitalTasbeeh from "./pages/DigitalTasbeeh";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <PrayerProvider>
        <QuranProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/card/:cardId" element={<CardDetail />} />
              <Route path="/add" element={<AddCard />} />
              <Route path="/edit/:cardId" element={<EditCard />} />
              <Route path="/quran-shareef" element={<QuranShareef />} />
              <Route path="/digital-tasbeeh" element={<DigitalTasbeeh />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <NotificationContainer />
          </BrowserRouter>
        </QuranProvider>
      </PrayerProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;