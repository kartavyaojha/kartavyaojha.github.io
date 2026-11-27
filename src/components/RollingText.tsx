'use client';

import React from 'react';

interface RollingTextProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Two identical spans stacked vertically inside an overflow-hidden inline-block container.
 * On hover (or parent .rolling-trigger hover), translates both spans up by -100%
 * with cubic-bezier(0.76, 0, 0.24, 1) over 350ms.
 */
export function RollingText({ children, className = '' }: RollingTextProps) {
  return (
    <span className={`rolling-text ${className}`}>
      <span className="rolling-text__track">
        <span className="rolling-text__item">{children}</span>
        <span className="rolling-text__item rolling-text__item--clone" aria-hidden="true">
          {children}
        </span>
      </span>
    </span>
  );
}
