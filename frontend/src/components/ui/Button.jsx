import React from 'react';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  loading = false,
  disabled = false,
  ...props
}) => {
  const base = [
    'font-semibold transition-all duration-200 inline-flex items-center justify-center gap-2',
    'rounded-full select-none relative overflow-hidden',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
    'active:scale-[0.97]',
    disabled || loading ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer',
  ].join(' ');

  const variants = {
    primary:   'bg-[#C68B45] hover:bg-[#b07839] text-white shadow-sm hover:shadow-md focus-visible:ring-[#C68B45]',
    secondary: 'border-2 border-[#3D2817]/20 hover:border-[#C68B45] text-[#3D2817] bg-white/60 hover:bg-white hover:text-[#C68B45]',
    ghost:     'text-[#3D2817] hover:bg-[#3D2817]/8 focus-visible:ring-[#3D2817]',
    danger:    'bg-red-500 hover:bg-red-600 text-white shadow-sm hover:shadow-md focus-visible:ring-red-500',
    dark:      'bg-[#3D2817] hover:bg-[#2A1B10] text-[#EAD0B3] shadow-sm hover:shadow-md focus-visible:ring-[#3D2817]',
    outline:   'border-2 border-[#C68B45] text-[#C68B45] hover:bg-[#C68B45] hover:text-white focus-visible:ring-[#C68B45]',
  };

  const sizes = {
    xs: 'px-3 py-1.5 text-xs',
    sm: 'px-4 py-2 text-xs',
    md: 'px-6 py-2.5 text-sm',
    lg: 'px-8 py-3.5 text-base',
    xl: 'px-10 py-4 text-lg',
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  );
};

export default Button;