import { useState, useEffect, useRef } from 'react';

export interface RadioMetadata {
  title: string; artist: string; show: string;
  cover: string; listeners: number; live: boolean;
  presenter?: string; streamUrl?: string;
}

const DEFAULT: RadioMetadata = {
  title: 'Radio Técnica Uno', artist: '', show: '',
  cover: '/logo.png', listeners: 0, live: false,
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || '';

export function useRadioMetadata(pollMs = 12000) {
  const [meta, setMeta] = useState<RadioMetadata>(DEFAULT);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();
  const failsRef = useRef(0);

  useEffect(() => {
    let cancelled = false;
    async function poll() {
      try {
        const ctrl = new AbortController();
        const tid  = setTimeout(() => ctrl.abort(), 5000);
        const res  = await fetch(`${API_BASE}/api/radio/metadata.php`, {
          cache: 'no-store', signal: ctrl.signal,
        });
        clearTimeout(tid);
        if (res.ok && !cancelled) {
          const data = await res.json();
          setMeta(prev => ({ ...prev, ...data }));
          failsRef.current = 0;
        } else failsRef.current++;
      } catch { failsRef.current++; }
      if (!cancelled) {
        const delay = Math.min(60000, pollMs * Math.pow(2, Math.min(failsRef.current, 3)));
        timerRef.current = setTimeout(poll, delay);
      }
    }
    poll();
    return () => { cancelled = true; clearTimeout(timerRef.current); };
  }, [pollMs]);

  return meta;
}

// ── Fetches stream URL from PHP settings on mount ──────────────────────
export function useStreamUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_STREAM_URL || '';
  const [url, setUrl] = useState(envUrl);

  useEffect(() => {
    if (envUrl) return; // env var takes priority
    const API_BASE_LOCAL = process.env.NEXT_PUBLIC_API_BASE || '';
    fetch(`${API_BASE_LOCAL}/api/radio/status.php`, { cache: 'no-store' })
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d?.streamUrl) setUrl(d.streamUrl); })
      .catch(() => {});
  }, [envUrl]);

  return url;
}

// ── Audio player — pause-safe, no ghost reconnections ─────────────────
export function useAudioPlayer(streamUrl: string) {
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [volume, setVolume]   = useState(0.8);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const volRef   = useRef(0.8);

  const getAudio = (): HTMLAudioElement => {
    if (audioRef.current) return audioRef.current;
    const a = new Audio();
    a.preload = 'none';
    a.volume  = volRef.current;
    a.addEventListener('playing', () => { setPlaying(true);  setLoading(false); });
    a.addEventListener('waiting', () => setLoading(true));
    a.addEventListener('canplay', () => setLoading(false));
    a.addEventListener('pause',   () => { setPlaying(false); setLoading(false); });
    a.addEventListener('error',   () => { setPlaying(false); setLoading(false); });
    audioRef.current = a;
    return a;
  };

  useEffect(() => () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
      audioRef.current = null;
    }
  }, []);

  const play = async () => {
    if (!streamUrl) return;
    setLoading(true);
    const a = getAudio();
    if (a.networkState === 0 /* NETWORK_EMPTY */ || !a.src) a.src = streamUrl;
    try { await a.play(); }
    catch (e) { console.warn('play blocked:', e); setLoading(false); }
  };

  const pause = () => { audioRef.current?.pause(); };
  const toggle = () => (playing ? pause() : play());
  const changeVolume = (v: number) => {
    volRef.current = v; setVolume(v);
    if (audioRef.current) audioRef.current.volume = v;
  };

  return { playing, loading, volume, toggle, play, pause, changeVolume };
}
