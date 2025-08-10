import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

interface StatsCardProps {
  value: string;
  label: string;
  sublabel?: string;
  icon?: string;
  color?: "primary" | "accent-green" | "accent-coral" | "yellow";
  className?: string;
  delay?: number;
}

export default function StatsCard({ 
  value, 
  label, 
  sublabel, 
  icon, 
  color = "primary", 
  className = "",
  delay = 0
}: StatsCardProps) {
  const colorClasses = {
    primary: "text-primary-500",
    "accent-green": "text-accent-green",
    "accent-coral": "text-accent-coral",
    yellow: "text-yellow-400"
  };

  const iconColorClasses = {
    primary: "text-primary-500",
    "accent-green": "text-accent-green",
    "accent-coral": "text-accent-coral",
    yellow: "text-yellow-400"
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.5, 
        delay,
        type: "spring",
        stiffness: 100
      }}
      whileHover={{ 
        scale: 1.05,
        transition: { duration: 0.2 }
      }}
      className={className}
    >
      <Card 
        className="bg-dark-200/50 backdrop-blur-md border border-dark-300 rounded-2xl hover:border-opacity-50 hover:border-accent-green transition-all duration-300"
        data-testid="stats-card"
      >
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              {sublabel && (
                <p className="text-gray-400 text-sm mb-1" data-testid="stats-sublabel">{sublabel}</p>
              )}
              <div className={`text-3xl font-bold mb-2 ${colorClasses[color]}`} data-testid="stats-value">
                {value}
              </div>
              <div className="text-gray-400" data-testid="stats-label">{label}</div>
            </div>
            {icon && (
              <motion.i 
                className={`${icon} text-2xl ${iconColorClasses[color]}`}
                initial={{ rotate: 0 }}
                whileHover={{ rotate: 10 }}
                transition={{ duration: 0.2 }}
                data-testid="stats-icon"
              />
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
