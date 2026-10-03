import React from 'react';

const AboutSection = () => (
  <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
    <div className="relative animate-fadeInLeft">
      <div className="absolute inset-0 bg-[#C68B45]/10 rounded-[3rem] -rotate-3 scale-105" />
      <img 
        src="https://images.unsplash.com/photo-1442512595331-e89e73853f31?q=80&w=800" 
        alt="Coffee Pour" 
        className="relative rounded-[3rem] shadow-2xl w-full h-[500px] object-cover" 
      />
      
      {/* Floating Card */}
      <div className="absolute -bottom-8 -right-8 bg-white border border-stone-200 p-6 rounded-3xl shadow-xl max-w-[200px] animate-floatSlow hidden md:block">
        <div className="text-4xl mb-2">🏅</div>
        <p className="text-sm font-bold text-[#3D2817] ">Award Winning</p>
        <p className="text-xs text-stone-500 ">Voted Best Local Roaster 2023</p>
      </div>
    </div>
    
    <div className="space-y-6 animate-fadeInRight">
      <div className="flex items-center gap-3 mb-3">
        <div className="h-px w-12 bg-[#C68B45]" />
        <span className="text-xs font-semibold uppercase tracking-widest text-[#C68B45]">Our Story</span>
      </div>
      <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#3D2817] leading-tight">
        The Art of the Perfect Pour
      </h2>
      <p className="text-stone-600 text-lg leading-relaxed">
        MazariCS was born from a simple belief: coffee is more than a beverage; it's a daily ritual. We blend the comforting familiarity of a neighborhood cafe with modern brewing science.
      </p>
      <p className="text-stone-600 leading-relaxed">
        Every bean we roast tells a story of its origin, the farmers who nurtured it, and the passionate baristas who bring its flavor to life. Join us on a journey of taste and discovery.
      </p>
      
      <div className="pt-6 grid grid-cols-2 gap-6">
        <div>
          <h4 className="text-2xl font-bold text-[#3D2817] mb-1">100%</h4>
          <p className="text-sm text-stone-500 ">Organic Arabica</p>
        </div>
        <div>
          <h4 className="text-2xl font-bold text-[#3D2817] mb-1">Direct</h4>
          <p className="text-sm text-stone-500 ">Fair Trade Sourcing</p>
        </div>
      </div>
    </div>
  </section>
);

export default AboutSection;