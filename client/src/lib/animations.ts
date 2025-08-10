// Animation utilities and configurations for GSAP

export const fadeInUp = {
  initial: { opacity: 0, y: 50 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" }
};

export const fadeInLeft = {
  initial: { opacity: 0, x: -50 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.6, ease: "easeOut" }
};

export const fadeInRight = {
  initial: { opacity: 0, x: 50 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.6, ease: "easeOut" }
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.5, ease: "easeOut" }
};

export const slideUp = {
  initial: { opacity: 0, y: 100 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: "easeOut" }
};

// GSAP animation presets
export const gsapAnimations = {
  // Page load animations
  pageLoad: (elements: string) => {
    if (typeof window !== 'undefined' && window.gsap) {
      window.gsap.from(elements, {
        duration: 1,
        y: 100,
        opacity: 0,
        stagger: 0.1,
        ease: "power2.out"
      });
    }
  },

  // Parallax effect
  parallax: (element: string, speed: number = 0.5) => {
    if (typeof window !== 'undefined' && window.gsap && window.gsap.ScrollTrigger) {
      window.gsap.to(element, {
        yPercent: -50 * speed,
        ease: "none",
        scrollTrigger: {
          trigger: element,
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      });
    }
  },

  // Stagger fade in
  staggerFadeIn: (elements: string, delay: number = 0.1) => {
    if (typeof window !== 'undefined' && window.gsap && window.gsap.ScrollTrigger) {
      window.gsap.from(elements, {
        scrollTrigger: {
          trigger: elements,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse"
        },
        y: 50,
        opacity: 0,
        duration: 0.6,
        stagger: delay
      });
    }
  },

  // Hover animations
  hoverScale: (element: string, scale: number = 1.05) => {
    if (typeof window !== 'undefined' && window.gsap) {
      const el = document.querySelector(element);
      if (el) {
        el.addEventListener('mouseenter', () => {
          window.gsap.to(element, {
            scale: scale,
            duration: 0.3,
            ease: "power2.out"
          });
        });
        
        el.addEventListener('mouseleave', () => {
          window.gsap.to(element, {
            scale: 1,
            duration: 0.3,
            ease: "power2.out"
          });
        });
      }
    }
  },

  // Pulse animation for emergency elements
  emergencyPulse: (element: string) => {
    if (typeof window !== 'undefined' && window.gsap) {
      window.gsap.to(element, {
        scale: 1.05,
        duration: 1,
        repeat: -1,
        yoyo: true,
        ease: "power2.inOut"
      });
    }
  },

  // Loading animation
  loading: (element: string) => {
    if (typeof window !== 'undefined' && window.gsap) {
      window.gsap.to(element, {
        rotation: 360,
        duration: 1,
        repeat: -1,
        ease: "none"
      });
    }
  }
};

// Framer Motion variants for page transitions
export const pageTransitionVariants = {
  initial: {
    opacity: 0,
    y: 100,
    scale: 0.95
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut",
      type: "tween"
    }
  },
  exit: {
    opacity: 0,
    y: -100,
    scale: 1.05,
    transition: {
      duration: 0.6,
      ease: "easeIn",
      type: "tween"
    }
  }
};

// Navigation animation variants
export const navVariants = {
  hidden: {
    y: -100,
    opacity: 0
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

// Button hover variants
export const buttonHoverVariants = {
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.2,
      ease: "easeInOut"
    }
  },
  tap: {
    scale: 0.95,
    transition: {
      duration: 0.1
    }
  }
};

// Card hover variants
export const cardHoverVariants = {
  hover: {
    y: -5,
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  }
};

// Utility function to check if GSAP is loaded
export const isGSAPLoaded = () => {
  return typeof window !== 'undefined' && window.gsap;
};

// Utility function to check if ScrollTrigger is loaded
export const isScrollTriggerLoaded = () => {
  return isGSAPLoaded() && window.gsap.ScrollTrigger;
};
