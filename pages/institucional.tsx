// pages/institucional.tsx
import Head from 'next/head';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Reveal, StaggerReveal, staggerItem } from '../components/Reveal';

const STATS = [
  { value: '6', label: 'Años de cursada' },
  { value: '2', label: 'Turnos: mañana y tarde' },
  { value: '1', label: 'Especialidad técnica' },
  { value: '∞', label: 'Voces estudiantiles' },
];

const TIMELINE = [
  { year: 'Fundación', text: 'La EEST N°1 "OEA" es fundada en Hurlingham, Buenos Aires, bajo la órbita de la Dirección General de Cultura y Educación de la Provincia de Buenos Aires.' },
  { year: 'Especialidad', text: 'La escuela se especializa en la formación de Técnicos en Programación, preparando a los estudiantes para el mundo del desarrollo de software.' },
  { year: 'Radio', text: 'Nace Radio Técnica Uno, la radio escolar que da voz a la comunidad educativa y se convierte en espacio de producción audiovisual estudiantil.' },
  { year: 'Hoy', text: 'Más de 6 años de formación técnica, dos turnos, y una comunidad vibrante de estudiantes, docentes y familias que construyen juntos el futuro tecnológico del GBA.' },
];

const ESPECIALIDAD = [
  { num: '01', title: 'Programación', desc: 'Formación en lenguajes de programación, algoritmos y estructuras de datos.' },
  { num: '02', title: 'Sistemas', desc: 'Administración de sistemas operativos, redes y arquitectura de computadoras.' },
  { num: '03', title: 'Proyecto Final', desc: 'En 6to año los estudiantes desarrollan un proyecto técnico integrador real.' },
  { num: '04', title: 'Práctica', desc: 'Pasantías y vinculación con el sector productivo local y regional.' },
];

