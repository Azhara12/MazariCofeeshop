import React from 'react';
import { TIMELINE } from '../data/timeline';
import SectionTitle from '../components/cards/SectionTitle';

const Timeline = () => {
  return (
    <section className="py-24 px-6 md:px-12 bg-white relative transition-colors duration-300">
      <div className="max-w-5xl mx-auto relative z-10">
        <SectionTitle title="Our Journey" subtitle="From a small neighborhood café to a beloved coffee institution." />
        
        <div className="mt-16 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-amber-900/20 :via-amber-700/30 before:to-transparent">
          
          {TIMELINE.map((item, i) => (
            <div key={item.year} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active mb-12 animate-fadeInUp" style={{ animationDelay: `${i * 150}ms` }}>
              
              {/* Icon */}
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-amber-100 text-[#C68B45] shadow-sm shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                <span className="text-sm">{item.icon}</span>
              </div>
              
              {/* Content */}
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] bg-white p-6 rounded-3xl shadow-sm border border-stone-100 group-hover:shadow-md group-hover:-translate-y-1 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-[#3D2817] text-lg">{item.title}</h3>
                  <span className="text-[#C68B45] font-bold bg-amber-50 px-3 py-1 rounded-full text-xs">{item.year}</span>
                </div>
                <p className="text-stone-500 text-sm leading-relaxed">{item.description}</p>
              </div>

            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Timeline;
