// pages/index.tsx
import Head from 'next/head';
import Link from 'next/link';
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
          <span className="live-dot" style={{
            width: 6, height: 6, borderRadius: '50%',
            background: 'rgb(228,228,229)', flexShrink: 0, marginLeft: 2,
          }} />
        )}
      </motion.div>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            style={{
              position: 'absolute', top: 'calc(100% + 8px)', left: 0,
              background: 'rgb(60,60,60)', color: 'rgb(228,228,229)',
              fontSize: '0.72rem', padding: '0.5rem 0.875rem',
              borderRadius: 10, fontFamily: 'IBM Plex Mono, monospace',
              lineHeight: 1.5, zIndex: 10, maxWidth: '90vw', whiteSpace: 'pre-wrap',
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
      <Head>
        <title>Radio Técnica Uno — EEST N°1 &quot;OEA&quot;</title>
        <meta name="description" content="La radio de la Escuela de Educación Secundaria Técnica N°1 OEA. Programas, podcasts y música hecha por estudiantes." />
      </Head>

      {/* Hero */}
      <section className="section-px min-h-[85vh] flex flex-col justify-center" style={{ borderBottom: '1px solid var(--c100)' }}>
        <motion.p
          className="mono text-xs mb-5 tracking-widest uppercase"
          style={{ color: 'var(--c300)' }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
        >
          EEST N°1 &quot;OEA&quot; · Hurlingham, BA
        </motion.p>

        <motion.h1
          className="display font-bold leading-none mb-6"
          style={{ fontSize: 'clamp(3.5rem, 10vw, 7rem)', color: 'var(--ink)' }}
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
        >
          Radio<br /><em>Técnica</em><br />Uno
        </motion.h1>

        <motion.p
          className="text-base max-w-md mb-2 leading-relaxed"
          style={{ color: 'var(--c400)' }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}
        >
          La radio de la Escuela de Educación Secundaria Técnica N°1.
          Programas, podcasts y música hecha por estudiantes.
        </motion.p>

        <HeroPlayer />

        <motion.div
          className="flex gap-3 flex-wrap mt-6"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
        >
          <Link
            href="/programacion"
            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm border transition-all duration-200"
            style={{ borderColor: 'var(--c200)', color: 'var(--c500)' }}
          >
            <CalendarDays size={14} /> Programación
          </Link>
          <Link
            href="/podcast"
            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm border transition-all duration-200"
            style={{ borderColor: 'var(--c200)', color: 'var(--c500)' }}
          >
            <Headphones size={14} /> Podcast
          </Link>
        </motion.div>
      </section>

      {/* Programas de hoy */}
      {today.length > 0 && (
        <section className="section-px section-py">
          <Reveal>
            <p className="mono text-xs uppercase tracking-widest mb-2" style={{ color: 'var(--c300)' }}>Hoy en la radio</p>
            <h2 className="display text-2xl font-bold mb-8" style={{ color: 'var(--ink)' }}>Próximos programas</h2>
          </Reveal>
          <StaggerReveal className="flex flex-col gap-3">
            {today.map(show => (
              <motion.div key={show.id} variants={staggerItem} className="card flex items-center gap-4 px-5 py-4">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate" style={{ color: 'var(--ink)' }}>{show.title}</p>
                  {show.presenter_names && show.presenter_names.length > 0 && (
                    <p className="text-xs mt-0.5 truncate" style={{ color: 'var(--muted)' }}>
                      {show.presenter_names.join(', ')}
                    </p>
                  )}
                </div>
                <span className="mono text-xs flex-shrink-0" style={{ color: 'var(--c400)' }}>
                  {show.start_time?.slice(0, 5)} – {show.end_time?.slice(0, 5)}
                </span>
              </motion.div>
            ))}
          </StaggerReveal>
          <Reveal delay={0.2}>
            <Link href="/programacion" className="inline-flex items-center gap-2 mt-6 text-sm" style={{ color: 'var(--c400)' }}>
              Ver programación completa <ArrowRight size={14} />
            </Link>
          </Reveal>
        </section>
      )}

      {/* Últimos episodios */}
      {episodes.length > 0 && (
        <section className="section-px section-py" style={{ borderTop: '1px solid var(--c100)' }}>
          <Reveal>
            <p className="mono text-xs uppercase tracking-widest mb-2" style={{ color: 'var(--c300)' }}>Escuchá cuando quieras</p>
            <h2 className="display text-2xl font-bold mb-8" style={{ color: 'var(--ink)' }}>Últimos episodios</h2>
          </Reveal>
          <StaggerReveal className="flex flex-col gap-3">
            {episodes.slice(0, 3).map(ep => (
              <motion.div key={ep.id} variants={staggerItem} className="card flex items-center gap-4 px-5 py-4">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate" style={{ color: 'var(--ink)' }}>{ep.title}</p>
                  {ep.show_title && (
                    <p className="text-xs mt-0.5 truncate" style={{ color: 'var(--muted)' }}>{ep.show_title}</p>
                  )}
                </div>
                {ep.duration_sec > 0 && (
                  <span className="mono text-xs flex-shrink-0" style={{ color: 'var(--c400)' }}>
                    {formatDuration(ep.duration_sec)}
                  </span>
                )}
              </motion.div>
            ))}
          </StaggerReveal>
          <Reveal delay={0.2}>
            <Link href="/podcast" className="inline-flex items-center gap-2 mt-6 text-sm" style={{ color: 'var(--c400)' }}>
              Ver todos los episodios <ArrowRight size={14} />
            </Link>
          </Reveal>
        </section>
      )}

      {/* Sobre la escuela */}
      <section className="section-px section-py" style={{ borderTop: '1px solid var(--c100)' }}>
        <Reveal>
          <p className="mono text-xs uppercase tracking-widest mb-2" style={{ color: 'var(--c300)' }}>La institución</p>
          <h2 className="display text-2xl font-bold mb-4" style={{ color: 'var(--ink)' }}>EEST N°1 &quot;OEA&quot;</h2>
          <p className="text-sm leading-relaxed max-w-lg mb-6" style={{ color: 'var(--c400)' }}>
            Escuela de Educación Secundaria Técnica N°1 &quot;Organización de los Estados Americanos&quot;.
            Especialidad Técnico en Programación. Hurlingham, Buenos Aires.
          </p>
          <Link
            href="/institucional"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm border transition-all duration-200"
            style={{ borderColor: 'var(--c200)', color: 'var(--c500)' }}
          >
            Conocé la escuela <ArrowRight size={14} />
          </Link>
        </Reveal>
      </section>

      {/* Footer */}
      <footer
        className="section-px py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        style={{ borderTop: '1px solid var(--c100)' }}
      >
        <span className="mono text-xs" style={{ color: 'var(--c300)' }}>
          © 2026 Radio Técnica Uno · EEST N°1 &quot;OEA&quot;
        </span>
        <div className="flex gap-4">
          <Link href="/privacidad" className="mono text-xs hover:underline" style={{ color: 'var(--c300)' }}>Privacidad</Link>
          <Link href="/contacto"   className="mono text-xs hover:underline" style={{ color: 'var(--c300)' }}>Contacto</Link>
        </div>
      </footer>
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
