
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AppLayout from "./components/layout/AppLayout";
import Cooperatives from "./pages/Cooperatives";
import RoutesPage from "./pages/Routes";
import Vehicles from "./pages/Vehicles";
import Trips from "./pages/Trips";
import TripCards from "./pages/TripCards";
import Settings from "./pages/Settings";

import Reservations from "./pages/Reservations";
import Dashboard from "./components/dashboard/Dashboard";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={
            <AppLayout>
              <Dashboard />
            </AppLayout>
          } />
          <Route path="/cooperatives" element={
            <AppLayout>
              <Cooperatives />
            </AppLayout>
          } />
          <Route path="/routes" element={
            <AppLayout>
              <RoutesPage />
            </AppLayout>
          } />
          <Route path="/trajets" element={
            <AppLayout>
              <Trips />
            </AppLayout>
          } />
          <Route path="/trajets-cards" element={
            <AppLayout>
              <TripCards />
            </AppLayout>
          } />
          <Route path="/vehicules" element={
            <AppLayout>
              <Vehicles />
            </AppLayout>
          } />
          <Route path="/reservations" element={
            <AppLayout>
              <Reservations />
            </AppLayout>
          } />
          <Route path="/settings" element={
            <AppLayout>
              <Settings />
            </AppLayout>
          } />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
