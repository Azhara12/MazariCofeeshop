import React from 'react';
import { useTheme } from '../../context/ThemeContext';

const ThemeToggle = () => {
  const { darkMode, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 px-3 rounded-full transition-colors bg-amber-100/60 text-stone-800 hover:bg-amber-200 :bg-stone-700 flex items-center justify-center text-xs font-bold gap-1 cursor-pointer"
      title="Toggle Dark/Light Theme"
    >
      {darkMode ? '☀️ Light' : '🌙 Dark'}
    </button>
  );
};

export default ThemeToggle;