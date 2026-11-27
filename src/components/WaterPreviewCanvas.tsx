'use client';

import React, { useEffect, useRef } from 'react';
import { PreviewVariant } from '@/data/portfolio';
import { useTheme } from './ThemeContext';

function drawProjectGraphic(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  variant: PreviewVariant,
  darkMode: boolean
) {
  const bg = darkMode ? '#161513' : '#EFECE3';
  const cardBg = darkMode ? '#0E0D0C' : '#F6F3EC';
  const ink = darkMode ? '#F4EFE6' : '#141413';
  const muted = darkMode ? '#9E988E' : '#6B6760';
  const accent = darkMode ? '#D8B98A' : '#141413';
  const line = darkMode ? 'rgba(244, 239, 230, 0.14)' : 'rgba(20, 20, 19, 0.14)';

  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  // Subtle architectural grid lines
  ctx.strokeStyle = line;
  ctx.lineWidth = 1;
  for (let x = 48; x < w; x += 64) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
    ctx.stroke();
  }
  for (let y = 48; y < h; y += 64) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }

  const pad = Math.round(w * 0.08);
  const innerW = w - pad * 2;
  const innerH = h - pad * 2;

  ctx.fillStyle = cardBg;
  ctx.fillRect(pad, pad, innerW, innerH);
  ctx.strokeStyle = line;
  ctx.strokeRect(pad, pad, innerW, innerH);

  ctx.fillStyle = muted;
  ctx.font = '500 13px monospace';

  if (variant === 'soc-simlab') {
    ctx.fillText('SOC-L1 SIMLAB // WAR-ROOM TRIAGE QUEUE', pad + 28, pad + 38);
    const rows = [
      ['HIGH', 'Encoded PowerShell Execution', 'WS-FIN-04 -> Escalate L2'],
      ['MED', 'Repeated SSH Auth Failures', 'LNX-EDGE-02 -> Enrich IP'],
      ['LOW', 'Anomalous DNS Lookup', 'DEV-LAB-11 -> Document'],
    ];
    rows.forEach((r, i) => {
      const ry = pad + 72 + i * 74;
      ctx.strokeStyle = line;
      ctx.strokeRect(pad + 28, ry, innerW - 56, 56);
      ctx.fillStyle = accent;
      ctx.font = '600 12px monospace';
      ctx.fillText(r[0], pad + 46, ry + 33);
      ctx.fillStyle = ink;
      ctx.font = '500 16px sans-serif';
      ctx.fillText(r[1], pad + 106, ry + 33);
      ctx.fillStyle = muted;
      ctx.font = '400 12px monospace';
      ctx.fillText(r[2], pad + innerW - 220, ry + 33);
    });
  } else if (variant === 'appsec-suite') {
    ctx.fillText('ALBUS SECURITY // RCE DETECTOR & PENTEST TRACE', pad + 28, pad + 38);
    const lines = [
      '$ python3 rce_detector.py --target staging.internal',
      '[+] Enumerating command execution & redirect sinks',
      '[!] Verified: Open Redirect + Business Logic Bypass',
      '[+] Hardening patch applied & verified via Burp Suite',
      '[✓] Award: Certificate of Excellence + Letter of Recommendation',
    ];
    lines.forEach((text, i) => {
      ctx.fillStyle = i === 2 || i === 4 ? accent : i === 0 ? muted : ink;
      ctx.font = '400 15px monospace';
      ctx.fillText(text, pad + 32, pad + 92 + i * 44);
    });
  } else if (variant === 'vaf-guardian') {
    ctx.fillText('TEAM GUARDIAN // VULNERABILITY ASSESSMENT FRAMEWORK', pad + 28, pad + 38);
    const cols = ['01 RECON', '02 SCANNER', '03 CODE REVIEW'];
    const colW = (innerW - 96) / 3;
    cols.forEach((title, i) => {
      const cx = pad + 28 + i * (colW + 20);
      const cy = pad + 82;
      ctx.strokeStyle = line;
      ctx.strokeRect(cx, cy, colW, 130);
      ctx.fillStyle = accent;
      ctx.font = '500 13px monospace';
      ctx.fillText(title, cx + 20, cy + 44);
      ctx.fillStyle = muted;
      ctx.font = '400 14px sans-serif';
      ctx.fillText('13-Engineer Cohort', cx + 20, cy + 84);
    });
    ctx.fillStyle = ink;
    ctx.font = '400 15px monospace';
    ctx.fillText('Outcome: Certificate of Appreciation for Technical Mentorship', pad + 28, pad + 266);
  } else if (variant === 'research-paper') {
    ctx.fillText('ICIECT CONFERENCE PROCEEDINGS // MONOGRAPH', pad + 28, pad + 38);
    ctx.fillStyle = ink;
    ctx.font = '400 40px Georgia, serif';
    ctx.fillText('Reducing SOC Analyst Burnout', pad + 28, pad + 128);
    ctx.fillStyle = muted;
    ctx.font = '400 16px sans-serif';
    ctx.fillText('Alert Fatigue · Context Enrichment · L1 Triage Ergonomics', pad + 28, pad + 174);
    ctx.strokeStyle = line;
    ctx.beginPath();
    ctx.moveTo(pad + 28, pad + 214);
    ctx.lineTo(pad + innerW - 28, pad + 214);
    ctx.stroke();
    ctx.fillStyle = accent;
    ctx.font = '500 13px monospace';
    ctx.fillText('MANDSAUR UNIVERSITY · PEER-REVIEWED PAPER', pad + 28, pad + 258);
  } else {
    ctx.fillText('ACS OUTREACH // MULTI-UNIVERSITY WORKSHOPS', pad + 28, pad + 38);
    const blocks = [
      ['WORKSHOPS', 'Live Cyber Drills'],
      ['UPSKILLING', 'Onboarding Tracks'],
      ['AWARENESS', 'Campus Campaigns'],
      ['LEADERSHIP', '2024 – 2025 Term'],
    ];
    const bw = (innerW - 76) / 2;
    blocks.forEach((b, idx) => {
      const bx = pad + 28 + (idx % 2) * (bw + 20);
      const by = pad + 78 + Math.floor(idx / 2) * 100;
      ctx.strokeStyle = line;
      ctx.strokeRect(bx, by, bw, 82);
      ctx.fillStyle = muted;
      ctx.font = '500 11px monospace';
      ctx.fillText(b[0], bx + 20, by + 30);
      ctx.fillStyle = ink;
      ctx.font = '500 18px sans-serif';
      ctx.fillText(b[1], bx + 20, by + 58);
    });
  }
}

