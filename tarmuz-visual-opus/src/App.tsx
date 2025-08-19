import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/admin/ProtectedRoute";
import AdminLayout from "@/admin/Layout";
import Index from "@/pages/Index";
import Projects from "@/pages/Projects";
import ProjectDetails from "@/pages/ProjectDetails";
import NotFound from "./pages/NotFound";
import Login from "@/admin/pages/Login";
import Dashboard from "@/admin/pages/Dashboard";
import Hero from "@/admin/pages/Hero";
import About from "@/admin/pages/About";
import Services from "@/admin/pages/Services";
import Portfolio from "@/admin/pages/Portfolio";
import Testimonials from "@/admin/pages/Testimonials";
import Contact from "@/admin/pages/Contact";
import DataMigration from "@/admin/pages/DataMigration";
import Account from "@/admin/pages/Account";
import Branding from "./admin/pages/Branding";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Index />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/project/:id" element={<ProjectDetails />} />

                {/* Admin authentication */}
                <Route path="/admin/login" element={<Login />} />

                {/* Protected Admin routes */}
                <Route element={<ProtectedRoute />}>
                  <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="hero" element={<Hero />} />
                    <Route path="about" element={<About />} />
                    <Route path="services" element={<Services />} />
                    <Route path="portfolio" element={<Portfolio />} />
                    <Route path="testimonials" element={<Testimonials />} />
                    <Route path="contact" element={<Contact />} />
                    <Route path="branding" element={<Branding />} />
                    <Route path="data-migration" element={<DataMigration />} />
                    <Route path="account" element={<Account />} />
                  </Route>
                </Route>

                {/* Catch-all */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
