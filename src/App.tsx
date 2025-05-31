
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Registration from "./pages/Registration";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import UserTypeSelection from "./pages/UserTypeSelection";
import UniversityQuestionnairePage from "./pages/UniversityQuestionnairePage";
import WorkerQuestionnairePage from "./pages/WorkerQuestionnairePage";
import HighSchoolQuestionnairePage from "./pages/HighSchoolQuestionnairePage";
import ResultsPage from "./pages/ResultsPage";
import HighSchoolResultsPage from "./pages/HighSchoolResultsPage";
import UniversityResultsPage from "./pages/UniversityResultsPage";
import WorkerResultsPage from "./pages/WorkerResultsPage";
import Statistics from "./pages/Statistics";
import EducationDetailsPage from "./pages/EducationDetailsPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1, // Security: Limit retries to prevent excessive requests
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/registrer" element={
              <ProtectedRoute requireAuth={false}>
                <Registration />
              </ProtectedRoute>
            } />
            <Route path="/login" element={
              <ProtectedRoute requireAuth={false}>
                <Login />
              </ProtectedRoute>
            } />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/user-type-selection" element={
              <ProtectedRoute>
                <UserTypeSelection />
              </ProtectedRoute>
            } />
            <Route path="/university-questionnaire" element={
              <ProtectedRoute>
                <UniversityQuestionnairePage />
              </ProtectedRoute>
            } />
            <Route path="/worker-questionnaire" element={
              <ProtectedRoute>
                <WorkerQuestionnairePage />
              </ProtectedRoute>
            } />
            <Route path="/high-school-questionnaire" element={
              <ProtectedRoute>
                <HighSchoolQuestionnairePage />
              </ProtectedRoute>
            } />
            <Route path="/results" element={
              <ProtectedRoute>
                <ResultsPage />
              </ProtectedRoute>
            } />
            <Route path="/results/high-school" element={
              <ProtectedRoute>
                <HighSchoolResultsPage />
              </ProtectedRoute>
            } />
            <Route path="/results/university" element={
              <ProtectedRoute>
                <UniversityResultsPage />
              </ProtectedRoute>
            } />
            <Route path="/results/worker" element={
              <ProtectedRoute>
                <WorkerResultsPage />
              </ProtectedRoute>
            } />
            <Route path="/statistikk" element={<Statistics />} />
            <Route path="/utdanning/:universityId/:studiekode" element={<EducationDetailsPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
