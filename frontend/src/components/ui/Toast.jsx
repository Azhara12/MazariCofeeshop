import React, { useEffect } from 'react';
import { CheckCircle, XCircle, Info, ShoppingBag, X } from 'lucide-react';
import { useToast } from '../../hooks/useToast';

const TOAST_STYLES = {
  success: { bg: 'bg-emerald-600', icon: CheckCircle, bar: 'bg-emerald-300' },
  error:   { bg: 'bg-red-600',     icon: XCircle,     bar: 'bg-red-300'   },
  info:    { bg: 'bg-sky-600',     icon: Info,         bar: 'bg-sky-300'   },
  cart:    { bg: 'bg-[#C68B45]',  icon: ShoppingBag,  bar: 'bg-amber-200' },
};

const ToastItem = ({ id, message, type, leaving }) => {
  const { dismiss } = useToast();
  const { bg, icon: Icon, bar } = TOAST_STYLES[type] || TOAST_STYLES.info;

  return (
    <div
      className={`
        ${bg} text-white rounded-2xl shadow-xl overflow-hidden
        min-w-[280px] max-w-[360px] pointer-events-auto
        ${leaving ? 'animate-slideOutToast' : 'animate-slideInToast'}
      `}
      role="alert"
    >
      <div className="flex items-center gap-3 px-4 py-3.5">
        <Icon className="w-5 h-5 flex-shrink-0" />
        <p className="flex-1 text-sm font-medium leading-snug">{message}</p>
        <button
          onClick={() => dismiss(id)}
          className="opacity-70 hover:opacity-100 transition-opacity ml-1 flex-shrink-0"
          aria-label="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="toast-progress">
        <div className={`toast-progress-bar ${bar}`} />
      </div>
    </div>
  );
};

const Toast = () => {
  const { toasts } = useToast();

  return (
    <div className="toast-container">
      {toasts.map(t => (
        <ToastItem key={t.id} {...t} />
      ))}
    </div>
  );
};

export default Toast;
