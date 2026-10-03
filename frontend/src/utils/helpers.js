/**
 * Format a number as USD currency
 */
export const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

/**
 * Truncate a string to a max length
 */
export const truncate = (str, max = 80) =>
  str && str.length > max ? str.slice(0, max).trimEnd() + '…' : str;

/**
 * Generate a random order ID
 */
export const generateOrderId = () =>
  `#MZR-${Math.floor(1000 + Math.random() * 9000)}`;

/**
 * Check if the store is currently open (8am - 10pm)
 */
export const isStoreOpen = () => {
  const now = new Date();
  const hour = now.getHours();
  return hour >= 8 && hour < 22;
};

/**
 * Get current store status string
 */
export const getStoreStatus = () => {
  const open = isStoreOpen();
  const now = new Date();
  const hour = now.getHours();
  if (open) {
    const closes = hour < 22 ? `Closes at 10:00 PM` : '';
    return { open: true, label: 'Open Now', detail: closes };
  }
  return { open: false, label: 'Closed', detail: 'Opens at 8:00 AM' };
};

/**
 * Simple debounce
 */
export const debounce = (fn, delay = 300) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

/**
 * Clamp a value between min and max
 */
export const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

/**
 * Merge class names (simple utility)
 */
export const cn = (...classes) => classes.filter(Boolean).join(' ');