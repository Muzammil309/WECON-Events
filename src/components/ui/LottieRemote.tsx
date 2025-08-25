'use client';
import { useEffect, useState } from 'react';
import Lottie from 'lottie-react';
import clsx from 'clsx';

export function LottieRemote({ url, className, loop = true, autoplay = true }: { url: string; className?: string; loop?: boolean; autoplay?: boolean }) {
  const [data, setData] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Failed to fetch Lottie: ${res.status}`);
        const json = await res.json();
        if (mounted) setData(json);
      } catch (e: any) {
        if (mounted) setError(e?.message || 'Failed to load animation');
      }
    }
    load();
    return () => { mounted = false; };
  }, [url]);

  if (error) return null;
  if (!data) return <div className={clsx('animate-pulse bg-black/5 dark:bg-white/10 rounded-3xl', className)} />;

  return (
    <Lottie autoplay={autoplay} loop={loop} className={className} animationData={data} />
  );
}
