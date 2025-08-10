import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { motion } from "framer-motion";

interface EmergencyButtonProps {
  size?: "sm" | "md" | "lg";
  animate?: boolean;
  className?: string;
}

export default function EmergencyButton({ 
  size = "md", 
  animate = true, 
  className = "" 
}: EmergencyButtonProps) {
  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-2 text-base",
    lg: "px-12 py-6 text-xl"
  };

  const buttonClasses = `
    ${animate ? "emergency-pulse" : ""} 
    bg-primary-500 hover:bg-primary-600 
    rounded-full font-semibold 
    transition-all duration-300 
    transform hover:scale-105
    ${sizeClasses[size]} 
    ${className}
  `;

  return (
    <Link href="/emergency" data-testid="emergency-button">
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.2 }}
      >
        <Button className={buttonClasses}>
          <i className="fas fa-exclamation-triangle mr-2"></i>
          Emergency
        </Button>
      </motion.div>
    </Link>
  );
}
