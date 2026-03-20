// pages/podcast.tsx
import Head from 'next/head';
import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Download, Rss, X } from 'lucide-react';
import { Reveal, StaggerReveal, staggerItem } from '../components/Reveal';
import { formatDuration, formatDate, type Recording, type Show } from '../lib/types';
import { GetStaticProps } from 'next';

interface Props { episodes: Recording[]; shows: Show[]; }

interface PlayingEp { id: number; url: string; title: string; }

export default function Podcast({ episodes, shows }: Props) {
  const [filter, setFilter] = useState<number | null>(null);
  const [playing, setPlaying] = useState<PlayingEp | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const filtered = filter ? episodes.filter(e => e.show_id === filter) : episodes;

  const playEp = (ep: Recording) => {
    if (playing?.id === ep.id) {
      if (isPlaying) { audioRef.current?.pause(); setIsPlaying(false); }
      else           { audioRef.current?.play();  setIsPlaying(true); }
      return;
    }
    audioRef.current?.pause();
    const audio = new Audio(ep.file_url);
    audio.volume = 0.85;
    audio.onended = () => setIsPlaying(false);
    audio.play().catch(() => {});
    audioRef.current = audio;
    setPlaying({ id: ep.id, url: ep.file_url, title: ep.title });
    setIsPlaying(true);
  };

  const closePlayer = () => {
    audioRef.current?.pause();
    audioRef.current = null;
    setPlaying(null);
    setIsPlaying(false);
  };

  return (
    <>
      <Head><title>Podcast — Radio Técnica Uno</title></Head>

      <div className="px-8 md:px-16 pt-16 pb-32 max-w-4xl">

        {/* Header */}
        <Reveal>
          <p className="text-xs tracking-widest uppercase mb-4"
            style={{ color: 'var(--gold)', fontFamily: 'JetBrains Mono, monospace' }}>
            Episodios grabados
          </p>
          <div className="flex items-end justify-between gap-4 mb-12 flex-wrap">
            <h1 className="leading-none"
              style={{ fontFamily: 'Cormorant Garant, Georgia, serif',
                fontSize: 'clamp(2.5rem, 7vw, 6rem)', fontWeight: 300, letterSpacing: '-0.02em' }}>
              Podcast
            </h1>
            <a
              href="/api/recordings/index.php?rss=1"
              target="_blank" rel="noopener"
              className="flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-xl"
              style={{ color: 'var(--muted)', border: '1px solid var(--border)', fontFamily: 'Plus Jakarta Sans' }}
            >
              <Rss size={12} /> Feed RSS
            </a>
          </div>
        </Reveal>

        {/* Filter chips */}
        {shows.length > 0 && (
          <Reveal delay={0.1}>
            <div className="flex gap-2 flex-wrap mb-10">
              <motion.button
                onClick={() => setFilter(null)}
                className="px-4 py-1.5 rounded-full text-xs font-semibold"
                style={{
                  background: filter === null ? 'var(--ink)' : 'var(--surface)',
                  color:      filter === null ? 'var(--paper)' : 'var(--muted)',
                  border:     filter === null ? '1px solid var(--ink)' : '1px solid var(--border)',
                }}
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              >
                Todos
              </motion.button>
              {shows.map(s => (
                <motion.button key={s.id}
                  onClick={() => setFilter(s.id)}
                  className="px-4 py-1.5 rounded-full text-xs font-semibold"
                  style={{
                    background: filter === s.id ? 'var(--ink)' : 'var(--surface)',
                    color:      filter === s.id ? 'var(--paper)' : 'var(--muted)',
                    border:     filter === s.id ? '1px solid var(--ink)' : '1px solid var(--border)',
                  }}
                  whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                >
                  {s.title}
                </motion.button>
              ))}
            </div>
          </Reveal>
        )}

        {/* Episodes */}
        <AnimatePresence mode="wait">
          <motion.div key={filter ?? 'all'}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>

            {filtered.length === 0 ? (
              <div className="py-24 text-center">
                <p style={{ fontFamily: 'Cormorant Garant', fontSize: '1.5rem',
                  color: 'var(--muted)', fontStyle: 'italic' }}>
                  Sin episodios todavía
                </p>
              </div>
            ) : (
              <div style={{ borderTop: '1px solid var(--border)' }}>
                {filtered.map((ep, i) => {
                  const isThisPlaying = playing?.id === ep.id && isPlaying;
                  return (
                    <motion.article key={ep.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05, duration: 0.4 }}
                      className="flex items-center gap-4 py-5"
                      style={{ borderBottom: '1px solid var(--border)' }}
                    >
                      {/* Play button */}
                      <motion.button
                        onClick={() => playEp(ep)}
                        className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
                        style={{
                          background: isThisPlaying ? 'var(--ink)' : 'var(--surface)',
                          color:      isThisPlaying ? 'var(--paper)' : 'var(--ink)',
                          border:     isThisPlaying ? '1px solid var(--ink)' : '1px solid var(--border)',
                        }}
                        whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.93 }}
                        aria-label={isThisPlaying ? 'Pausar' : 'Reproducir'}
                      >
                        {isThisPlaying
                          ? <Pause size={13} fill="currentColor" />
                          : <Play  size={13} fill="currentColor" strokeWidth={0} />}
                      </motion.button>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm leading-snug truncate"
                          style={{ color: 'var(--ink)' }}>
                          {ep.title}
                        </p>
                        <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
                          {ep.show_title ? `${ep.show_title} · ` : ''}{formatDate(ep.recorded_at)}
                        </p>
                        {ep.description && (
                          <p className="text-xs mt-1 leading-relaxed line-clamp-1"
                            style={{ color: 'var(--muted)' }}>
                            {ep.description}
                          </p>
                        )}
                      </div>

                      {/* Duration */}
                      {ep.duration_sec > 0 && (
                        <span className="text-xs flex-shrink-0 hidden sm:block"
                          style={{ color: 'var(--muted)', fontFamily: 'JetBrains Mono, monospace' }}>
                          {formatDuration(ep.duration_sec)}
                        </span>
                      )}

                      {/* Download */}
                      <a href={ep.file_url} download onClick={e => e.stopPropagation()}
                        title="Descargar episodio">
                        <motion.div
                          className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
                          style={{ color: 'var(--muted)', border: '1px solid var(--border)' }}
                          whileHover={{ borderColor: 'var(--ink)', color: 'var(--ink)', scale: 1.08 }}
                          whileTap={{ scale: 0.93 }}
                        >
                          <Download size={12} />
                        </motion.div>
                      </a>
                    </motion.article>
                  );
                })}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Floating mini-player */}
      <AnimatePresence>
        {playing && (
          <motion.div
            className="fixed z-40 flex items-center gap-3 px-4 py-3 rounded-2xl shadow-lg"
            style={{
              bottom: 'calc(var(--player-h) + 16px)',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'var(--ink)',
              color: 'var(--paper)',
              maxWidth: 'calc(100vw - 120px)',
              fontFamily: 'Plus Jakarta Sans',
            }}
            initial={{ y: 20, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          >
            <motion.button
              onClick={() => playing && playEp(filtered.find(e => e.id === playing.id)!)}
              className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(255,255,255,0.15)' }}
              whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            >
              {isPlaying
                ? <Pause size={11} fill="currentColor" />
                : <Play  size={11} fill="currentColor" strokeWidth={0} />}
            </motion.button>
            <span className="text-xs font-semibold truncate" style={{ maxWidth: 200 }}>
              {playing.title}
            </span>
            <button onClick={closePlayer} className="flex-shrink-0 opacity-50 hover:opacity-100">
              <X size={13} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  let episodes: Recording[] = [];
  let shows: Show[] = [];
  const base = process.env.PHP_API_URL || 'http://localhost/radio-escolar';
  try {
    const [eRes, sRes] = await Promise.all([
      fetch(`${base}/api/recordings/index.php`).catch(() => null),
      fetch(`${base}/api/shows/index.php`).catch(() => null),
    ]);
    if (eRes?.ok) episodes = await eRes.json();
    if (sRes?.ok) shows    = await sRes.json();
  } catch {}
  // Only show published episodes
  episodes = episodes.filter(e => e.published);
  shows    = shows.filter(s => s.active && episodes.some(e => e.show_id === s.id));
  return { props: { episodes, shows }, revalidate: 60 };
};
