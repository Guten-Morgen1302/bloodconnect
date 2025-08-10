import { useEffect } from "react";

declare global {
  interface Window {
    gsap: any;
  }
}

export function useGSAP(callback: () => void, dependencies: any[] = []) {
  useEffect(() => {
    if (typeof window !== 'undefined' && window.gsap) {
      // Register ScrollTrigger if available
      if (window.gsap.ScrollTrigger) {
        window.gsap.registerPlugin(window.gsap.ScrollTrigger);
      }
      
      callback();

      // Cleanup function to kill all ScrollTrigger instances created by this hook
      return () => {
        if (window.gsap.ScrollTrigger) {
          window.gsap.ScrollTrigger.getAll().forEach((trigger: any) => trigger.kill());
        }
      };
    }
  }, dependencies);
}
