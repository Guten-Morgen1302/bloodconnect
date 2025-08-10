import { motion } from "framer-motion";
import { ReactNode } from "react";

interface PageTransitionProps {
  children: ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -100 }}
      transition={{ 
        duration: 0.6, 
        ease: "easeOut",
        type: "tween"
      }}
      className="min-h-screen"
      data-testid="page-transition"
    >
      {children}
    </motion.div>
  );
}
