import React from 'react';

export function Badge({
  children,
  className = '',
  dotColor,
  size = 'md',
}) {
  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 tracking-wide',
    md: 'text-xs px-2.5 py-1 tracking-wide',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-md uppercase transition-colors ${sizeStyles[size]} ${className}`}
    >
      {dotColor && <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />}
      {children}
    </span>
  );
}
