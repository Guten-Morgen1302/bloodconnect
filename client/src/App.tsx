import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";

// Import pages
import Home from "@/pages/home";
import FindDonors from "@/pages/find-donors";
import Register from "@/pages/register";
import Emergency from "@/pages/emergency";
import Dashboard from "@/pages/dashboard";
import About from "@/pages/about";
import Contact from "@/pages/contact";
import Admin from "@/pages/admin";
import NotFound from "@/pages/not-found";

// Import layout components
import Navigation from "@/components/layout/navigation";
import Footer from "@/components/layout/footer";
import CustomCursor from "@/components/animations/custom-cursor";
import PageTransition from "@/components/animations/page-transition";

function Router() {
  const [location] = useLocation();

  return (
    <div className="min-h-screen bg-dark-100 text-white">
      <CustomCursor />
      <Navigation />
      
      <AnimatePresence mode="wait">
        <Switch location={location}>
          <Route path="/" component={() => <PageTransition><Home /></PageTransition>} />
          <Route path="/find-donors" component={() => <PageTransition><FindDonors /></PageTransition>} />
          <Route path="/register" component={() => <PageTransition><Register /></PageTransition>} />
          <Route path="/emergency" component={() => <PageTransition><Emergency /></PageTransition>} />
          <Route path="/dashboard" component={() => <PageTransition><Dashboard /></PageTransition>} />
          <Route path="/about" component={() => <PageTransition><About /></PageTransition>} />
          <Route path="/contact" component={() => <PageTransition><Contact /></PageTransition>} />
          <Route path="/admin" component={() => <PageTransition><Admin /></PageTransition>} />
          <Route component={() => <PageTransition><NotFound /></PageTransition>} />
        </Switch>
      </AnimatePresence>
      
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
