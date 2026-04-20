import { useState, useEffect, useCallback } from 'react';
import { AlertTriangle, X } from 'lucide-react';

const DURATION = 200; // ms

/**
 * Animated confirmation modal with destructive action styling.
 * Fades + scales in on mount, reverses on close.
 */
export default function ConfirmModal({ title, message, confirmLabel = 'Delete', onConfirm, onCancel, isLoading = false }) {
  const [phase, setPhase] = useState('entering');

  useEffect(() => {
    const raf = requestAnimationFrame(() => setPhase('open'));
    return () => cancelAnimationFrame(raf);
  }, []);

  const handleCancel = useCallback(() => {
    if (phase === 'leaving') return;
    setPhase('leaving');
    setTimeout(onCancel, DURATION);
  }, [onCancel, phase]);

  const isVisible = phase === 'open';

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={handleCancel}
        className="fixed inset-0 z-50 transition-opacity"
        style={{
          backgroundColor: 'rgba(0,0,0,0.4)',
          opacity: isVisible ? 1 : 0,
          transitionDuration: `${DURATION}ms`,
        }}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="bg-white rounded-xl shadow-xl max-w-sm w-full overflow-hidden pointer-events-auto
                     transition-all"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'scale(1)' : 'scale(0.95)',
            transitionDuration: `${DURATION}ms`,
            transitionTimingFunction: 'cubic-bezier(0.32, 0.72, 0, 1)',
          }}
        >
          {/* Header */}
          <div className="flex items-start gap-3 p-5 pb-0">
            <div className="shrink-0 w-10 h-10 rounded-full bg-orange/10 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-orange" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-dark">{title}</h3>
              <p className="text-xs text-med-gray mt-1.5 leading-relaxed">{message}</p>
            </div>
            <button
              onClick={handleCancel}
              className="shrink-0 p-1 rounded-lg hover:bg-light-gray transition-colors -mt-1 -mr-1"
            >
              <X className="w-4 h-4 text-med-gray" />
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 p-5">
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-sm text-med-gray hover:text-dark rounded-lg
                         hover:bg-light-gray transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-white bg-red rounded-lg
                         hover:bg-red-dark transition-colors
                         disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Deleting...' : confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
