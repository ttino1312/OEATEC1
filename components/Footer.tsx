// components/Footer.tsx — shared public footer
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Footer() {
  return (
    <footer style={{ borderTop: '1px solid var(--c100)', padding: 'clamp(1.25rem, 4vw, 2rem) clamp(1.25rem, 5vw, 4rem)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.875rem' }}>
        <div>
          <p style={{ fontSize: '0.67rem', fontFamily: 'IBM Plex Mono, monospace', color: 'var(--c300)', letterSpacing: '0.07em' }}>
            RADIO TÉCNICA UNO · EEST N°1 "OEA" · HURLINGHAM, BA
          </p>
          <p style={{ fontSize: '0.65rem', color: 'var(--c300)', marginTop: 3 }}>
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
              <motion.span style={{ fontSize: '0.73rem', color: 'var(--c400)', cursor: 'pointer', textDecoration: 'none' }}
                whileHover={{ color: 'var(--c600)' }}>
                {l.label}
              </motion.span>
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