export default function Institucional() {
  return (
    <>
      <Head><title>Institución — EEST N°1 "OEA"</title></Head>

      {/* ── Hero ── */}
      <section className="relative px-8 md:px-16 pt-16 pb-20 overflow-hidden">
        {/* Background text */}
        <div className="absolute right-0 top-0 select-none pointer-events-none opacity-30" aria-hidden
          style={{
            fontFamily: 'Cormorant Garant, Georgia, serif',
            fontSize: 'clamp(120px, 20vw, 320px)',
            fontWeight: 700,
            color: 'transparent',
            WebkitTextStroke: '1px var(--border)',
            lineHeight: 1,
            letterSpacing: '-0.04em',
          }}>
          OEA
        </div>

        <Reveal>
          <p className="text-xs tracking-widest uppercase mb-4"
            style={{ color: 'var(--gold)', fontFamily: 'JetBrains Mono, monospace' }}>
            Hurlingham, Buenos Aires
          </p>
          <h1 className="leading-none mb-6"
            style={{ fontFamily: 'Cormorant Garant, Georgia, serif',
              fontSize: 'clamp(2.5rem, 7vw, 6rem)', fontWeight: 300, letterSpacing: '-0.02em' }}>
            EEST N°1{' '}
            <em style={{ fontStyle: 'italic' }}>"OEA"</em>
          </h1>
          <p className="text-sm leading-relaxed max-w-xl" style={{ color: 'var(--muted)' }}>
            Escuela de Educación Secundaria Técnica N°1. Formamos técnicos en programación
            con una visión integral que combina teoría, práctica y vocación por la tecnología.
          </p>
        </Reveal>
      </section>

      {/* ── Stats ── */}
      <section className="px-8 md:px-16 py-16" style={{ borderTop: '1px solid var(--border)' }}>
        <StaggerReveal className="grid grid-cols-2 lg:grid-cols-4 gap-px"
          style={{ background: 'var(--border)', border: '1px solid var(--border)', borderRadius: '1.5rem', overflow: 'hidden' }}>
          {STATS.map(s => (
            <motion.div key={s.label} variants={staggerItem}
              className="flex flex-col items-center justify-center py-10 px-4 text-center"
              style={{ background: 'var(--paper)' }}>
              <span className="leading-none mb-2"
                style={{ fontFamily: 'Cormorant Garant, Georgia, serif',
                  fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 300, color: 'var(--ink)' }}>
                {s.value}
              </span>
              <span className="text-xs leading-snug" style={{ color: 'var(--muted)', maxWidth: '12ch', textAlign: 'center' }}>
                {s.label}
              </span>
            </motion.div>
          ))}
        </StaggerReveal>
      </section>

      {/* ── Logo + descripción ── */}
      <section className="px-8 md:px-16 py-16" style={{ borderTop: '1px solid var(--border)' }}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <Reveal>
            <div className="rounded-3xl overflow-hidden flex items-center justify-center"
              style={{ background: 'var(--surface)', border: '1px solid var(--border)',
                aspectRatio: '1', maxWidth: 320, margin: '0 auto' }}>
              <Image src="/logo.png" alt="Escudo EEST N°1 OEA" width={280} height={280}
                className="object-contain p-10" />
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div>
              <h2 className="mb-6 leading-tight"
                style={{ fontFamily: 'Cormorant Garant, Georgia, serif',
                  fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', fontWeight: 400 }}>
                Formación técnica de excelencia
              </h2>
              <div className="space-y-4 text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
                <p>
                  La EEST N°1 "OEA" es una escuela de educación secundaria técnica ubicada en
                  Hurlingham, partido del Gran Buenos Aires. Depende de la Dirección General
                  de Cultura y Educación de la Provincia de Buenos Aires.
                </p>
                <p>
                  Con su especialidad en <strong style={{ color: 'var(--ink)', fontWeight: 600 }}>Técnico en Programador</strong>,
                  la escuela prepara a sus estudiantes con una formación de 6 años que combina
                  las materias del tronco común de la educación secundaria con una sólida
                  formación técnico-profesional.
                </p>
                <p>
                  La escuela funciona en <strong style={{ color: 'var(--ink)', fontWeight: 600 }}>turno mañana y turno tarde</strong>,
                  permitiendo que más jóvenes del distrito accedan a esta formación diferenciada.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Especialidad ── */}
      <section className="px-8 md:px-16 py-16" style={{ borderTop: '1px solid var(--border)' }}>
        <Reveal>
          <h2 className="mb-12 leading-none"
            style={{ fontFamily: 'Cormorant Garant, Georgia, serif',
              fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 300 }}>
            Técnico en{' '}
            <em style={{ fontStyle: 'italic' }}>Programador</em>
          </h2>
        </Reveal>

        <StaggerReveal className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {ESPECIALIDAD.map(item => (
            <motion.div key={item.num} variants={staggerItem}
              className="card-lift p-7 rounded-3xl"
              style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
              <span className="block text-xs mb-4"
                style={{ color: 'var(--gold)', fontFamily: 'JetBrains Mono, monospace' }}>
                {item.num}
              </span>
              <h3 className="font-semibold text-base mb-2" style={{ color: 'var(--ink)' }}>
                {item.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
                {item.desc}
              </p>
            </motion.div>
          ))}
        </StaggerReveal>
      </section>

      {/* ── Radio Técnica Uno teaser ── */}
      <section className="px-8 md:px-16 py-16" style={{ borderTop: '1px solid var(--border)' }}>
        <Reveal>
          <div className="rounded-3xl p-10 md:p-16 text-center"
            style={{ background: 'var(--ink)', color: 'var(--paper)' }}>
            <p className="text-xs tracking-widest uppercase mb-4"
              style={{ color: 'var(--gold)', fontFamily: 'JetBrains Mono, monospace' }}>
              Proyecto estudiantil
            </p>
            <h2 className="mb-4"
              style={{ fontFamily: 'Cormorant Garant, Georgia, serif',
                fontSize: 'clamp(2rem, 5vw, 4rem)', fontWeight: 300 }}>
              Radio Técnica Uno
            </h2>
            <p className="text-sm leading-relaxed mb-8 mx-auto"
              style={{ color: 'rgba(248,247,244,0.6)', maxWidth: '48ch' }}>
              La radio escolar nace de la vocación de los estudiantes por comunicar, crear
              y experimentar con los medios. Un espacio genuino de producción audiovisual.
            </p>
            <div className="flex gap-3 justify-center flex-wrap">
              <a href="/programacion">
                <motion.span
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-semibold"
                  style={{ background: 'rgba(255,255,255,0.1)', color: 'var(--paper)', border: '1px solid rgba(255,255,255,0.15)' }}
                  whileHover={{ background: 'rgba(255,255,255,0.18)', scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Ver programación
                </motion.span>
              </a>
              <a href="/podcast">
                <motion.span
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-semibold"
                  style={{ background: 'var(--gold)', color: 'var(--ink)' }}
                  whileHover={{ scale: 1.03, opacity: 0.9 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Escuchar podcast
                </motion.span>
              </a>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
