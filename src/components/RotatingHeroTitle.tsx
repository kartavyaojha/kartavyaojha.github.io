'use client';

import React, { useEffect, useRef, useState } from 'react';

export interface RoleTitle {
  line1: string;
  line2: string;
  full: string;
}

export const HERO_TITLES: RoleTitle[] = [
  { line1: 'CYBERSECURITY', line2: 'ANALYST', full: 'CYBERSECURITY ANALYST' },
  { line1: 'SECURITY', line2: 'RESEARCHER', full: 'SECURITY RESEARCHER' },
  { line1: 'SOC', line2: 'ANALYST', full: 'SOC ANALYST' },
  { line1: 'THREAT', line2: 'HUNTER', full: 'THREAT HUNTER' },
  { line1: 'BLUE TEAM', line2: 'DEFENDER', full: 'BLUE TEAM DEFENDER' },
];

type TransitionKind = 'roll' | 'hex' | 'blur' | 'flip3d';

const TRANSITION_ORDER: TransitionKind[] = ['roll', 'hex', 'blur', 'flip3d'];
const HEX_GLYPHS = ['0', '1', 'A', 'B', 'C', 'D', 'E', 'F', '#', '_', '/'];
const HOLD_MS = 2800;

const RADIUS = 130;
const MAX_DISP = 12; // 10px - 14px subtle nudge
const LERP = 0.18;

interface CharPhysics {
  x: number;
  y: number;
}

interface RotatingHeroTitleProps {
  motionEnabled: boolean;
}

