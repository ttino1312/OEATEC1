// pages/programacion.tsx
import Head from 'next/head';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Mic } from 'lucide-react';
import { Reveal, StaggerReveal, staggerItem } from '../components/Reveal';
import { DAYS_MAP, DAYS_SHORT, type Show } from '../lib/types';
import { GetStaticProps } from 'next';

interface Props { shows: Show[]; }

const ALL_DAYS = ['1','2','3','4','5','6','7'];

export default function Programacion({ shows }: Props) {
  const todayNum = String(new Date().getDay() || 7);
  const [activeDay, setActiveDay] = useState(todayNum);

  const filtered = shows.filter(
    (s) => s.active && s.days?.includes(activeDay)
  ).sort((a, b) => a.start_time.localeCompare(b.start_time));

  const hasAny = ALL_DAYS.some(d => shows.some(s => s.active && s.days?.includes(d)));

  return (
    <>
      <Head><title>Programación — Radio Técnica Uno</title></Head>

      <div className="px-8 md:px-16 pt-16 pb-24 max-w-4xl">

        {/* Header */}
        <Reveal>
          <p className="text-xs tracking-widest uppercase mb-4" style={{ color: 'var(--gold)', fontFamily: 'JetBrains Mono, monospace' }}>
            Semana a semana
          </p>
          <h1
            className="leading-none mb-12"
            style={{
              fontFamily: 'Cormorant Garant, Georgia, serif',
              fontSize: 'clamp(2.5rem, 7vw, 6rem)',
              fontWeight: 300,
              letterSpacing: '-0.02em',
            }}
          >
            Programación
          </h1>
        </Reveal>

        {/* Day tabs */}
        <Reveal delay={0.1}>
          <div className="flex gap-2 mb-12 flex-wrap">
            {ALL_DAYS.map((day) => {
              const hasSomething = shows.some(s => s.active && s.days?.includes(day));
              const isActive = day === activeDay;
              return (
                <motion.button
                  key={day}
                  onClick={() => setActiveDay(day)}
                  className="px-4 py-2 rounded-2xl text-sm font-semibold relative transition-colors duration-200"
                  style={{
                    background: isActive ? 'var(--ink)' : 'var(--surface)',
                    color:      isActive ? 'var(--paper)' : hasSomething ? 'var(--ink)' : 'var(--muted)',
                    border:     isActive ? '1px solid var(--ink)' : '1px solid var(--border)',
                    opacity:    hasSomething ? 1 : 0.5,
                  }}
                  whileHover={!isActive ? { scale: 1.04 } : {}}
                  whileTap={{ scale: 0.97 }}
                >
                  <span className="hidden sm:inline">{DAYS_MAP[day]}</span>
                  <span className="sm:hidden">{DAYS_SHORT[day]}</span>
                  {day === todayNum && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full"
                      style={{ background: 'var(--gold)' }} />
                  )}
                </motion.button>
              );
            })}
          </div>
        </Reveal>

        {/* Shows list */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeDay}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          >
            {filtered.length === 0 ? (
              <div className="py-16 text-center">
                <p
                  className="text-4xl mb-4"
                  style={{ fontFamily: 'Cormorant Garant, Georgia, serif', fontStyle: 'italic', color: 'var(--border)' }}
                >
                  Sin programas
                </p>
                <p className="text-sm" style={{ color: 'var(--muted)' }}>
                  No hay programas cargados para este día.
                </p>
              </div>
            ) : (
              <div className="flex flex-col" style={{ borderTop: '1px solid var(--border)' }}>
                {filtered.map((show, i) => (
                  <motion.article
                    key={show.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07, duration: 0.4 }}
                    className="grid grid-cols-[80px_1fr] sm:grid-cols-[120px_1fr] gap-6 py-7"
                    style={{ borderBottom: '1px solid var(--border)' }}
                  >
                    {/* Time column */}
                    <div className="pt-0.5">
                      <p
                        className="font-semibold text-xs"
                        style={{ color: 'var(--gold)', fontFamily: 'JetBrains Mono, monospace' }}
                      >
                        {show.start_time?.slice(0, 5)}
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--muted)', fontFamily: 'JetBrains Mono, monospace' }}>
                        {show.end_time?.slice(0, 5)}
                      </p>
                    </div>

                    {/* Content */}
                    <div>
                      <h3
                        className="font-semibold text-lg leading-snug mb-1"
                        style={{ color: 'var(--ink)' }}
                      >
                        {show.title}
                      </h3>
                      {show.presenter_names?.length ? (
                        <div className="flex items-center gap-1.5 mb-2">
                          <Mic size={11} style={{ color: 'var(--muted)' }} />
                          <p className="text-xs" style={{ color: 'var(--muted)' }}>
                            {show.presenter_names?.join(', ')}

                          </p>
                        </div>
                      ) : null}
                      {show.description && (
                        <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)', maxWidth: '48ch' }}>
                          {show.description}
                        </p>
                      )}
                    </div>
                  </motion.article>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* No shows at all */}
        {!hasAny && (
          <Reveal>
            <div className="py-24 text-center">
              <p style={{ fontFamily: 'Cormorant Garant', fontSize: '1.5rem', color: 'var(--muted)', fontStyle: 'italic' }}>
                La programación se está armando.
              </p>
              <p className="text-sm mt-2" style={{ color: 'var(--muted)' }}>
                Volvé pronto o contactanos para más info.
              </p>
            </div>
          </Reveal>
        )}
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  let shows: Show[] = [];
  const base = process.env.PHP_API_URL || 'http://localhost/radio-escolar';
  try {
    const res = await fetch(`${base}/api/shows/index.php`).catch(() => null);
    if (res?.ok) shows = await res.json();
  } catch {}
  return { props: { shows }, revalidate: 120 };
};
