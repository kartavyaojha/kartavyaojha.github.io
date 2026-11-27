'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from './ThemeContext';

export function CustomCursor() {
  const { darkMode, motionEnabled } = useTheme();
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);

  const leadRef = useRef<HTMLDivElement | null>(null);
  const trail1Ref = useRef<HTMLDivElement | null>(null);
  const trail2Ref = useRef<HTMLDivElement | null>(null);
  const trail3Ref = useRef<HTMLDivElement | null>(null);

  // Detect fine pointer (desktop mouse) vs coarse pointer (touch/mobile)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
    const update = () => {
      setEnabled(mq.matches && motionEnabled);
    };
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, [motionEnabled]);

  // Toggle system cursor suppression class on <html>
  useEffect(() => {
    if (enabled) {
      document.documentElement.classList.add('custom-cursor-active');
    } else {
      document.documentElement.classList.remove('custom-cursor-active');
      setVisible(false);
    }
    return () => {
      document.documentElement.classList.remove('custom-cursor-active');
    };
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;

    const target = { x: -100, y: -100 };
    const lead = { x: -100, y: -100, prevX: -100, prevY: -100 };
    const t1 = { x: -100, y: -100 };
    const t2 = { x: -100, y: -100 };
    const t3 = { x: -100, y: -100 };

    let isHoveringClickable = false;
    let currentHoverScale = 1;
    let currentAngle = 0;
    let currentStretch = 0;
    let hasEntered = false;
    let rafId = 0;

    const onMouseMove = (e: MouseEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;

      if (!hasEntered) {
        hasEntered = true;
        lead.x = lead.prevX = t1.x = t2.x = t3.x = e.clientX;
        lead.y = lead.prevY = t1.y = t2.y = t3.y = e.clientY;
        setVisible(true);
      }

      const el = e.target as HTMLElement | null;
      isHoveringClickable = Boolean(el && el.closest('a, button, [role="button"]'));
    };

    const onMouseLeave = () => {
      hasEntered = false;
      setVisible(false);
    };

    const onMouseEnter = () => {
      if (hasEntered) setVisible(true);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    const tick = () => {
      // Lead droplet follows cursor tightly (lerp: 0.35)
      lead.prevX = lead.x;
      lead.prevY = lead.y;
      lead.x += (target.x - lead.x) * 0.35;
      lead.y += (target.y - lead.y) * 0.35;

      const vx = lead.x - lead.prevX;
      const vy = lead.y - lead.prevY;
      const speed = Math.hypot(vx, vy);

      // Trailing droplets follow lead with progressively slower lerp factors
      t1.x += (lead.x - t1.x) * 0.2;
      t1.y += (lead.y - t1.y) * 0.2;

      t2.x += (t1.x - t2.x) * 0.12;
      t2.y += (t1.y - t2.y) * 0.12;

      t3.x += (t2.x - t3.x) * 0.085;
      t3.y += (t2.y - t3.y) * 0.085;

      // Smooth velocity-driven directional squash & stretch
      const targetStretch = Math.min(1, speed / 18);
      currentStretch += (targetStretch - currentStretch) * 0.25;

      if (speed > 0.35) {
        const nextAngle = Math.atan2(vy, vx);
        // Shortest-arc angle interpolation
        let diff = nextAngle - currentAngle;
        while (diff > Math.PI) diff -= Math.PI * 2;
        while (diff < -Math.PI) diff += Math.PI * 2;
        currentAngle += diff * 0.35;
      }

      const targetHoverScale = isHoveringClickable ? 1.3 : 1;
      currentHoverScale += (targetHoverScale - currentHoverScale) * 0.22;

      const scaleX = (1 + currentStretch * 0.45) * currentHoverScale;
      const scaleY = (1 - currentStretch * 0.15) * currentHoverScale;

      if (leadRef.current) {
        leadRef.current.style.transform = `translate3d(${lead.x - 7}px, ${lead.y - 7}px, 0) rotate(${currentAngle}rad) scale(${scaleX.toFixed(3)}, ${scaleY.toFixed(3)})`;
      }
      if (trail1Ref.current) {
        trail1Ref.current.style.transform = `translate3d(${t1.x - 4}px, ${t1.y - 4}px, 0)`;
      }
      if (trail2Ref.current) {
        trail2Ref.current.style.transform = `translate3d(${t2.x - 2.25}px, ${t2.y - 2.25}px, 0)`;
      }
      if (trail3Ref.current) {
        trail3Ref.current.style.transform = `translate3d(${t3.x - 1.5}px, ${t3.y - 1.5}px, 0)`;
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
    };
  }, [enabled]);

  if (!enabled) return null;

  const dropletColor = darkMode ? '#EAE8E3' : '#161616';

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed inset-0 z-[9999] transition-opacity duration-200 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Trailing droplets (collapse smoothly into lead when stationary) */}
      <div
        ref={trail3Ref}
        className="absolute left-0 top-0 h-[3px] w-[3px] rounded-full will-change-transform"
        style={{ backgroundColor: dropletColor }}
      />
      <div
        ref={trail2Ref}
        className="absolute left-0 top-0 h-[4.5px] w-[4.5px] rounded-full will-change-transform"
        style={{ backgroundColor: dropletColor }}
      />
      <div
        ref={trail1Ref}
        className="absolute left-0 top-0 h-[8px] w-[8px] will-change-transform"
        style={{
          backgroundColor: dropletColor,
          borderRadius: '54% 46% 52% 48% / 48% 54% 46% 52%',
        }}
      />

      {/* Lead organic liquid/ink droplet (~14px) */}
      <div
        ref={leadRef}
        className="absolute left-0 top-0 h-[14px] w-[14px] will-change-transform"
        style={{
          backgroundColor: dropletColor,
          borderRadius: '56% 44% 53% 47% / 47% 55% 45% 53%',
        }}
      />
    </div>
  );
}
