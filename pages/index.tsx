// pages/index.tsx
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Headphones, CalendarDays, Play, Pause, Loader2 } from 'lucide-react';
import { Reveal, StaggerReveal, staggerItem } from '../components/Reveal';
import { useRadioMetadata, useAudioPlayer, useStreamUrl } from '../hooks/useRadioMetadata';
import { formatDuration, type Show, type Recording } from '../lib/types';
import { GetStaticProps } from 'next';
import { useState } from 'react';

interface HomeProps { shows: Show[]; episodes: Recording[]; }

const todayShows = (shows: Show[]) => {
  const day = String(new Date().getDay() || 7);
  return shows.filter(s => s.days?.includes(day) && s.active).slice(0, 4);
};

// ── Hero player pill ──────────────────────────────────────────────────
function HeroPlayer() {
  const meta      = useRadioMetadata(12000);
  const streamUrl = useStreamUrl();
  const { playing, loading, toggle } = useAudioPlayer(streamUrl);
  const [toast, setToast] = useState(false);

  const handleClick = () => {
    if (!streamUrl) {
      setToast(true);
      setTimeout(() => setToast(false), 3000);
      return;
    }
    toggle();
  };

  const track = [meta.artist, meta.title].filter(Boolean).join(' — ') || 'Radio Técnica Uno';

  return (
    <div style={{ position: 'relative', display: 'inline-flex', flexDirection: 'column', alignItems: 'flex-start', marginTop: 'clamp(1.25rem, 3vw, 2rem)' }}>
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.8, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.75rem',
          padding: '0.6rem 1rem 0.6rem 0.65rem',
          background: 'rgb(60,60,60)',
          borderRadius: 99, maxWidth: '100%',
        }}
      >
        <motion.button
          onClick={handleClick}
          style={{
            width: 36, height: 36, borderRadius: '50%', border: 'none', flexShrink: 0,
            background: playing ? 'rgb(255,255,255)' : 'rgba(255,255,255,0.15)',
            color: playing ? 'rgb(60,60,60)' : 'rgb(255,255,255)',
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.92 }}
          aria-label={playing ? 'Pausar radio' : 'Escuchar radio en vivo'}
        >
          <AnimatePresence mode="wait" initial={false}>
            {loading ? (
              <motion.span key="load" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />
              </motion.span>
            ) : playing ? (
              <motion.span key="pause" initial={{ scale: 0.6 }} animate={{ scale: 1 }} exit={{ scale: 0.6 }}>
                <Pause size={14} fill="currentColor" />
              </motion.span>
            ) : (
              <motion.span key="play" initial={{ scale: 0.6 }} animate={{ scale: 1 }} exit={{ scale: 0.6 }}>
                <Play size={14} fill="currentColor" style={{ marginLeft: 1 }} />
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>

        <div style={{ minWidth: 0, overflow: 'hidden' }}>
          <p style={{
            fontSize: '0.8rem', fontWeight: 600, color: 'rgb(255,255,255)',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            lineHeight: 1.3, maxWidth: 'clamp(150px, 38vw, 300px)',
          }}>{track}</p>
          <p style={{ fontSize: '0.64rem', color: 'rgba(255,255,255,0.45)', marginTop: 1 }}>
            {meta.live ? 'En vivo ahora' : 'Escuchar en vivo'}
          </p>
        </div>

        {meta.live && (
          <span className="live-dot" style={{ width: 6, height: 6, borderRadius: '50%', background: 'rgb(228,228,229)', flexShrink: 0, marginLeft: 2 }} />
        )}
      </motion.div>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            style={{
              position: 'absolute',
              top: 'calc(100% + 8px)',
              left: 0,
              background: 'rgb(60,60,60)',
              color: 'rgb(228,228,229)',
              fontSize: '0.72rem',
              padding: '0.5rem 0.875rem',
              borderRadius: 10,
              fontFamily: 'IBM Plex Mono, monospace',
              lineHeight: 1.5,
              zIndex: 10,
              maxWidth: '90vw',
              whiteSpace: 'pre-wrap' // ✅ FIX
            }}
          >
            Stream no configurado aún.{'\n'}
            Agregá la URL en el Panel Admin → Configuración.
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Home({ shows, episodes }: HomeProps) {
  const today = todayShows(shows);

  return (
    <>
      <Head><title>Radio Técnica Uno — EEST N°1 "OEA"</title></Head>
      {/* resto igual (no cambia nada) */}
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  let shows: Show[] = [];
  let episodes: Recording[] = [];
  const base = process.env.PHP_API_URL || 'http://localhost/radio-escolar';
  try {
    const [sRes, eRes] = await Promise.all([
      fetch(`${base}/api/shows/index.php`).catch(() => null),
      fetch(`${base}/api/recordings/index.php`).catch(() => null),
    ]);
    if (sRes?.ok) shows    = await sRes.json();
    if (eRes?.ok) episodes = (await eRes.json()).filter((e: Recording) => e.published);
  } catch {}
  return { props: { shows, episodes }, revalidate: 60 };
};