import React, { createContext, useState, useCallback, useRef } from 'react';

export const ToastContext = createContext();

let nextId = 0;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts(prev => prev.map(t => t.id === id ? { ...t, leaving: true } : t));
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 400);
  }, []);

  const addToast = useCallback(({ message, type = 'success', duration = 4000 }) => {
    const id = ++nextId;
    setToasts(prev => [...prev, { id, message, type, leaving: false }]);
    setTimeout(() => dismiss(id), duration);
    return id;
  }, [dismiss]);

  const toast = {
    success: (msg, opts) => addToast({ message: msg, type: 'success', ...opts }),
    error:   (msg, opts) => addToast({ message: msg, type: 'error',   ...opts }),
    info:    (msg, opts) => addToast({ message: msg, type: 'info',    ...opts }),
    cart:    (msg, opts) => addToast({ message: msg, type: 'cart',    ...opts }),
  };

  return (
    <ToastContext.Provider value={{ toast, toasts, dismiss }}>
      {children}
    </ToastContext.Provider>
  );
};
