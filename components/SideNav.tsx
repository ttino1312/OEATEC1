// components/SideNav.tsx — responsive sidebar + mobile drawer
import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, CalendarDays, Mic2, Building2, MapPin, Settings, Menu, X } from 'lucide-react';

const NAV = [
  { href: '/',              icon: Home,         label: 'Inicio' },
  { href: '/programacion',  icon: CalendarDays, label: 'Programación' },
  { href: '/podcast',       icon: Mic2,         label: 'Podcast' },
  { href: '/institucional', icon: Building2,    label: 'Institución' },
  { href: '/contacto',      icon: MapPin,       label: 'Contacto' },
];

// Use rgb values so Framer Motion can interpolate them
const COLORS = {
  activeBg:   'rgb(60, 60, 60)',
  activeText: 'rgb(255, 255, 255)',
  hoverBg:    'rgb(228, 228, 229)',
  hoverText:  'rgb(60, 60, 60)',
  idleBg:     'rgba(0,0,0,0)',
  idleText:   'rgb(122, 122, 122)',
};

function NavLinks({ onClose }: { onClose?: () => void }) {
  const router = useRouter();
  const isActive = (href: string) =>
    href === '/' ? router.pathname === '/' : router.pathname.startsWith(href);

  return (
    <nav style={{ flex: 1, padding: '0.5rem 0.625rem' }}>
      <p style={{
        fontSize: '0.6rem', fontFamily: 'IBM Plex Mono, monospace',
        color: 'rgb(148, 148, 148)', letterSpacing: '0.12em', textTransform: 'uppercase',
        padding: '0.5rem 0.625rem', marginBottom: '0.25rem',
      }}>Navegación</p>

      {NAV.map(item => {
        const Icon = item.icon;
        const active = isActive(item.href);
        return (
          <Link key={item.href} href={item.href} onClick={onClose}
            style={{ textDecoration: 'none', display: 'block' }}>
            <motion.div
              style={{
                display: 'flex', alignItems: 'center', gap: '0.6rem',
                padding: '0.6rem 0.75rem', borderRadius: 10, marginBottom: 2,
                fontSize: '0.875rem', fontWeight: active ? 600 : 400,
                cursor: 'pointer',
                background: active ? COLORS.activeBg : COLORS.idleBg,
                color:      active ? COLORS.activeText : COLORS.idleText,
              }}
              whileHover={!active ? { background: COLORS.hoverBg, color: COLORS.hoverText } : {}}
              transition={{ duration: 0.12 }}
            >
              <Icon size={15} strokeWidth={active ? 2 : 1.75} />
              {item.label}
            </motion.div>
          </Link>
        );
      })}
    </nav>
  );
}

function NavContent({ onClose }: { onClose?: () => void }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Logo */}
      <div style={{
        padding: '1.25rem 1rem 1.1rem',
        borderBottom: '1px solid var(--c100)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <Link href="/" onClick={onClose}
          style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', textDecoration: 'none' }}>
          <Image src="/logo.png" alt="EEST N°1 OEA" width={34} height={34}
            style={{ borderRadius: '50%', border: '1px solid var(--c100)' }} />
          <div>
            <p style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--c600)',
              fontFamily: 'IBM Plex Mono, monospace', letterSpacing: '0.04em', lineHeight: 1.2 }}>
              RADIO T1
            </p>
            <p style={{ fontSize: '0.6rem', color: 'var(--c300)', marginTop: 1 }}>
              EEST N°1 "OEA"
            </p>
          </div>
        </Link>
        {onClose && (
          <button onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--c300)', padding: 4 }}>
            <X size={15} />
          </button>
        )}
      </div>

      <NavLinks onClose={onClose} />

      {/* Bottom */}
      <div style={{ padding: '0.5rem 0.625rem 1rem', borderTop: '1px solid var(--c100)' }}>
        <Link href="/admin" onClick={onClose} style={{ textDecoration: 'none', display: 'block' }}>
          <motion.div style={{
            display: 'flex', alignItems: 'center', gap: '0.6rem',
            padding: '0.55rem 0.75rem', borderRadius: 10,
            color: 'rgb(148, 148, 148)', fontSize: '0.8rem', cursor: 'pointer',
            background: 'rgba(0,0,0,0)',
          }}
            whileHover={{ background: COLORS.hoverBg, color: COLORS.hoverText }}
            transition={{ duration: 0.12 }}
          >
            <Settings size={13} strokeWidth={1.75} />
            Panel admin
          </motion.div>
        </Link>
      </div>
    </div>
  );
}

export function TopBar() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <header className="topbar">
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', textDecoration: 'none' }}>
          <Image src="/logo.png" alt="Logo" width={28} height={28}
            style={{ borderRadius: '50%', border: '1px solid var(--c100)' }} />
          <span style={{ fontSize: '0.68rem', fontFamily: 'IBM Plex Mono, monospace',
            fontWeight: 500, color: 'var(--c600)', letterSpacing: '0.07em' }}>
            RADIO T1
          </span>
        </Link>
        <button onClick={() => setOpen(true)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--c500)', padding: 6 }}
          aria-label="Abrir menú">
          <Menu size={20} />
        </button>
      </header>

      <AnimatePresence>
        {open && (
          <>
            <motion.div className="drawer-overlay"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setOpen(false)} />
            <motion.div className="drawer"
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 380, damping: 36 }}>
              <NavContent onClose={() => setOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default function SideNav() {
  return (
    <aside className="sidebar">
      <NavContent />
    </aside>
  );
}
