'use client';

import React, { useEffect, useRef } from 'react';
import { useTheme } from './ThemeContext';

// Fast deterministic 2D gradient/value noise for smooth curl flow fields
function hash2(ix: number, iy: number): number {
  const n = Math.sin(ix * 127.1 + iy * 311.7) * 43758.5453123;
  return n - Math.floor(n);
}

function smoothNoise2D(x: number, y: number): number {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const fx = x - ix;
  const fy = y - iy;

  const ux = fx * fx * (3 - 2 * fx);
  const uy = fy * fy * (3 - 2 * fy);

  const a = hash2(ix, iy);
  const b = hash2(ix + 1, iy);
  const c = hash2(ix, iy + 1);
  const d = hash2(ix + 1, iy + 1);

  return a + (b - a) * ux + (c - a) * uy + (a - b - c + d) * ux * uy;
}

function fbm2D(x: number, y: number): number {
  return (
    smoothNoise2D(x, y) * 0.65 +
    smoothNoise2D(x * 2.03 + 11.4, y * 2.03 - 7.2) * 0.35
  );
}

// Analytical finite-difference curl of 2D noise
function curlAt(x: number, y: number, t: number): [number, number] {
  const eps = 0.03;
  const n1 = fbm2D(x, y + eps + t);
  const n2 = fbm2D(x, y - eps + t);
  const n3 = fbm2D(x + eps, y + t);
  const n4 = fbm2D(x - eps, y + t);
  const dx = (n1 - n2) / (2 * eps);
  const dy = -(n3 - n4) / (2 * eps);
  return [dx, dy];
}

// 9 pre-binned color buckets (3 hues x 3 opacity tiers) for ultra-fast batched canvas draws
const DARK_FILLS = [
  'rgba(230, 199, 139, 0.18)', // #E6C78B low
  'rgba(230, 199, 139, 0.44)', // #E6C78B mid
  'rgba(230, 199, 139, 0.72)', // #E6C78B bright
  'rgba(184, 147, 85, 0.16)',  // #B89355 low
  'rgba(184, 147, 85, 0.38)',  // #B89355 mid
  'rgba(184, 147, 85, 0.62)',  // #B89355 bright
  'rgba(255, 243, 214, 0.22)', // #FFF3D6 low
  'rgba(255, 243, 214, 0.50)', // #FFF3D6 mid
  'rgba(255, 243, 214, 0.75)', // #FFF3D6 bright
];

const LIGHT_FILLS = [
  'rgba(20, 20, 19, 0.12)',
  'rgba(20, 20, 19, 0.28)',
  'rgba(20, 20, 19, 0.48)',
  'rgba(78, 72, 62, 0.14)',
  'rgba(78, 72, 62, 0.30)',
  'rgba(78, 72, 62, 0.50)',
  'rgba(155, 118, 60, 0.15)',
  'rgba(155, 118, 60, 0.32)',
  'rgba(155, 118, 60, 0.52)',
];

