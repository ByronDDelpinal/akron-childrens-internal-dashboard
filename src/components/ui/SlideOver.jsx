import { useState, useEffect, useCallback } from 'react';
import { X } from 'lucide-react';

const DURATION = 250; // ms — matches CSS transition

/**
 * Animated slide-over panel (slides in from right).
 *
 * Handles the enter/exit animation lifecycle so child forms don't need to.
 * When the user clicks the backdrop or the X button, the panel animates out
 * before unmounting.
 *
 * Usage:
 *   <SlideOver onClose={close} icon={Bell} title="Post Announcement">
 *     <form>…</form>
 *     <footer>…</footer>
 *   </SlideOver>
 */
export default function SlideOver({ onClose, icon: Icon, iconColor = 'text-teal', title, children }) {
  const [phase, setPhase] = useState('entering'); // entering → open → leaving

  // Trigger enter animation on mount
  useEffect(() => {
    const raf = requestAnimationFrame(() => setPhase('open'));
    return () => cancelAnimationFrame(raf);
  }, []);

  const handleClose = useCallback(() => {
    if (phase === 'leaving') return;
    setPhase('leaving');
    setTimeout(onClose, DURATION);
  }, [onClose, phase]);

  const isVisible = phase === 'open';

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={handleClose}
        className="fixed inset-0 z-50 transition-opacity"
        style={{
          backgroundColor: 'rgba(0,0,0,0.3)',
          opacity: isVisible ? 1 : 0,
          transitionDuration: `${DURATION}ms`,
        }}
      />

      {/* Panel */}
      <div
        className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-xl z-50
                   flex flex-col transition-transform"
        style={{
          transform: isVisible ? 'translateX(0)' : 'translateX(100%)',
          transitionDuration: `${DURATION}ms`,
          transitionTimingFunction: 'cubic-bezier(0.32, 0.72, 0, 1)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            {Icon && <Icon className={`w-4 h-4 ${iconColor}`} />}
            <h3 className="text-sm font-semibold text-dark">{title}</h3>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg hover:bg-light-gray transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {children}
      </div>
    </>
  );
}
