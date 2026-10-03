import React from 'react';
import { Star } from 'lucide-react';

const Rating = ({ value, showCount = false, count, size = 'sm' }) => {
  const filled = Math.floor(value);
  const hasHalf = value - filled >= 0.5;
  const empty = 5 - filled - (hasHalf ? 1 : 0);
  const iconSize = size === 'sm' ? 'w-3 h-3' : 'w-4 h-4';

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center gap-0.5">
        {Array.from({ length: filled }).map((_, i) => (
          <Star key={`f-${i}`} className={`${iconSize} fill-amber-400 stroke-amber-400`} />
        ))}
        {hasHalf && (
          <div className="relative">
            <Star className={`${iconSize} fill-stone-200 stroke-stone-200`} />
            <div className="absolute inset-0 overflow-hidden w-1/2">
              <Star className={`${iconSize} fill-amber-400 stroke-amber-400`} />
            </div>
          </div>
        )}
        {Array.from({ length: empty }).map((_, i) => (
          <Star key={`e-${i}`} className={`${iconSize} fill-stone-200 stroke-stone-200`} />
        ))}
      </div>
      <span className="text-amber-600 font-semibold text-xs">{value}</span>
      {showCount && count && (
        <span className="text-stone-400 text-xs">({count})</span>
      )}
    </div>
  );
};

export default Rating;