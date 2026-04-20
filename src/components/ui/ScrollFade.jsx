import { useState, useRef, useEffect, useCallback } from 'react';

/**
 * Wrapper that adds a bottom fade gradient when content is scrollable.
 * The gradient disappears once the user scrolls to the bottom.
 */
export default function ScrollFade({ children, maxHeight = 320, className = '' }) {
  const scrollRef = useRef(null);
  const [showFade, setShowFade] = useState(false);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const canScroll = el.scrollHeight > el.clientHeight;
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 8;
    setShowFade(canScroll && !atBottom);
  }, []);

  useEffect(() => {
    checkScroll();
    // Re-check if children change
    const observer = new ResizeObserver(checkScroll);
    if (scrollRef.current) observer.observe(scrollRef.current);
    return () => observer.disconnect();
  }, [checkScroll, children]);

  return (
    <div className={`relative ${className}`}>
      <div
        ref={scrollRef}
        onScroll={checkScroll}
        className="overflow-y-auto space-y-3"
        style={{ maxHeight }}
      >
        {children}
      </div>
      {showFade && (
        <div
          className="absolute bottom-0 left-0 right-0 h-10 pointer-events-none rounded-b-xl"
          style={{
            background: 'linear-gradient(to bottom, transparent, white)',
          }}
        />
      )}
    </div>
  );
}
