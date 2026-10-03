import React from 'react';

const SectionTitle = ({ title, subtitle, centered = true, className = '' }) => (
  <div className={`mb-10 ${centered ? 'text-center' : ''} ${className}`}>
    <div className={`flex items-center gap-3 mb-3 ${centered ? 'justify-center' : ''}`}>
      <div className="h-px w-12 bg-[#C68B45]/40 rounded-full" />
      <span className="text-xs font-semibold uppercase tracking-widest text-[#C68B45]">
        MazariCS
      </span>
      <div className="h-px w-12 bg-[#C68B45]/40 rounded-full" />
    </div>
    <h2 className="text-3xl md:text-4xl font-bold text-[#3D2817] leading-tight" style={{ fontFamily: 'var(--font-serif)' }}>
      {title}
    </h2>
    {subtitle && (
      <p className="mt-3 text-stone-500 text-sm md:text-base max-w-2xl leading-relaxed mx-auto">
        {subtitle}
      </p>
    )}
  </div>
);


export default SectionTitle;