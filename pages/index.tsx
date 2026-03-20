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
        {/* Play button */}
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

        {/* Info */}
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

        {/* Live dot */}
        {meta.live && (
          <span className="live-dot" style={{ width: 6, height: 6, borderRadius: '50%', background: 'rgb(228,228,229)', flexShrink: 0, marginLeft: 2 }} />
        )}
      </motion.div>

      {/* Toast: stream no configurado */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
            style={{
              position: 'absolute', top: 'calc(100% + 8px)', left: 0,
              background: 'rgb(60,60,60)', color: 'rgb(228,228,229)',
              fontSize: '0.72rem', padding: '0.5rem 0.875rem', borderRadius: 10,
              whiteSpace: 'nowrap', fontFamily: 'IBM Plex Mono, monospace',
              lineHeight: 1.5, zIndex: 10, maxWidth: '90vw', whiteSpace: 'pre-wrap' as any,
            }}
          >
            Stream no configurado aún.{'\n'}Agregá la URL en el Panel Admin → Configuración.
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

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section style={{
        minHeight: '100svh',
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        paddingLeft: 'clamp(1.25rem, 5vw, 4rem)', paddingRight: 'clamp(1.25rem, 5vw, 4rem)',
        paddingTop: 'clamp(0.75rem, 2vw, 1.5rem)',
        paddingBottom: 'clamp(4rem, 8vw, 6rem)',
        position: 'relative', overflow: 'hidden',
      }}>

        {/* Subtle dot-grid background texture */}
        <div aria-hidden style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: 'radial-gradient(circle, var(--c100) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          opacity: 0.5,
          maskImage: 'radial-gradient(ellipse 70% 80% at 80% 50%, black 0%, transparent 70%)',
          WebkitMaskImage: 'radial-gradient(ellipse 70% 80% at 80% 50%, black 0%, transparent 70%)',
        }} />

        {/* Eyebrow */}
        <motion.p
          style={{ fontSize: '0.67rem', fontFamily: 'IBM Plex Mono, monospace', color: 'var(--c300)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 'clamp(0.875rem, 2.5vw, 1.5rem)' }}
          initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
        >
          EEST N°1 "OEA" · Hurlingham, BA
        </motion.p>

        {/* Giant title */}
        <h1 style={{
          fontFamily: 'Playfair Display, Georgia, serif',
          fontSize: 'clamp(3.25rem, 12.5vw, 10.5rem)',
          fontWeight: 900, lineHeight: 0.93,
          color: 'var(--c600)', letterSpacing: '-0.025em',
        }}>
          {[
            { text: 'Radio',   style: {} },
            { text: 'Técnica', style: { fontStyle: 'italic', fontWeight: 700 } },
            { text: 'Uno',     style: {} },
          ].map(({ text, style }, i) => (
            <motion.span key={text} style={{ display: 'block', ...style }}
              initial={{ opacity: 0, x: -28 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.26 + i * 0.1, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            >{text}</motion.span>
          ))}
        </h1>

        {/* Description */}
        <motion.p
          style={{ marginTop: 'clamp(1rem, 2.5vw, 1.75rem)', maxWidth: '40ch', fontSize: 'clamp(0.84rem, 1.7vw, 0.95rem)', lineHeight: 1.7, color: 'var(--c400)' }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 0.64, duration: 0.5 }}
        >
          La radio de la Escuela de Educación Secundaria Técnica N°1.
          Programas, podcasts y música hecha por estudiantes.
        </motion.p>

        {/* Player pill */}
        <HeroPlayer />

        {/* Secondary CTAs */}
        <motion.div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', marginTop: 'clamp(0.75rem, 2vw, 1.25rem)' }}
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.4 }}>
          {[
            { href: '/programacion', icon: <CalendarDays size={12} />, label: 'Programación' },
            { href: '/podcast',      icon: <Headphones   size={12} />, label: 'Podcast' },
          ].map(({ href, icon, label }) => (
            <Link key={href} href={href}>
              <motion.span style={{
                display: 'inline-flex', alignItems: 'center', gap: 5, padding: '0.5rem 1rem', borderRadius: 99,
                fontSize: '0.8rem', fontWeight: 500, background: 'var(--surface)', color: 'var(--c500)',
                border: '1px solid var(--c100)', cursor: 'pointer', textDecoration: 'none',
              }} whileHover={{ borderColor: 'var(--c300)', color: 'var(--c600)' }} whileTap={{ scale: 0.97 }}>
                {icon} {label}
              </motion.span>
            </Link>
          ))}
        </motion.div>

        {/* Scroll indicator */}
        <motion.div style={{ position: 'absolute', bottom: 22, left: 'clamp(1.25rem, 5vw, 4rem)', display: 'flex', alignItems: 'center', gap: 5 }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 }}>
          <motion.span animate={{ y: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
            style={{ color: 'var(--c200)', fontSize: '0.85rem' }}>↓</motion.span>
          <span style={{ fontSize: '0.58rem', fontFamily: 'IBM Plex Mono, monospace', color: 'var(--c300)', letterSpacing: '0.13em', textTransform: 'uppercase' }}>Scroll</span>
        </motion.div>

        {/* Marquee ticker */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, overflow: 'hidden', borderTop: '1px solid var(--c100)', background: 'rgba(250,250,250,0.85)', padding: '5px 0', backdropFilter: 'blur(8px)' }}>
          <div className="marquee-inner">
            {Array(12).fill(null).map((_, i) => (
              <span key={i} style={{ fontSize: '0.6rem', fontFamily: 'IBM Plex Mono, monospace', color: 'var(--c300)', paddingRight: '2.5rem', letterSpacing: '0.07em', whiteSpace: 'nowrap' }}>
                RADIO TÉCNICA UNO · EEST N°1 "OEA" · HURLINGHAM, BA ✦
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOY EN LA RADIO ──────────────────────────────────── */}
      <section className="section-px section-py" style={{ borderTop: '1px solid var(--c100)' }}>
        <Reveal>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 'clamp(1.75rem, 4vw, 3rem)', flexWrap: 'wrap', gap: '0.5rem' }}>
            <h2 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: 'clamp(1.6rem, 4.5vw, 3rem)', fontWeight: 700, color: 'var(--c600)', lineHeight: 1 }}>
              Hoy en la radio
            </h2>
            <Link href="/programacion">
              <motion.span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.8rem', color: 'var(--c400)', cursor: 'pointer', textDecoration: 'none' }}
                whileHover={{ color: 'var(--c600)' }}>
                Ver todo <ArrowRight size={12} />
              </motion.span>
            </Link>
          </div>
        </Reveal>

        {today.length === 0 ? (
          <Reveal>
            <div style={{ padding: '3rem 0', textAlign: 'center' }}>
              <p style={{ fontSize: '1.1rem', fontFamily: 'Playfair Display, Georgia, serif', fontStyle: 'italic', color: 'var(--c300)' }}>No hay programas hoy.</p>
              <p style={{ fontSize: '0.82rem', color: 'var(--c300)', marginTop: '0.5rem' }}>
                <Link href="/programacion" style={{ color: 'var(--c500)' }}>Ver programación completa →</Link>
              </p>
            </div>
          </Reveal>
        ) : (
          <StaggerReveal style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 210px), 1fr))', gap: '0.875rem' }}>
            {today.map(show => (
              <motion.article key={show.id} variants={staggerItem} className="card" style={{ padding: '1.1rem 1.25rem' }}>
                <p style={{ fontSize: '0.63rem', fontFamily: 'IBM Plex Mono, monospace', color: 'var(--c400)', marginBottom: 7 }}>
                  {show.start_time?.slice(0,5)} – {show.end_time?.slice(0,5)}
                </p>
                <h3 style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--c600)', lineHeight: 1.35, marginBottom: 3 }}>
                  {show.title}
                </h3>
                {show.presenter_names?.length ? (
                  <p style={{ fontSize: '0.75rem', color: 'var(--c400)' }}>{show.presenter_names.join(', ')}</p>
                ) : null}
                {show.description && (
                  <p style={{ fontSize: '0.76rem', color: 'var(--c300)', marginTop: 5, lineHeight: 1.55, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {show.description}
                  </p>
                )}
              </motion.article>
            ))}
          </StaggerReveal>
        )}
      </section>

      {/* ── ÚLTIMOS EPISODIOS ────────────────────────────────── */}
      {episodes.length > 0 && (
        <section className="section-px section-py" style={{ borderTop: '1px solid var(--c100)' }}>
          <Reveal>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 'clamp(1.75rem, 4vw, 3rem)', flexWrap: 'wrap', gap: '0.5rem' }}>
              <h2 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: 'clamp(1.6rem, 4.5vw, 3rem)', fontWeight: 700, color: 'var(--c600)', lineHeight: 1 }}>
                Últimos episodios
              </h2>
              <Link href="/podcast">
                <motion.span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.8rem', color: 'var(--c400)', cursor: 'pointer', textDecoration: 'none' }}
                  whileHover={{ color: 'var(--c600)' }}>
                  Ver todos <ArrowRight size={12} />
                </motion.span>
              </Link>
            </div>
          </Reveal>
          <StaggerReveal style={{ borderTop: '1px solid var(--c100)' }}>
            {episodes.slice(0, 4).map(ep => (
              <motion.div key={ep.id} variants={staggerItem}
                style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 0', borderBottom: '1px solid var(--c100)' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--c600)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ep.title}</p>
                  <p style={{ fontSize: '0.7rem', color: 'var(--c400)', marginTop: 2 }}>
                    {ep.show_title ? `${ep.show_title} · ` : ''}{new Date(ep.recorded_at).toLocaleDateString('es-AR')}
                  </p>
                </div>
                {ep.duration_sec > 0 && (
                  <span style={{ fontSize: '0.7rem', color: 'var(--c300)', fontFamily: 'IBM Plex Mono, monospace', flexShrink: 0 }}>
                    {formatDuration(ep.duration_sec)}
                  </span>
                )}
                <a href={ep.file_url} download>
                  <motion.div style={{ width: 30, height: 30, borderRadius: '50%', background: 'var(--c600)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                    whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.92 }}>
                    <Play size={11} fill="white" color="white" style={{ marginLeft: 1 }} />
                  </motion.div>
                </a>
              </motion.div>
            ))}
          </StaggerReveal>
        </section>
      )}

      {/* ── INSTITUCIÓN TEASER ──────────────────────────────── */}
      <section className="section-px section-py" style={{ borderTop: '1px solid var(--c100)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: 'clamp(2rem, 6vw, 4rem)', alignItems: 'center' }}>
          <Reveal>
            <p style={{ fontSize: '0.65rem', fontFamily: 'IBM Plex Mono, monospace', color: 'var(--c300)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.875rem' }}>La escuela</p>
            <h2 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: 'clamp(1.6rem, 4.5vw, 3rem)', fontWeight: 700, lineHeight: 1.1, color: 'var(--c600)', marginBottom: '1rem' }}>
              EEST N°1 <em>"OEA"</em>
            </h2>
            <p style={{ fontSize: '0.88rem', lineHeight: 1.7, color: 'var(--c400)', marginBottom: '1.25rem', maxWidth: '44ch' }}>
              Escuela de Educación Secundaria Técnica N°1 en Hurlingham, Buenos Aires.
              Especialidad en Técnico en Programador. Turno mañana y tarde, 6 años de cursada.
            </p>
            <Link href="/institucional">
              <motion.span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: '0.84rem', fontWeight: 600, color: 'var(--c600)', cursor: 'pointer', textDecoration: 'none' }}
                whileHover={{ gap: '0.6rem' } as any}>
                Conocer más <ArrowRight size={12} />
              </motion.span>
            </Link>
          </Reveal>
          <Reveal delay={0.15}>
            <div style={{ background: 'var(--surface)', border: '1px solid var(--c100)', borderRadius: 20, aspectRatio: '1', maxWidth: 260, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Image src="/logo.png" alt="Escudo EEST N°1 OEA" width={200} height={200}
                sizes="260px" style={{ objectFit: 'contain', padding: '2rem' }} />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────── */}
      <footer style={{ borderTop: '1px solid var(--c100)', padding: 'clamp(1.5rem, 4vw, 2.5rem) clamp(1.25rem, 5vw, 4rem)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <p style={{ fontSize: '0.7rem', fontFamily: 'IBM Plex Mono, monospace', color: 'var(--c300)', letterSpacing: '0.08em' }}>
              RADIO TÉCNICA UNO · EEST N°1 "OEA" · HURLINGHAM, BA
            </p>
            <p style={{ fontSize: '0.68rem', color: 'var(--c300)', marginTop: 4 }}>
              © {new Date().getFullYear()} — Todos los derechos reservados
            </p>
          </div>
          <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
            {[
              { href: '/privacidad', label: 'Privacidad' },
              { href: '/contacto',   label: 'Contacto' },
              { href: '/admin',      label: 'Admin' },
            ].map(l => (
              <Link key={l.href} href={l.href}>
                <motion.span style={{ fontSize: '0.75rem', color: 'var(--c400)', cursor: 'pointer', textDecoration: 'none' }}
                  whileHover={{ color: 'var(--c600)' }}>{l.label}</motion.span>
              </Link>
            ))}
          </div>
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
