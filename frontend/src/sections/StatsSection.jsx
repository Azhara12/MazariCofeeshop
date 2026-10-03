import React from 'react';
import CountUp from '../components/ui/CountUp';

const StatsSection = () => {
  const stats = [
    { label: 'Cups Served', value: 125000, suffix: '+' },
    { label: 'Artisan Blends', value: 15, suffix: '' },
    { label: 'Happy Regulars', value: 3400, suffix: '+' },
    { label: 'Years of Passion', value: 7, suffix: '' }
  ];

  return (
    <section className="py-20 px-6 md:px-12 bg-[#2A1B10] text-white">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
        {stats.map((stat, i) => (
          <div key={i} className="animate-fadeInUp" style={{ animationDelay: `${i * 150}ms` }}>
            <div className="text-4xl md:text-5xl font-serif font-bold text-[#EAD0B3] mb-2">
              <CountUp end={stat.value} duration={2500} suffix={stat.suffix} />
            </div>
            <p className="text-stone-400 text-sm md:text-base font-medium tracking-wide uppercase">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default StatsSection;
