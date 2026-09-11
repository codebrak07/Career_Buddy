import { useEffect, useRef, useState } from 'react';

interface ScrollRevealResult {
  ref: React.RefObject<HTMLDivElement | null>;
  isVisible: boolean;
}

/**
 * IntersectionObserver-based scroll reveal.
 * Once visible, stays visible (no re-hide on scroll away).
 * Respects prefers-reduced-motion.
 */
export function useScrollReveal(
  threshold = 0.15,
  rootMargin = '0px 0px -60px 0px'
): ScrollRevealResult {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Respect reduced motion — show immediately
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setIsVisible(true);
      return;
    }

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return { ref, isVisible };
}
