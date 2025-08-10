import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function Navigation() {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/find-donors", label: "Find Donors" },
    { href: "/register", label: "Register" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" }
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 w-full z-40 transition-all duration-300 ${
        isScrolled 
          ? 'bg-dark-200/90 backdrop-blur-md border-b border-dark-300' 
          : 'bg-transparent'
      }`}
      data-testid="main-navigation"
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2" data-testid="link-home-logo">
            <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
              <i className="fas fa-heart text-white text-lg"></i>
            </div>
            <span className="font-heading font-bold text-xl text-white">BloodConnect</span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-link transition-colors duration-300 ${
                  location === item.href 
                    ? 'text-accent-green' 
                    : 'text-white hover:text-accent-green'
                }`}
                data-testid={`link-${item.label.toLowerCase().replace(' ', '-')}`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Emergency Button */}
          <div className="flex items-center space-x-4">
            <Link href="/emergency" data-testid="link-emergency">
              <Button className="emergency-pulse bg-primary-500 hover:bg-primary-600 px-6 py-2 rounded-full font-semibold">
                <i className="fas fa-exclamation-triangle mr-2"></i>
                Emergency
              </Button>
            </Link>
            
            {/* Mobile Menu Button */}
            <button className="md:hidden text-white" data-testid="button-mobile-menu">
              <i className="fas fa-bars text-xl"></i>
            </button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