/**
 * Interactive 2D water-ripple displacement canvas for the Spotlight Preview image.
 */
export function WaterPreviewCanvas({ variant }: { variant: PreviewVariant }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { darkMode, motionEnabled } = useTheme();
  const motionRef = useRef(motionEnabled);

  useEffect(() => {
    motionRef.current = motionEnabled;
  }, [motionEnabled]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const simW = 720;
    const simH = 450;
    canvas.width = simW;
    canvas.height = simH;

    // Offscreen source artwork
    const srcCanvas = document.createElement('canvas');
    srcCanvas.width = simW;
    srcCanvas.height = simH;
    const srcCtx = srcCanvas.getContext('2d');
    if (!srcCtx) return;

    drawProjectGraphic(srcCtx, simW, simH, variant, darkMode);
    const srcImage = srcCtx.getImageData(0, 0, simW, simH);
    const srcData = srcImage.data;
    const outImage = ctx.createImageData(simW, simH);
    const outData = outImage.data;

    // Half-res heightmap for crisp 60fps wave physics
    const mapW = 240;
    const mapH = 150;
    let buf1 = new Float32Array(mapW * mapH);
    let buf2 = new Float32Array(mapW * mapH);
    const damping = 0.962;
    let activeEnergy = 0;
    let rafId = 0;

    const dropAt = (nx: number, ny: number, strength = 110) => {
      const cx = Math.floor(nx * mapW);
      const cy = Math.floor(ny * mapH);
      const rad = 5;
      for (let dy = -rad; dy <= rad; dy++) {
        for (let dx = -rad; dx <= rad; dx++) {
          const px = cx + dx;
          const py = cy + dy;
          if (px > 1 && px < mapW - 1 && py > 1 && py < mapH - 1) {
            const dist = Math.hypot(dx, dy);
            if (dist <= rad) {
              buf1[py * mapW + px] += strength * (1 - dist / rad);
            }
          }
        }
      }
      activeEnergy = 120;
    };

    // Draw clean initial frame
    ctx.putImageData(srcImage, 0, 0);

    const onPointerMove = (e: PointerEvent) => {
      if (!motionRef.current) return;
      const rect = canvas.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width;
      const ny = (e.clientY - rect.top) / rect.height;
      dropAt(nx, ny, 75);
    };

    const onPointerDown = (e: PointerEvent) => {
      if (!motionRef.current) return;
      const rect = canvas.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width;
      const ny = (e.clientY - rect.top) / rect.height;
      dropAt(nx, ny, 190);
    };

    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerdown', onPointerDown);

    const step = () => {
      if (motionRef.current && activeEnergy > 0) {
        activeEnergy--;
        for (let y = 1; y < mapH - 1; y++) {
          const row = y * mapW;
          for (let x = 1; x < mapW - 1; x++) {
            const idx = row + x;
            const val =
              (buf1[idx - 1] + buf1[idx + 1] + buf1[idx - mapW] + buf1[idx + mapW]) * 0.5 -
              buf2[idx];
            buf2[idx] = val * damping;
          }
        }
        const tmp = buf1;
        buf1 = buf2;
        buf2 = tmp;

        // Displace pixels via wave slope
        for (let y = 0; y < simH; y++) {
          const my = Math.min(mapH - 2, Math.max(1, Math.floor((y / simH) * mapH)));
          const mRow = my * mapW;
          for (let x = 0; x < simW; x++) {
            const mx = Math.min(mapW - 2, Math.max(1, Math.floor((x / simW) * mapW)));
            const mIdx = mRow + mx;
            const dx = buf1[mIdx - 1] - buf1[mIdx + 1];
            const dy = buf1[mIdx - mapW] - buf1[mIdx + mapW];

            const sx = Math.min(simW - 1, Math.max(0, Math.round(x + dx * 0.22)));
            const sy = Math.min(simH - 1, Math.max(0, Math.round(y + dy * 0.22)));

            const sOff = (sy * simW + sx) * 4;
            const dOff = (y * simW + x) * 4;
            const shade = Math.max(-18, Math.min(18, (dx + dy) * 0.14));

            outData[dOff] = Math.min(255, Math.max(0, srcData[sOff] + shade));
            outData[dOff + 1] = Math.min(255, Math.max(0, srcData[sOff + 1] + shade));
            outData[dOff + 2] = Math.min(255, Math.max(0, srcData[sOff + 2] + shade));
            outData[dOff + 3] = 255;
          }
        }
        ctx.putImageData(outImage, 0, 0);
      }
      rafId = requestAnimationFrame(step);
    };

    rafId = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(rafId);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerdown', onPointerDown);
    };
  }, [variant, darkMode]);

  return (
    <canvas
      ref={canvasRef}
      className="block aspect-[16/10] w-full cursor-pointer border border-[var(--border)] object-cover"
      aria-label="Interactive water ripple project preview"
    />
  );
}