export function RotatingHeroTitle({ motionEnabled }: RotatingHeroTitleProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState<number | null>(null);
  const [transitionKind, setTransitionKind] = useState<TransitionKind>('roll');
  const [phase, setPhase] = useState<'idle' | 'animating'>('idle');
  const [hexLines, setHexLines] = useState<[string, string] | null>(null);
  const [isFinePointer, setIsFinePointer] = useState(false);

  const switchCountRef = useRef(0);
  const charRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const physicsRef = useRef<CharPhysics[]>([]);

  // Detect desktop fine pointer vs touch/coarse pointer
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
    const update = () => setIsFinePointer(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  // Pause cleanly on CYBERSECURITY ANALYST when Motion is off
  useEffect(() => {
    if (!motionEnabled) {
      setActiveIndex(0);
      setPrevIndex(null);
      setPhase('idle');
      setHexLines(null);
      switchCountRef.current = 0;
    }
  }, [motionEnabled]);

  // Phase 1: Hold current title readable for 2.8s
  useEffect(() => {
    if (!motionEnabled || phase !== 'idle') return;

    const holdTimer = window.setTimeout(() => {
      const kind = TRANSITION_ORDER[switchCountRef.current % TRANSITION_ORDER.length];
      switchCountRef.current += 1;

      setPrevIndex(activeIndex);
      setActiveIndex((prev) => (prev + 1) % HERO_TITLES.length);
      setTransitionKind(kind);
      setPhase('animating');
    }, HOLD_MS);

    return () => window.clearTimeout(holdTimer);
  }, [motionEnabled, phase, activeIndex]);

  // Phase 2: Complete active transition cleanly
  useEffect(() => {
    if (!motionEnabled || phase !== 'animating') return;

    const targetTitle = HERO_TITLES[activeIndex];

    if (transitionKind === 'hex') {
      const duration = 520;
      const start = performance.now();
      const totalChars = targetTitle.line1.length + targetTitle.line2.length;
      let lastTick = 0;
      let rafId = 0;

      const tickHex = (now: number) => {
        const elapsed = now - start;
        const linear = Math.min(1, elapsed / duration);
        const eased = 1 - Math.pow(1 - linear, 1.6);
        const lockedCount = Math.floor(eased * totalChars);

        if (now - lastTick >= 40 || linear >= 1) {
          lastTick = now;

          const buildLine = (text: string, offset: number) =>
            text
              .split('')
              .map((ch, idx) => {
                if (ch === ' ') return ' ';
                if (offset + idx < lockedCount) return ch;
                return HEX_GLYPHS[Math.floor(Math.random() * HEX_GLYPHS.length)];
              })
              .join('');

          if (linear < 1) {
            setHexLines([
              buildLine(targetTitle.line1, 0),
              buildLine(targetTitle.line2, targetTitle.line1.length),
            ]);
          } else {
            setHexLines(null);
            setPrevIndex(null);
            setPhase('idle');
            return;
          }
        }

        rafId = requestAnimationFrame(tickHex);
      };

      rafId = requestAnimationFrame(tickHex);
      return () => cancelAnimationFrame(rafId);
    }

    const totalChars = targetTitle.line1.length + targetTitle.line2.length;
    const settleMs =
      transitionKind === 'roll'
        ? Math.max(660, totalChars * 22 + 440)
        : transitionKind === 'blur'
        ? 660
        : 640;

    const settleTimer = window.setTimeout(() => {
      setPrevIndex(null);
      setPhase('idle');
    }, settleMs);

    return () => window.clearTimeout(settleTimer);
  }, [motionEnabled, phase, activeIndex, transitionKind]);

  // Per-letter magnetic cursor repulsion (desktop + Motion on)
  const magneticActive = motionEnabled && isFinePointer;

  useEffect(() => {
    // Reset all char transforms cleanly if disabled
    if (!magneticActive) {
      charRefs.current.forEach((el) => {
        if (el) el.style.transform = '';
      });
      physicsRef.current = [];
      return;
    }

    const pointer = { x: -9999, y: -9999, inside: false };
    let rafId = 0;

    const onMouseMove = (e: MouseEvent) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointer.inside = true;
    };

    const onMouseLeave = () => {
      pointer.inside = false;
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);

    const tick = () => {
      const refs = charRefs.current;
      const phys = physicsRef.current;

      for (let i = 0; i < refs.length; i++) {
        const el = refs[i];
        if (!el) continue;

        if (!phys[i]) {
          phys[i] = { x: 0, y: 0 };
        }
        const st = phys[i];

        let targetX = 0;
        let targetY = 0;

        if (pointer.inside) {
          const rect = el.getBoundingClientRect();
          // Subtract current displacement to get true rest center
          const restCx = rect.left + rect.width * 0.5 - st.x;
          const restCy = rect.top + rect.height * 0.5 - st.y;

          const dx = restCx - pointer.x;
          const dy = restCy - pointer.y;
          const dist = Math.hypot(dx, dy);

          if (dist < RADIUS) {
            const strength = Math.pow(1 - dist / RADIUS, 1.5);
            const inv = dist > 0.5 ? 1 / dist : 0;
            const dirX = dist > 0.5 ? dx * inv : 0;
            const dirY = dist > 0.5 ? dy * inv : -1;

            targetX = dirX * MAX_DISP * 0.65 * strength;
            targetY = dirY * MAX_DISP * strength;
          }
        }

        st.x += (targetX - st.x) * LERP;
        st.y += (targetY - st.y) * LERP;

        if (
          Math.abs(st.x) < 0.03 &&
          Math.abs(st.y) < 0.03 &&
          targetX === 0 &&
          targetY === 0
        ) {
          if (el.style.transform !== '') {
            el.style.transform = '';
          }
          st.x = 0;
          st.y = 0;
        } else {
          el.style.transform = `translate3d(${st.x.toFixed(2)}px, ${st.y.toFixed(2)}px, 0)`;
        }
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
    };
  }, [magneticActive, activeIndex, phase, transitionKind]);

  const current = HERO_TITLES[motionEnabled ? activeIndex : 0];
  const outgoing = prevIndex !== null ? HERO_TITLES[prevIndex] : null;
  const totalSlots = current.line1.length + current.line2.length;

  // Keep charRefs trimmed to active character count on render
  charRefs.current.length = totalSlots;

  const renderCharsLine = (
    text: string,
    target: string,
    offset: number,
    isRoll: boolean,
    isHex: boolean
  ) =>
    text.split('').map((ch, idx) => {
      const slot = offset + idx;
      const isDecoding = isHex && ch !== target[idx];
      const displayChar = ch === ' ' ? '\u00A0' : ch;

      return (
        <span
          key={slot}
          ref={(el) => {
            charRefs.current[slot] = el;
          }}
          className="inline-block will-change-transform"
        >
          {isRoll ? (
            <span className="inline-block overflow-hidden align-bottom leading-[0.98]">
              <span
                className="hero-char-roll inline-block"
                style={{ animationDelay: `${slot * 22}ms` }}
              >
                {displayChar}
              </span>
            </span>
          ) : (
            <span className={isDecoding ? 'inline-block opacity-45' : 'inline-block'}>
              {displayChar}
            </span>
          )}
        </span>
      );
    });

  const isRollActive = motionEnabled && phase === 'animating' && transitionKind === 'roll';
  const isHexActive = hexLines !== null;
  const line1Text = hexLines ? hexLines[0] : current.line1;
  const line2Text = hexLines ? hexLines[1] : current.line2;

  const outgoingClass =
    transitionKind === 'roll'
      ? 'hero-roll-out'
      : transitionKind === 'blur'
      ? 'hero-blur-out'
      : 'hero-flip3d-out';

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="pointer-events-none relative z-10 my-auto w-full select-none"
    >
      <span className="sr-only">{current.full}</span>

      {/* Fixed-height Regular Inter sans-serif asymmetric two-line container */}
      <div
        aria-hidden="true"
        className="relative grid min-h-[2em] w-full items-center font-sans text-[clamp(2.35rem,9.6vw,9.4rem)] font-normal uppercase leading-[0.98] tracking-[-0.02em] text-[var(--ink)] antialiased"
        style={{ perspective: '600px' }}
      >
        {/* Outgoing layer */}
        {motionEnabled &&
          phase === 'animating' &&
          outgoing &&
          transitionKind !== 'hex' && (
            <div
              key={`out-${outgoing.full}-${transitionKind}`}
              className={`col-start-1 row-start-1 flex w-full flex-col ${outgoingClass}`}
            >
              <span className="self-start whitespace-nowrap">{outgoing.line1}</span>
              <span className="ml-auto self-end whitespace-nowrap text-right">
                {outgoing.line2}
              </span>
            </div>
          )}

        {/* Incoming / Active layer */}
        <div
          key={
            motionEnabled && phase === 'animating'
              ? `in-${current.full}-${transitionKind}`
              : `steady-${current.full}`
          }
          className={`col-start-1 row-start-1 flex w-full flex-col ${
            motionEnabled && phase === 'animating' && transitionKind === 'blur'
              ? 'hero-blur-in'
              : motionEnabled && phase === 'animating' && transitionKind === 'flip3d'
              ? 'hero-flip3d-in'
              : ''
          }`}
        >
          <span className="self-start whitespace-nowrap">
            {renderCharsLine(line1Text, current.line1, 0, isRollActive, isHexActive)}
          </span>
          <span className="ml-auto self-end whitespace-nowrap text-right">
            {renderCharsLine(
              line2Text,
              current.line2,
              current.line1.length,
              isRollActive,
              isHexActive
            )}
          </span>
        </div>
      </div>
    </div>
  );
}
