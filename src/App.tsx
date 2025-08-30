import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PrayerProvider, usePrayer } from "@/contexts/PrayerContext";
import { NotificationToast } from "@/components/NotificationToast";
import Dashboard from "./pages/Dashboard";
import CardDetail from "./pages/CardDetail";
import AddCard from "./pages/AddCard";
import EditCard from "./pages/EditCard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AppContent() {
  const { notifications, removeNotification } = usePrayer();
  
  return (
    <>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/card/:cardId" element={<CardDetail />} />
        <Route path="/add" element={<AddCard />} />
        <Route path="/edit/:cardId" element={<EditCard />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <NotificationToast 
        notifications={notifications} 
        onRemove={removeNotification}
      />
    </>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <PrayerProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </PrayerProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
