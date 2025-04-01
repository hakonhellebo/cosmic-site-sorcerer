
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Registration from "./pages/Registration";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import UniversityQuestionnairePage from "./pages/UniversityQuestionnairePage";
import WorkerQuestionnairePage from "./pages/WorkerQuestionnairePage";
import HighSchoolQuestionnairePage from "./pages/HighSchoolQuestionnairePage";
import ResultsPage from "./pages/ResultsPage";
import HighSchoolResultsPage from "./pages/HighSchoolResultsPage";
import UniversityResultsPage from "./pages/UniversityResultsPage";
import WorkerResultsPage from "./pages/WorkerResultsPage";
import EmailConfirmed from "./pages/EmailConfirmed";

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
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/verification-pending" element={<Navigate to="/dashboard" replace />} />
          <Route path="/email-confirmed" element={<EmailConfirmed />} />
          <Route path="/university-questionnaire" element={<UniversityQuestionnairePage />} />
          <Route path="/worker-questionnaire" element={<WorkerQuestionnairePage />} />
          <Route path="/high-school-questionnaire" element={<HighSchoolQuestionnairePage />} />
          <Route path="/results" element={<ResultsPage />} />
          <Route path="/results/high-school" element={<HighSchoolResultsPage />} />
          <Route path="/results/university" element={<UniversityResultsPage />} />
          <Route path="/results/worker" element={<WorkerResultsPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
