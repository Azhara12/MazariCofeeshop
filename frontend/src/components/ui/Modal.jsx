import React, { useEffect, useCallback } from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children, size = 'md', className = '' }) => {
  const sizeMap = {
    sm:  'max-w-md',
    md:  'max-w-xl',
    lg:  'max-w-2xl',
    xl:  'max-w-4xl',
    full:'max-w-5xl',
  };

  const handleKey = useCallback((e) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKey);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKey]);

  if (!isOpen) return null;

  return (
    <div
      className="modal-backdrop"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className={`
          bg-[#FAF6F0] rounded-3xl shadow-2xl w-full ${sizeMap[size]}
          animate-scaleIn overflow-hidden flex flex-col
          max-h-[90vh] ${className}
        `}
      >
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 flex-shrink-0">
            <h2 id="modal-title" className="text-xl font-bold text-[#3D2817]" style={{ fontFamily: 'var(--font-serif)' }}>
              {title}
            </h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center transition-colors"
              aria-label="Close modal"
            >
              <X className="w-4 h-4 text-stone-600" />
            </button>
          </div>
        )}
        {/* Body */}
        <div className="flex-1 overflow-y-auto scrollbar-thin">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
