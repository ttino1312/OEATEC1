import { ReactNode, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  Radio, LayoutDashboard, Calendar, Mic2, FileAudio,
  Settings, LogOut, Menu, X
} from 'lucide-react';

const NAV = [
  { href: '/admin',                label: 'Dashboard',      icon: LayoutDashboard },
  { href: '/admin/programacion',   label: 'Programación',   icon: Calendar },
  { href: '/admin/presentadores',  label: 'Presentadores',  icon: Mic2 },
  { href: '/admin/grabaciones',    label: 'Grabaciones',    icon: FileAudio },
  { href: '/admin/configuracion',  label: 'Configuración',  icon: Settings },
];

function SidebarContent({ onLinkClick }: { onLinkClick?: () => void }) {
  const router = useRouter();

  const logout = async () => {
    await fetch('/api/auth/index.php', { method: 'DELETE' }).catch(() => {});
    router.push('/admin/login');
  };

  return (
    <div className="flex flex-col h-full py-6 px-3">
      {/* Logo */}
      <div className="px-3 mb-8 flex items-center gap-2.5">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: 'var(--c600)' }}
        >
          <Radio size={14} color="#fff" strokeWidth={2} />
        </div>
        <div>
          <div className="text-xs font-bold" style={{ color: 'var(--ink)' }}>RADIO T1</div>
          <div className="text-[10px]" style={{ color: 'var(--muted)' }}>Panel Admin</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-0.5 flex-1">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = router.pathname === href;
          return (
            <Link
              key={href}
              href={href}
              onClick={onLinkClick}
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
              style={{
                background: active ? 'var(--c600)' : 'transparent',
                color: active ? '#fff' : 'var(--c400)',
              }}
            >
              <Icon size={17} strokeWidth={active ? 2.2 : 1.8} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="pt-4 border-t" style={{ borderColor: 'var(--c100)' }}>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all duration-200"
          style={{ color: 'var(--c400)' }}
        >
          <LogOut size={17} strokeWidth={1.8} />
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="layout-wrapper">
      {/* Desktop sidebar */}
      <aside className="sidebar">
        <SidebarContent />
      </aside>

      {/* Mobile topbar */}
      <header className="topbar lg:hidden">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: 'var(--c600)' }}>
            <Radio size={13} color="#fff" />
          </div>
          <span className="text-xs font-bold" style={{ color: 'var(--ink)' }}>Admin</span>
        </div>
        <button onClick={() => setOpen(true)} className="p-1.5" style={{ color: 'var(--c500)' }}>
          <Menu size={20} />
        </button>
      </header>

      {/* Mobile drawer */}
      {open && (
        <>
          <div className="drawer-overlay lg:hidden" onClick={() => setOpen(false)} />
          <div className="drawer lg:hidden">
            <div className="flex justify-end p-3">
              <button onClick={() => setOpen(false)} style={{ color: 'var(--c400)' }}>
                <X size={18} />
              </button>
            </div>
            <SidebarContent onLinkClick={() => setOpen(false)} />
          </div>
        </>
      )}

      <main className="main-content">
        {children}
      </main>
    </div>
  );
}
