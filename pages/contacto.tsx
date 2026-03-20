// pages/contacto.tsx
import Head from 'next/head';
import { motion } from 'framer-motion';
import { MapPin, Clock, Mail, Phone, ExternalLink } from 'lucide-react';
import { Reveal, StaggerReveal, staggerItem } from '../components/Reveal';

const INFO = [
  {
    icon: MapPin,
    title: 'Dirección',
    lines: ['Presidente Irigoyen 321', 'Hurlingham, Buenos Aires', 'CP B1686'],
  },
  {
    icon: Clock,
    title: 'Turnos',
    lines: ['Turno Mañana: 7:30 – 12:30', 'Turno Tarde: 13:00 – 18:00', 'Lunes a viernes'],
  },
  {
    icon: Mail,
    title: 'Correo',
    lines: ['contacto@eest1oea.edu.ar'],
  },
  {
    icon: Phone,
    title: 'Teléfono',
    lines: ['(011) XXXX-XXXX'],
  },
];

export default function Contacto() {
  return (
    <>
      <Head><title>Contacto — EEST N°1 "OEA"</title></Head>

      <div className="px-8 md:px-16 pt-16 pb-24">

        {/* Header */}
        <Reveal>
          <p className="text-xs tracking-widest uppercase mb-4"
            style={{ color: 'var(--gold)', fontFamily: 'JetBrains Mono, monospace' }}>
            Encontranos
          </p>
          <h1 className="leading-none mb-12"
            style={{ fontFamily: 'Cormorant Garant, Georgia, serif',
              fontSize: 'clamp(2.5rem, 7vw, 6rem)', fontWeight: 300, letterSpacing: '-0.02em' }}>
            Contacto
          </h1>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

          {/* Left: info cards */}
          <div>
            <StaggerReveal className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {INFO.map(item => {
                const Icon = item.icon;
                return (
                  <motion.div key={item.title} variants={staggerItem}
                    className="p-6 rounded-3xl card-lift"
                    style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center mb-4"
                      style={{ background: 'var(--ink)' }}>
                      <Icon size={15} color="var(--paper)" strokeWidth={1.75} />
                    </div>
                    <p className="text-xs font-semibold mb-2 uppercase tracking-wider"
                      style={{ color: 'var(--muted)', fontFamily: 'JetBrains Mono, monospace' }}>
                      {item.title}
                    </p>
                    {item.lines.map((line, i) => (
                      <p key={i} className="text-sm leading-relaxed" style={{ color: 'var(--ink)' }}>
                        {line}
                      </p>
                    ))}
                  </motion.div>
                );
              })}
            </StaggerReveal>

            {/* Google Maps link */}
            <Reveal delay={0.3}>
              <a
                href="https://maps.google.com/?q=Presidente+Irigoyen+321+Hurlingham+Buenos+Aires"
                target="_blank" rel="noopener noreferrer"
              >
                <motion.div
                  className="mt-4 p-5 rounded-3xl flex items-center gap-3 cursor-pointer"
                  style={{ background: 'var(--ink)', color: 'var(--paper)' }}
                  whileHover={{ opacity: 0.9 }} whileTap={{ scale: 0.98 }}
                >
                  <MapPin size={16} />
                  <span className="text-sm font-semibold flex-1">Ver en Google Maps</span>
                  <ExternalLink size={13} style={{ opacity: 0.5 }} />
                </motion.div>
              </a>
            </Reveal>
          </div>

          {/* Right: map embed placeholder + message */}
          <Reveal delay={0.15}>
            <div>
              {/* Map embed */}
              <div
                className="w-full rounded-3xl overflow-hidden mb-6 relative"
                style={{
                  height: 300,
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                }}
              >
                <iframe
                  title="Ubicación EEST N°1 OEA"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3285!2d-58.6349!3d-34.5987!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zHurlingham!5e0!3m2!1ses!2sar!4v1234567890"
                  width="100%" height="100%"
                  style={{ border: 0, filter: 'grayscale(1) contrast(1.05)' }}
                  allowFullScreen loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>

              {/* Contact form teaser */}
              <div className="p-7 rounded-3xl" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                <p className="text-xs tracking-widest uppercase mb-4"
                  style={{ color: 'var(--gold)', fontFamily: 'JetBrains Mono, monospace' }}>
                  Radio Técnica Uno
                </p>
                <p className="text-sm leading-relaxed mb-5" style={{ color: 'var(--muted)' }}>
                  ¿Querés participar de la radio, proponer un programa o tenés alguna consulta?
                  Escribinos directamente.
                </p>
                <a
                  href="mailto:contacto@eest1oea.edu.ar"
                  className="inline-flex items-center gap-2 text-sm font-semibold"
                  style={{ color: 'var(--ink)' }}
                >
                  <Mail size={13} />
                  Enviar un mail
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </>
  );
}
