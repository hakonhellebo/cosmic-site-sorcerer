
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Registration from "./pages/Registration";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import UniversityQuestionnairePage from "./pages/UniversityQuestionnairePage";
import WorkerQuestionnairePage from "./pages/WorkerQuestionnairePage";
import HighSchoolQuestionnairePage from "./pages/HighSchoolQuestionnairePage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/registrer" element={<Registration />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/university-questionnaire" element={<UniversityQuestionnairePage />} />
          <Route path="/worker-questionnaire" element={<WorkerQuestionnairePage />} />
          <Route path="/high-school-questionnaire" element={<HighSchoolQuestionnairePage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
