import React, { useEffect, useRef } from 'react';

interface MathRendererProps {
  math: string;
  display?: boolean;
  className?: string;
}

/**
 * Renders mathematical equations using KaTeX.
 * Supports both inline ($...$) and display ($$...$$) modes.
 */
export const MathRenderer: React.FC<MathRendererProps> = ({ 
  math, 
  display = false,
  className = '' 
}) => {
  const containerRef = useRef<HTMLSpanElement>(null);
  const attemptRef = useRef(0);

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    const renderMath = () => {
      if (!window.katex) {
        // KaTeX not loaded yet, retry in a moment
        if (attemptRef.current < 10) {
          attemptRef.current++;
          setTimeout(renderMath, 100);
        } else {
          // Failed to load KaTeX after retries
          if (containerRef.current) {
            containerRef.current.textContent = math;
          }
        }
        return;
      }

      try {
        // Clean the input: remove delimiters if present
        let mathText = math.trim();
        mathText = mathText
          .replace(/^\$\$|\$\$$/g, '')
          .replace(/^\\\[|\\\]$/g, '')
          .replace(/^\$|\$$/g, '')
          .replace(/^\\\(|\\\)$/g, '')
          .trim();

        if (!mathText) return;

        // Use KaTeX to render
        window.katex.render(mathText, containerRef.current, {
          displayMode: display,
          throwOnError: false,
          trust: true,
        });
      } catch (error) {
        // Fallback: render as plain text if KaTeX fails
        if (containerRef.current) {
          containerRef.current.textContent = math;
        }
      }
    };

    renderMath();
  }, [math, display]);

  return (
    <span
      ref={containerRef}
      className={`${className} katex-inline-wrapper`}
      style={{
        display: display ? 'block' : 'inline-block',
        overflow: 'auto',
        maxWidth: display ? '100%' : 'auto',
        whiteSpace: display ? 'normal' : 'nowrap',
      }}
    />
  );
};

// Declare KaTeX global for TypeScript
declare global {
  interface Window {
    katex: any;
  }
}