export function FluidInkCanvas({
  containerRef,
  ambientCount = 3800,
  stirSignal = 0,
}: {
  containerRef: React.RefObject<HTMLElement | null>;
  ambientCount?: number;
  stirSignal?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { darkMode, motionEnabled } = useTheme();
  const darkRef = useRef(darkMode);
  const motionRef = useRef(motionEnabled);
  const injectPulseRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    darkRef.current = darkMode;
  }, [darkMode]);

  useEffect(() => {
    motionRef.current = motionEnabled;
  }, [motionEnabled]);

  useEffect(() => {
    if (stirSignal > 0 && injectPulseRef.current) {
      injectPulseRef.current();
    }
  }, [stirSignal]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const COUNT = Math.max(1200, Math.min(4800, ambientCount));
    const GRID_COLS = 56;
    const GRID_ROWS = 34;

    // Typed arrays for 60fps zero-GC particle simulation
    const px = new Float32Array(COUNT);
    const py = new Float32Array(COUNT);
    const pvx = new Float32Array(COUNT);
    const pvy = new Float32Array(COUNT);
    const pSize = new Float32Array(COUNT);
    const pBucket = new Uint8Array(COUNT);
    const pLife = new Float32Array(COUNT);
    const pMaxLife = new Float32Array(COUNT);

    // Eulerian cursor velocity injection field
    const fieldVx = new Float32Array(GRID_COLS * GRID_ROWS);
    const fieldVy = new Float32Array(GRID_COLS * GRID_ROWS);

    let width = 0;
    let height = 0;
    let dpr = 1;
    let rafId = 0;
    let time = 0;

    const pointer = {
      x: 0,
      y: 0,
      prevX: 0,
      prevY: 0,
      active: false,
    };

    const spawnParticle = (i: number, alongRibbons = true) => {
      if (alongRibbons && width > 0 && height > 0) {
        // Seed particles along diagonal organic nebula ribbons with scatter
        const t = Math.random();
        const band = Math.random();
        let bx: number;
        let by: number;
        if (band < 0.55) {
          // Sweeping central nebula ribbon behind the asymmetric hero typography
          bx = width * (0.08 + t * 0.84);
          by =
            height *
            (0.58 - Math.sin(t * Math.PI * 1.4) * 0.22 + (Math.random() - 0.5) * 0.34);
        } else if (band < 0.82) {
          // Secondary upper-right / lower-left wisps
          bx = width * (0.2 + t * 0.72);
          by =
            height *
            (0.32 + Math.cos(t * Math.PI * 1.2) * 0.18 + (Math.random() - 0.5) * 0.32);
        } else {
          // Fine ambient cosmic dust across full canvas
          bx = Math.random() * width;
          by = Math.random() * height;
        }
        px[i] = ((bx % width) + width) % width;
        py[i] = ((by % height) + height) % height;
      } else {
        px[i] = Math.random() * Math.max(1, width);
        py[i] = Math.random() * Math.max(1, height);
      }

      pvx[i] = (Math.random() - 0.5) * 0.25;
      pvy[i] = (Math.random() - 0.5) * 0.25;
      pSize[i] = 0.8 + Math.random() * 0.7; // 0.8px - 1.5px
      pBucket[i] = Math.floor(Math.random() * 9);
      pMaxLife[i] = 180 + Math.random() * 280;
      pLife[i] = Math.random() * pMaxLife[i];
    };

    const injectVelocity = (
      cx: number,
      cy: number,
      vx: number,
      vy: number,
      radiusPx: number,
      swirlBurst = false
    ) => {
      if (width <= 0 || height <= 0) return;
      const cellW = width / GRID_COLS;
      const cellH = height / GRID_ROWS;
      const gxCenter = cx / cellW;
      const gyCenter = cy / cellH;
      const radCellsX = Math.ceil(radiusPx / cellW);
      const radCellsY = Math.ceil(radiusPx / cellH);

      for (let gy = Math.max(0, Math.floor(gyCenter - radCellsY)); gy <= Math.min(GRID_ROWS - 1, Math.ceil(gyCenter + radCellsY)); gy++) {
        for (let gx = Math.max(0, Math.floor(gxCenter - radCellsX)); gx <= Math.min(GRID_COLS - 1, Math.ceil(gxCenter + radCellsX)); gx++) {
          const dx = (gx + 0.5) * cellW - cx;
          const dy = (gy + 0.5) * cellH - cy;
          const dist = Math.hypot(dx, dy);
          if (dist < radiusPx) {
            const falloff = 1 - dist / radiusPx;
            const f2 = falloff * falloff;
            const idx = gy * GRID_COLS + gx;
            if (swirlBurst) {
              const inv = dist > 1 ? 1 / dist : 0;
              // Tangential swirl + outward parting force
              fieldVx[idx] += (dx * inv * 5.2 - dy * inv * 4.4) * f2;
              fieldVy[idx] += (dy * inv * 5.2 + dx * inv * 4.4) * f2;
            } else {
              // Directional wake + gentle lateral parting
              const inv = dist > 1 ? 1 / dist : 0;
              fieldVx[idx] += (vx * 0.42 + dx * inv * 0.65) * f2;
              fieldVy[idx] += (vy * 0.42 + dy * inv * 0.65) * f2;
            }
          }
        }
      }
    };

    injectPulseRef.current = () => {
      if (width <= 0 || height <= 0) return;
      injectVelocity(width * 0.5, height * 0.55, 0, 0, Math.min(width, height) * 0.38, true);
    };

    const resize = () => {
      const rect = container.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      for (let i = 0; i < COUNT; i++) {
        spawnParticle(i, true);
      }
    };

    resize();
    window.addEventListener('resize', resize);

    const onPointerMove = (e: PointerEvent) => {
      if (!motionRef.current) return;
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      if (x < 0 || y < 0 || x > rect.width || y > rect.height) return;

      if (!pointer.active) {
        pointer.prevX = x;
        pointer.prevY = y;
        pointer.active = true;
      }

      const dx = x - pointer.prevX;
      const dy = y - pointer.prevY;
      if (Math.abs(dx) + Math.abs(dy) > 1.5) {
        const clampedX = Math.max(-28, Math.min(28, dx));
        const clampedY = Math.max(-28, Math.min(28, dy));
        injectVelocity(x, y, clampedX, clampedY, 135, false);
        pointer.prevX = x;
        pointer.prevY = y;
      }
    };

    const onPointerDown = (e: PointerEvent) => {
      if (!motionRef.current) return;
      const target = e.target as HTMLElement | null;
      if (target && target.closest('a, button')) return;
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      if (x >= 0 && y >= 0 && x <= rect.width && y <= rect.height) {
        injectVelocity(x, y, 0, 0, 175, true);
      }
    };

    container.addEventListener('pointermove', onPointerMove);
    container.addEventListener('pointerdown', onPointerDown);

    // Pre-allocated bucket index arrays to eliminate per-frame allocations
    const buckets: number[][] = Array.from({ length: 9 }, () => []);

    const drawFrame = (animate: boolean) => {
      if (width <= 0 || height <= 0) return;

      const isDark = darkRef.current;
      const palette = isDark ? DARK_FILLS : LIGHT_FILLS;

      ctx.clearRect(0, 0, width, height);

      if (animate) {
        time += 0.0024;

        // Gently decay Eulerian cursor velocity field
        for (let g = 0; g < fieldVx.length; g++) {
          fieldVx[g] *= 0.945;
          fieldVy[g] *= 0.945;
        }
      }

      for (let b = 0; b < 9; b++) buckets[b].length = 0;

      const noiseScale = 0.0026;
      const invCellW = GRID_COLS / width;
      const invCellH = GRID_ROWS / height;

      for (let i = 0; i < COUNT; i++) {
        if (animate) {
          pLife[i] += 1;
          if (pLife[i] >= pMaxLife[i]) {
            spawnParticle(i, true);
          }

          const x = px[i];
          const y = py[i];

          // Curl-noise fluid vector
          const [cx, cy] = curlAt(x * noiseScale, y * noiseScale, time);

          // Sample injected cursor velocity grid
          const gx = Math.min(GRID_COLS - 1, Math.max(0, (x * invCellW) | 0));
          const gy = Math.min(GRID_ROWS - 1, Math.max(0, (y * invCellH) | 0));
          const gIdx = gy * GRID_COLS + gx;

          // Blend curl current + cursor wake smoothly
          pvx[i] = pvx[i] * 0.92 + cx * 0.11 + fieldVx[gIdx] * 0.14;
          pvy[i] = pvy[i] * 0.92 + cy * 0.11 + fieldVy[gIdx] * 0.14;

          let nx = x + pvx[i];
          let ny = y + pvy[i];

          if (nx < 0) nx += width;
          else if (nx >= width) nx -= width;
          if (ny < 0) ny += height;
          else if (ny >= height) ny -= height;

          px[i] = nx;
          py[i] = ny;
        }

        buckets[pBucket[i]].push(i);
      }

      // Render particles batched by color & opacity tier for locked 60fps
      for (let b = 0; b < 9; b++) {
        const list = buckets[b];
        if (list.length === 0) continue;
        ctx.fillStyle = palette[b];
        for (let k = 0; k < list.length; k++) {
          const idx = list[k];
          const s = pSize[idx];
          ctx.fillRect(px[idx], py[idx], s, s);
        }
      }
    };

    const loop = () => {
      drawFrame(motionRef.current);
      if (motionRef.current) {
        rafId = requestAnimationFrame(loop);
      } else {
        rafId = 0;
      }
    };

    if (motionRef.current) {
      rafId = requestAnimationFrame(loop);
    } else {
      drawFrame(false);
    }

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
      container.removeEventListener('pointermove', onPointerMove);
      container.removeEventListener('pointerdown', onPointerDown);
    };
  }, [containerRef, motionEnabled, darkMode, ambientCount]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}
