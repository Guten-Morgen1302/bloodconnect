import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import StatsCard from "@/components/ui/stats-card";
import { useGSAP } from "@/hooks/use-gsap";
import { AppStats, defaultStats } from "@/types/stats";

export default function Home() {
  const { data: stats = defaultStats } = useQuery<AppStats>({
    queryKey: ['/api/stats'],
  });

  useGSAP(() => {
    // Parallax background elements animation
    const parallaxElements = document.querySelectorAll('.parallax-element');
    parallaxElements.forEach((element, i) => {
      window.gsap.from(element, {
        duration: 2,
        scale: 0,
        opacity: 0,
        delay: i * 0.2,
        ease: "back.out(1.7)"
      });
    });

    // Stats cards stagger animation
    window.gsap.utils.toArray('.stats-card').forEach((card: any, i: number) => {
      window.gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse"
        },
        y: 100,
        opacity: 0,
        duration: 0.8,
        delay: i * 0.1
      });
    });
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden" data-testid="home-page">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-dark-100 via-dark-200 to-primary-800/20"></div>
      
      {/* Parallax Elements */}
      <div className="absolute inset-0">
        <div className="parallax-element absolute top-20 left-10 w-32 h-32 bg-primary-500/10 rounded-full blur-xl"></div>
        <div className="parallax-element absolute bottom-20 right-10 w-48 h-48 bg-accent-green/10 rounded-full blur-xl"></div>
        <div className="parallax-element absolute top-1/2 left-1/2 w-64 h-64 bg-accent-coral/10 rounded-full blur-xl transform -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      <div className="relative container mx-auto px-6 pt-32 pb-20">
        <div className="text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-heading font-bold text-6xl md:text-8xl mb-6"
            data-testid="hero-title"
          >
            <span className="gradient-text">
              Save Lives
            </span>
            <br />
            <span className="text-white">Connect Donors</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-body text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto"
            data-testid="hero-description"
          >
            Real-time blood donor matching with AI-powered emergency response. Connect with verified donors in your area instantly.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col md:flex-row items-center justify-center gap-6 mb-16"
          >
            <Link href="/emergency" data-testid="link-emergency-cta">
              <Button className="pulse-glow bg-gradient-to-r from-primary-500 to-primary-700 hover:from-primary-600 hover:to-primary-800 px-12 py-6 rounded-full font-heading font-bold text-xl transition-all duration-300 transform hover:scale-105">
                <i className="fas fa-exclamation-triangle mr-3"></i>
                Request Blood Now
              </Button>
            </Link>
            
            <Link href="/register" data-testid="link-register-cta">
              <Button variant="outline" className="border-2 border-accent-green text-accent-green hover:bg-accent-green hover:text-dark-100 px-12 py-6 rounded-full font-heading font-semibold text-xl transition-all duration-300">
                <i className="fas fa-user-plus mr-3"></i>
                Become a Donor
              </Button>
            </Link>
          </motion.div>

          {/* Stats Cards */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
          >
            <StatsCard
              value={stats?.totalDonors?.toLocaleString() || "15,000+"}
              label="Registered Donors"
              color="accent-green"
              className="stats-card"
              delay={0}
            />
            <StatsCard
              value={stats?.totalDonations?.toLocaleString() || "2,500"}
              label="Lives Saved"
              color="accent-coral"
              className="stats-card"
              delay={0.2}
            />
            <StatsCard
              value="24/7"
              label="Emergency Response"
              color="primary"
              className="stats-card"
              delay={0.4}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
