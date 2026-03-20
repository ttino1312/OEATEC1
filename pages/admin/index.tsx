// pages/admin/index.tsx — Live dashboard
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { Radio, Users, Music2, AlertCircle, RefreshCw } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { useRadioMetadata } from '../../hooks/useRadioMetadata';

export default function AdminDashboard() {
  const router  = useRouter();
  const meta    = useRadioMetadata(8000);
  const [status, setStatus]   = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/auth/index.php').then(r => r.json())
      .then(d => { if (!d.authenticated) router.replace('/admin/login'); })
      .catch(() => router.replace('/admin/login'));
  }, []);

  const fetchStatus = async () => {
    setLoading(true);
    try {
      const r = await fetch('/api/radio/status.php');
      if (r.ok) setStatus(await r.json());
    } catch {}
    setLoading(false);
  };

  useEffect(() => { fetchStatus(); }, []);

  const CARDS = [
    {
      label: 'Estado',
      value: meta.live ? 'EN VIVO' : 'OFFLINE',
      icon: Radio,
      accent: meta.live,
    },
    {
      label: 'Oyentes ahora',
      value: String(meta.listeners ?? '–'),
      icon: Users,
      accent: false,
    },
    {
      label: 'Programa actual',
      value: meta.show || '—',
      icon: Music2,
      accent: false,
      small: true,
    },
  ];

  return (
    <>
      <Head><title>Dashboard — Admin</title></Head>
      <AdminLayout title="En vivo">

        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-xs tracking-widest uppercase mb-1"
              style={{ color: 'var(--gold)', fontFamily: 'JetBrains Mono, monospace' }}>
              Radio Técnica Uno
            </p>
            <h1 style={{ fontFamily: 'Cormorant Garant, Georgia, serif',
              fontSize: '2.5rem', fontWeight: 300, color: 'var(--ink)', lineHeight: 1 }}>
              En vivo
            </h1>
          </div>
          <motion.button onClick={fetchStatus}
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--muted)' }}
            whileHover={{ color: 'var(--ink)' }} whileTap={{ rotate: 180 }}
            transition={{ duration: 0.3 }}
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </motion.button>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {CARDS.map(card => {
            const Icon = card.icon;
            return (
              <div key={card.label}
                className="p-6 rounded-3xl"
                style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                <div className="flex items-start justify-between mb-4">
                  <p className="text-xs font-semibold uppercase tracking-wider"
                    style={{ color: 'var(--muted)', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.65rem' }}>
                    {card.label}
                  </p>
                  <div className="w-7 h-7 rounded-xl flex items-center justify-center"
                    style={{ background: card.accent ? 'var(--ink)' : 'var(--border)' }}>
                    <Icon size={13} color={card.accent ? 'var(--paper)' : 'var(--muted)'} />
                  </div>
                </div>
                <p className={card.small ? 'text-lg' : ''}
                  style={{
                    fontFamily: 'Cormorant Garant, Georgia, serif',
                    fontSize: card.small ? '1.25rem' : '2.5rem',
                    fontWeight: 400, color: card.accent ? 'var(--gold)' : 'var(--ink)',
                    lineHeight: 1,
                  }}>
                  {card.value}
                </p>
              </div>
            );
          })}
        </div>

        {/* Metadata box */}
        <div className="p-6 rounded-3xl mb-6"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
          <p className="text-xs font-semibold uppercase tracking-widest mb-4"
            style={{ color: 'var(--muted)', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.65rem' }}>
            Metadata actual
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 text-sm">
            {[
              { k: 'Título', v: meta.title },
              { k: 'Artista', v: meta.artist || '—' },
              { k: 'Programa', v: meta.show || '—' },
              { k: 'Presentador', v: (meta as any).presenter || '—' },
              { k: 'Oyentes', v: String(meta.listeners) },
              { k: 'Estado', v: meta.live ? 'En vivo' : 'Offline' },
            ].map(({ k, v }) => (
              <div key={k}>
                <p className="text-xs mb-1" style={{ color: 'var(--muted)' }}>{k}</p>
                <p className="font-semibold" style={{ color: 'var(--ink)' }}>{v}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Stream URL notice */}
        {!status?.streamUrl && (
          <div className="flex items-start gap-3 p-4 rounded-2xl text-sm"
            style={{ background: 'rgba(201,160,64,0.08)', border: '1px solid rgba(201,160,64,0.3)' }}>
            <AlertCircle size={15} style={{ color: 'var(--gold)', flexShrink: 0, marginTop: 1 }} />
            <div>
              <p className="font-semibold" style={{ color: 'var(--ink)' }}>Stream no configurado</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
                Configurá la URL del stream en{' '}
                <a href="/admin/configuracion" style={{ color: 'var(--gold)' }}>
                  Configuración
                </a>{' '}para activar la radio.
              </p>
            </div>
          </div>
        )}
      </AdminLayout>
    </>
  );
}
