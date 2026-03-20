// src/components/Layout.tsx
import { ReactNode, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home, Radio, Calendar, Headphones, Building2, MapPin, Menu, X, Shield
} from 'lucide-react';

const NAV_LINKS = [
  { href: '/',              label: 'Inicio',        icon: Home },
  { href: '/programacion',  label: 'Programación',  icon: Calendar },
  { href: '/podcast',       label: 'Podcast',       icon: Headphones },
  { href: '/institucional', label: 'Institución',   icon: Building2 },
  { href: '/contacto',      label: 'Contacto',      icon: MapPin },
];

function NavLink({ href, label, icon: Icon, active, onClick }: {
  href: string; label: string; icon: any; active: boolean; onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
      style={{
        background: active ? 'var(--c600)' : 'transparent',
        color: active ? '#fff' : 'var(--c400)',
      }}
    >
      <Icon size={17} strokeWidth={active ? 2.2 : 1.8} />
      <span>{label}</span>
    </Link>
  );
}

function SidebarContent({ onLinkClick }: { onLinkClick?: () => void }) {
  const router = useRouter();
  return (
    <div className="flex flex-col h-full py-6 px-3">
      {/* Logo */}
      <div className="px-3 mb-8">
        <Link href="/" onClick={onLinkClick} className="flex items-center gap-2.5 group">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: 'var(--c600)' }}
          >
            <Radio size={14} color="#fff" strokeWidth={2} />
          </div>
          <div>
            <div className="text-xs font-bold leading-tight" style={{ color: 'var(--ink)' }}>
              RADIO T1
            </div>
            <div className="text-[10px] leading-tight" style={{ color: 'var(--muted)' }}>
              EEST N°1 &quot;OEA&quot;
            </div>
          </div>
        </Link>
      </div>

      {/* Nav label */}
      <p className="px-4 mb-2 text-[10px] font-semibold uppercase tracking-widest" style={{ color: 'var(--c300)' }}>
        Navegación
      </p>

      {/* Links */}
      <nav className="flex flex-col gap-0.5">
        {NAV_LINKS.map(({ href, label, icon }) => (
          <NavLink
            key={href}
            href={href}
            label={label}
            icon={icon}
            active={router.pathname === href}
            onClick={onLinkClick}
          />
        ))}
      </nav>

      {/* Bottom */}
      <div className="mt-auto flex flex-col gap-0.5 pt-4 border-t" style={{ borderColor: 'var(--c100)' }}>
        <NavLink
          href="/admin"
          label="Panel admin"
          icon={Shield}
          active={router.pathname.startsWith('/admin')}
          onClick={onLinkClick}
        />
      </div>
    </div>
  );
}

interface LayoutProps {
  children: ReactNode;
  bottomPlayer?: ReactNode;
}

export default function Layout({ children, bottomPlayer }: LayoutProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const router = useRouter();

  return (
    <div className="layout-wrapper">
      {/* Desktop sidebar */}
      <aside className="sidebar">
        <SidebarContent />
      </aside>

      {/* Mobile topbar */}
      <header className="topbar lg:hidden">
        <Link href="/" className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center"
            style={{ background: 'var(--c600)' }}
          >
            <Radio size={13} color="#fff" strokeWidth={2} />
          </div>
          <span className="text-xs font-bold" style={{ color: 'var(--ink)' }}>RADIO T1</span>
        </Link>
        <button
          onClick={() => setDrawerOpen(true)}
          className="p-1.5 rounded-lg"
          style={{ color: 'var(--c500)' }}
          aria-label="Abrir menú"
        >
          <Menu size={20} />
        </button>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              className="drawer-overlay lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)}
            />
            <motion.div
              className="drawer lg:hidden"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <div className="flex justify-end p-3">
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="p-1.5 rounded-lg"
                  style={{ color: 'var(--c400)' }}
                  aria-label="Cerrar menú"
                >
                  <X size={18} />
                </button>
              </div>
              <SidebarContent onLinkClick={() => setDrawerOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Page content */}
      <main className="main-content">
        <AnimatePresence mode="wait">
          <motion.div
            key={router.pathname}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom player slot */}
      {bottomPlayer && (
        <div className="player-bar">
          {bottomPlayer}
        </div>
      )}
    </div>
  );
}
