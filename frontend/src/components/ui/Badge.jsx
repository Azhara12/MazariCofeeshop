import React from 'react';

const BADGE_STYLES = {
  'Best Seller': 'bg-amber-500 text-white',
  'Popular':     'bg-orange-500 text-white',
  'New':         'bg-emerald-500 text-white',
  "Chef's Pick": 'bg-purple-600 text-white',
  'Daily Fresh': 'bg-sky-500 text-white',
  'Seasonal':    'bg-rose-500 text-white',
  'default':     'bg-[#C68B45] text-white',
};

const Badge = ({ label, className = '' }) => {
  if (!label) return null;
  const style = BADGE_STYLES[label] || BADGE_STYLES.default;
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase ${style} ${className}`}
    >
      {label}
    </span>
  );
};

export default Badge;
