import React from 'react';
import AboutSection from '../sections/AboutSection';
import Timeline from '../sections/Timeline';
import TeamSection from '../sections/TeamSection';
import StatsSection from '../sections/StatsSection';

const About = () => {
  return (
    <div className="page-enter bg-white text-stone-900 transition-colors duration-300">
      {/* Page Header */}
      <div className="bg-[#2A1B10] text-[#FAF6F0] py-20 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">About MazariCS</h1>
        <p className="text-stone-400 max-w-2xl mx-auto">Discover the passion, the people, and the story behind your favorite neighborhood coffee shop.</p>
      </div>
      
      <AboutSection />
      <StatsSection />
      <Timeline />
      <TeamSection />
    </div>
  );
};

export default About;