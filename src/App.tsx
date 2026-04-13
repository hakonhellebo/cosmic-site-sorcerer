
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { navItems } from "./nav-items"
import Index from "./pages/Index"
import Dashboard from "./pages/Dashboard"
import Login from "./pages/Login"
import Registration from "./pages/Registration"
import UserTypeSelection from "./pages/UserTypeSelection"
import HighSchoolQuestionnairePage from "./pages/HighSchoolQuestionnairePage"
import UniversityQuestionnairePage from "./pages/UniversityQuestionnairePage"
import WorkerQuestionnairePage from "./pages/WorkerQuestionnairePage"
import HighSchoolResultsPage from "./pages/HighSchoolResultsPage"
import UniversityResultsPage from "./pages/UniversityResultsPage"
import WorkerResultsPage from "./pages/WorkerResultsPage"
import ResultsPage from "./pages/ResultsPage"
import EmailConfirmed from "./pages/EmailConfirmed"
import VerificationPending from "./pages/VerificationPending"
import UniversityNTNU from "./pages/UniversityNTNU"
import UniversityUiO from "./pages/UniversityUiO"
import UniversityUiB from "./pages/UniversityUiB"
import UniversityNHH from "./pages/UniversityNHH"
import UniversityOsloMet from "./pages/UniversityOsloMet"
import UniversityUiS from "./pages/UniversityUiS"
import UniversityUiT from "./pages/UniversityUiT"
import UniversityNMBU from "./pages/UniversityNMBU"
import UniversityUiA from "./pages/UniversityUiA"
import UniversityHVL from "./pages/UniversityHVL"
import UniversityHiVolda from "./pages/UniversityHiVolda"
import UniversityUSN from "./pages/UniversityUSN"
import CompanyProfilePage from "./pages/CompanyProfilePage"
import EducationDetailsPage from "./pages/EducationDetailsPage"
import CareerDetailPageWrapper from "./pages/CareerDetailPage"
import TeacherDashboard from "./pages/TeacherDashboard"
import SurveyJoinPage from "./pages/SurveyJoinPage"
import { preloadStatisticsData } from "./pages/Statistics"
import { useEffect } from "react"

const queryClient = new QueryClient()

const App = () => {
  // Preload statistics data when app starts
  useEffect(() => {
    console.log("App started - preloading statistics data...");
    preloadStatisticsData();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            {navItems.map(({ to, page }) => (
              <Route key={to} path={to} element={page} />
            ))}
            
            {/* Authentication Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/registrer" element={<Registration />} />
            <Route path="/email-confirmed" element={<EmailConfirmed />} />
            <Route path="/verification-pending" element={<VerificationPending />} />
            
            {/* User Type Selection */}
            <Route path="/user-type-selection" element={<UserTypeSelection />} />
            
            {/* Questionnaire Routes */}
            <Route path="/high-school-questionnaire" element={<HighSchoolQuestionnairePage />} />
            <Route path="/university-questionnaire" element={<UniversityQuestionnairePage />} />
            <Route path="/worker-questionnaire" element={<WorkerQuestionnairePage />} />
            
            {/* Results Routes */}
            <Route path="/results" element={<ResultsPage />} />
            <Route path="/results/high-school" element={<HighSchoolResultsPage />} />
            <Route path="/results/university" element={<UniversityResultsPage />} />
            <Route path="/results/worker" element={<WorkerResultsPage />} />
            
            {/* Dashboard */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/laerer" element={<TeacherDashboard />} />
            
            {/* University Pages */}
            <Route path="/university/ntnu" element={<UniversityNTNU />} />
            <Route path="/university/uio" element={<UniversityUiO />} />
            <Route path="/university/uib" element={<UniversityUiB />} />
            <Route path="/university/nhh" element={<UniversityNHH />} />
            <Route path="/university/oslomet" element={<UniversityOsloMet />} />
            <Route path="/university/uis" element={<UniversityUiS />} />
            <Route path="/university/uit" element={<UniversityUiT />} />
            <Route path="/university/nmbu" element={<UniversityNMBU />} />
            <Route path="/university/uia" element={<UniversityUiA />} />
            <Route path="/university/hvl" element={<UniversityHVL />} />
            <Route path="/university/hivolda" element={<UniversityHiVolda />} />
            <Route path="/university/usn" element={<UniversityUSN />} />
            
            {/* Dynamic Pages */}
            <Route path="/bedrift/:companySlug" element={<CompanyProfilePage />} />
            <Route path="/utdanning/:universityId/:studiekode" element={<EducationDetailsPage />} />
            <Route path="/karriere/:careerSlug" element={<CareerDetailPageWrapper />} />
            <Route path="/survey/join/:joinCode" element={<SurveyJoinPage />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App
