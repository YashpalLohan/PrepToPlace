import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowUp } from 'lucide-react';
import { cn } from '../lib/utils';

interface BackToTopProps {
  scrollThreshold?: number;
  scrollContainerId?: string;
}

/**
 * BackToTop Button Component
 * 
 * Displays a floating button that appears when the user scrolls down,
 * and smoothly scrolls back to the top when clicked.
 * 
 * Features:
 * - Shows/hides based on scroll position
 * - Supports both window scrolling and nested scroll containers
 * - Smooth scrolling animation
 * - Keyboard accessible (Tab navigation + Enter/Space to activate)
 * - Respects prefers-reduced-motion
 * - Proper cleanup of event listeners
 */
export const BackToTop: React.FC<BackToTopProps> = ({
  scrollThreshold = 400,
  scrollContainerId,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const scrollContainerRef = useRef<HTMLElement | Window>(window);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Check for prefers-reduced-motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Determine scroll container
  useEffect(() => {
    if (scrollContainerId) {
      const container = document.getElementById(scrollContainerId);
      if (container) {
        scrollContainerRef.current = container;
      } else {
        scrollContainerRef.current = window;
      }
    }
  }, [scrollContainerId]);

  // Handle scroll event
  const handleScroll = useCallback(() => {
    const scrollTop =
      scrollContainerRef.current instanceof Window
        ? window.scrollY
        : (scrollContainerRef.current as HTMLElement).scrollTop;

    setIsVisible(scrollTop > scrollThreshold);
  }, [scrollThreshold]);

  // Smooth scroll to top
  const scrollToTop = useCallback(() => {
    const container = scrollContainerRef.current;
    
    if (container instanceof Window) {
      // Window scroll
      const startPosition = window.scrollY;
      const duration = prefersReducedMotion ? 0 : 600; // Respect motion preference

      if (duration === 0) {
        window.scrollTo(0, 0);
        return;
      }

      const startTime = performance.now();

      const smoothScroll = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function: easeInOutQuad
        const easeProgress =
          progress < 0.5 ? 2 * progress * progress : -1 + (4 - 2 * progress) * progress;

        window.scrollTo(0, startPosition * (1 - easeProgress));

        if (progress < 1) {
          requestAnimationFrame(smoothScroll);
        }
      };

      requestAnimationFrame(smoothScroll);
    } else {
      // Element scroll
      const startPosition = container.scrollTop;
      const duration = prefersReducedMotion ? 0 : 600;

      if (duration === 0) {
        container.scrollTop = 0;
        return;
      }

      const startTime = performance.now();

      const smoothScroll = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        const easeProgress =
          progress < 0.5 ? 2 * progress * progress : -1 + (4 - 2 * progress) * progress;

        container.scrollTop = startPosition * (1 - easeProgress);

        if (progress < 1) {
          requestAnimationFrame(smoothScroll);
        }
      };

      requestAnimationFrame(smoothScroll);
    }

    // Return focus to button after scroll
    buttonRef.current?.focus();
  }, [prefersReducedMotion]);

  // Add/remove scroll listener
  useEffect(() => {
    const container = scrollContainerRef.current;
    
    // Initial check
    handleScroll();

    // Add listener
    if (container instanceof Window) {
      window.addEventListener('scroll', handleScroll, { passive: true });
    } else {
      container.addEventListener('scroll', handleScroll, { passive: true });
    }

    // Cleanup
    return () => {
      if (container instanceof Window) {
        window.removeEventListener('scroll', handleScroll);
      } else {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, [handleScroll, scrollThreshold]);

  return (
    <button
      ref={buttonRef}
      onClick={scrollToTop}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          scrollToTop();
        }
      }}
      aria-label="Back to top"
      title="Back to top"
      className={cn(
        'fixed bottom-6 right-6 z-40',
        'w-10 h-10 rounded-full',
        'bg-white border border-slate-200 shadow-lg',
        'text-slate-600 hover:text-slate-900',
        'hover:bg-slate-50 hover:shadow-xl',
        'focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2',
        'transition-all duration-200',
        'flex items-center justify-center',
        'group',
        isVisible ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-4 pointer-events-none'
      )}
      disabled={!isVisible}
    >
      <ArrowUp className="w-5 h-5 group-hover:scale-110 transition-transform" />
    </button>
  );
};
