// components/admin/AdminLayout.tsx
import { ReactNode, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Radio, CalendarDays, Mic2, AudioLines, Settings, LogOut, ExternalLink } from 'lucide-react';

const ADMIN_NAV = [
  { href: '/admin',             icon: Radio,        label: 'En vivo' },
  { href: '/admin/programacion',icon: CalendarDays, label: 'Programación' },
  { href: '/admin/presentadores',icon: Mic2,        label: 'Presentadores' },
  { href: '/admin/grabaciones', icon: AudioLines,   label: 'Grabaciones' },
  { href: '/admin/configuracion',icon: Settings,    label: 'Configuración' },
];

interface Props { children: ReactNode; title?: string; }

export default function AdminLayout({ children, title = 'Admin' }: Props) {
  const router = useRouter();

  const logout = async () => {
    await fetch('/api/auth/index.php', { method: 'DELETE' });
    router.push('/admin/login');
  };

  return (
    <div className="flex min-h-screen" style={{ background: '#F0EFEb', fontFamily: 'Plus Jakarta Sans, system-ui' }}>

      {/* Sidebar */}
      <aside className="w-56 flex-shrink-0 flex flex-col"
        style={{
          background: 'var(--ink)', color: 'var(--paper)',
          position: 'sticky', top: 0, height: '100vh', overflowY: 'auto',
        }}>

        {/* Logo */}
        <div className="px-5 pt-6 pb-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="Logo" width={30} height={30}
              className="rounded-full" style={{ filter: 'invert(1) brightness(0.85)' }} />
            <div>
              <p className="text-xs font-semibold leading-none" style={{ color: 'var(--paper)' }}>
                Radio T1
              </p>
              <p className="text-xs mt-0.5" style={{ color: 'rgba(248,247,244,0.4)', fontSize: '0.65rem' }}>
                Panel Admin
              </p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-3">
          <p className="px-2 mb-2 text-xs font-semibold uppercase tracking-widest"
            style={{ color: 'rgba(248,247,244,0.3)', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.6rem' }}>
            Gestión
          </p>
          {ADMIN_NAV.map(item => {
            const Icon = item.icon;
            const active = router.pathname === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <motion.div
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-2xl mb-0.5 text-sm font-medium cursor-pointer"
                  style={{
                    background: active ? 'rgba(255,255,255,0.1)' : 'transparent',
                    color:      active ? 'var(--paper)'           : 'rgba(248,247,244,0.5)',
                  }}
                  whileHover={{ background: 'rgba(255,255,255,0.07)', color: 'var(--paper)' }}
                >
                  <Icon size={14} strokeWidth={active ? 2 : 1.75} />
                  {item.label}
                  {active && (
                    <motion.div layoutId="admin-active-dot"
                      className="ml-auto w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ background: 'var(--gold)' }}
                    />
                  )}
                </motion.div>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-3 pb-5" style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: '1rem' }}>
          <a href="/" target="_blank">
            <motion.div
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs mb-1 cursor-pointer"
              style={{ color: 'rgba(248,247,244,0.4)' }}
              whileHover={{ color: 'var(--paper)' }}
            >
              <ExternalLink size={12} /> Ver sitio
            </motion.div>
          </a>
          <motion.button onClick={logout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs cursor-pointer"
            style={{ color: 'rgba(248,247,244,0.4)' }}
            whileHover={{ color: '#ff8080' }}
          >
            <LogOut size={12} /> Cerrar sesión
          </motion.button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto">
        <div className="px-8 py-8 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
