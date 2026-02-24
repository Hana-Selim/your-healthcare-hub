import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Departments from "./pages/Departments";
import Doctors from "./pages/Doctors";
import Appointments from "./pages/Appointments";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import { AIChatbot } from "./components/AIChatbot";
import PatientAuth from "./pages/PatientAuth";
import PatientPortal from "./pages/PatientPortal";
import DoctorView from "./pages/DoctorView";
import DoctorProfile from "./pages/DoctorProfile";
import DepartmentDetail from "./pages/DepartmentDetail";
import DoctorAuth from "./pages/DoctorAuth";
import DoctorDashboard from "./pages/DoctorDashboard";
import EyeDiagnosis from "./pages/EyeDiagnosis";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/departments" element={<Departments />} />
          <Route path="/departments/:slug" element={<DepartmentDetail />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/doctors/:id" element={<DoctorProfile />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/patient-auth" element={<PatientAuth />} />
          <Route path="/patient-portal" element={<PatientPortal />} />
          <Route path="/doctor-view" element={<DoctorView />} />
          <Route path="/doctor-auth" element={<DoctorAuth />} />
          <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
          <Route path="/eye-diagnosis" element={<EyeDiagnosis />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <AIChatbot />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
