import { useState, useEffect, useRef, useCallback } from 'react';

export interface RadioMeta {
  live: boolean;
  listeners: number;
  title: string;
  artist: string;
  show: string;
  presenter?: string;
}

const DEFAULT: RadioMeta = {
  live: false, listeners: 0, title: 'Radio Técnica Uno', artist: '', show: '',
};

export function useRadioMetadata(intervalMs = 10000): RadioMeta {
  const [meta, setMeta] = useState<RadioMeta>(DEFAULT);

  const fetch_ = useCallback(async () => {
    try {
      const res = await fetch('/api/radio/metadata.php', { cache: 'no-store' });
      if (res.ok) {
        const d = await res.json();
        setMeta({
          live:      d.live      ?? false,
          listeners: d.listeners ?? 0,
          title:     d.title     ?? 'Radio Técnica Uno',
          artist:    d.artist    ?? '',
          show:      d.show      ?? '',
          presenter: d.presenter ?? '',
        });
      }
    } catch {}
  }, []);

  useEffect(() => {
    fetch_();
    const id = setInterval(fetch_, intervalMs);
    return () => clearInterval(id);
  }, [fetch_, intervalMs]);

  return meta;
}

export function useStreamUrl(): string {
  const [url, setUrl] = useState('');

  useEffect(() => {
    fetch('/api/radio/status.php')
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d?.streamUrl) setUrl(d.streamUrl); })
      .catch(() => {});
  }, []);

  return url || (process.env.NEXT_PUBLIC_STREAM_URL ?? '');
}

export function useAudioPlayer(streamUrl: string) {
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const toggle = useCallback(async () => {
    if (!streamUrl) return;

    if (playing) {
      audioRef.current?.pause();
      setPlaying(false);
      return;
    }

    setLoading(true);
    try {
      if (!audioRef.current) {
        audioRef.current = new Audio(streamUrl);
        audioRef.current.volume = 0.85;
        audioRef.current.onerror = () => { setPlaying(false); setLoading(false); };
        audioRef.current.onwaiting = () => setLoading(true);
        audioRef.current.oncanplay  = () => setLoading(false);
      }
      await audioRef.current.play();
      setPlaying(true);
    } catch {
      setPlaying(false);
    } finally {
      setLoading(false);
    }
  }, [streamUrl, playing]);

  useEffect(() => {
    return () => { audioRef.current?.pause(); };
  }, []);

  return { playing, loading, toggle };
}
