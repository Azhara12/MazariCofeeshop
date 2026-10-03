import React, { useState, useEffect, useRef } from 'react';

const MARQUEE_ITEMS = [
  '☕ Free shipping on orders over $25',
  '🌿 100% Organic Arabica Beans',
  '🚀 Fast 20-Min Delivery',
  '🏆 Award-Winning Roasts',
  '✨ Use COFFEE10 for 10% Off',
  '📍 Faisal Town Sadiqabad ',
];

const Header = () => {
  return (
    <div className="bg-[#2A1B10] text-[#EAD0B3] py-2 overflow-hidden relative">
      <div className="flex whitespace-nowrap" style={{ animation: 'marquee 30s linear infinite' }}>
        {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
          <span key={i} className="text-xs font-medium tracking-wide px-8 flex-shrink-0">
            {item}
          </span>
        ))}
      </div>
      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
};

export default Header;