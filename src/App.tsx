
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { navItems } from "./nav-items"
import Dashboard from "./pages/Dashboard"
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

const queryClient = new QueryClient()

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <BrowserRouter>
        <Routes>
          {navItems.map(({ to, page }) => (
            <Route key={to} path={to} element={page} />
          ))}
          <Route path="/dashboard" element={<Dashboard />} />
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
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
)

export default App
