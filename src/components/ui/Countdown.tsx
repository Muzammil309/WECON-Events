'use client';
import { useEffect, useMemo, useState } from 'react';

export function Countdown({ target }: { target: string }) {
  const targetMs = useMemo(() => new Date(target).getTime(), [target]);
  const [now, setNow] = useState<number>(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const delta = Math.max(0, targetMs - now);
  const d = Math.floor(delta / (1000 * 60 * 60 * 24));
  const h = Math.floor((delta / (1000 * 60 * 60)) % 24);
  const m = Math.floor((delta / (1000 * 60)) % 60);
  const s = Math.floor((delta / 1000) % 60);
  return (
    <div aria-live="polite" className="inline-flex items-center gap-3 rounded-xl border border-black/10 dark:border-white/10 bg-white/70 px-3 py-1 text-xs backdrop-blur-md">
      <span className="font-medium">Starts in:</span>
      <span>{d}d</span><span>{h}h</span><span>{m}m</span><span>{s}s</span>
    </div>
  );
}
