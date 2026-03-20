// pages/admin/configuracion.tsx
import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, CheckCircle2, AlertCircle } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';

export default function AdminConfiguracion() {
  const router = useRouter();
  const [streamUrl,  setStreamUrl]  = useState('');
  const [streamType, setStreamType] = useState('shoutcast');
  const [metaUrl,    setMetaUrl]    = useState('');
  const [saved, setSaved]   = useState(false);
  const [error, setError]   = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/auth/index.php').then(r=>r.json())
      .then(d=>{ if(!d.authenticated) router.replace('/admin/login'); })
      .catch(()=>router.replace('/admin/login'));
  }, []);

  const save = async () => {
    setSaving(true); setSaved(false); setError('');
    try {
      const res = await fetch('/api/radio/settings.php', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ stream_url:streamUrl, stream_type:streamType, meta_url:metaUrl }),
      });
      const data = await res.json();
      if (res.ok) setSaved(true);
      else setError(data.error || 'Error al guardar.');
    } catch { setError('Error de red.'); }
    setSaving(false);
    if (saved) setTimeout(()=>setSaved(false), 3000);
  };

  const inputCls = {
    width:'100%', background:'#F8F7F4', border:'1px solid var(--border)',
    borderRadius:'0.75rem', color:'var(--ink)', fontFamily:'Plus Jakarta Sans',
    fontSize:'0.875rem', padding:'0.6rem 0.9rem', outline:'none',
  } as React.CSSProperties;

  return (
    <>
      <Head><title>Configuración — Admin</title></Head>
      <AdminLayout>
        <div className="mb-8">
          <p className="text-xs tracking-widest uppercase mb-1" style={{ color:'var(--gold)', fontFamily:'JetBrains Mono, monospace' }}>Admin</p>
          <h1 style={{ fontFamily:'Cormorant Garant, Georgia, serif', fontSize:'2.5rem', fontWeight:300, lineHeight:1 }}>
            Configuración
          </h1>
        </div>

        <div className="max-w-lg">
          <div className="p-7 rounded-3xl" style={{ background:'var(--surface)', border:'1px solid var(--border)' }}>
            <h2 className="font-semibold mb-6" style={{ color:'var(--ink)' }}>Stream de radio</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color:'var(--muted)' }}>
                  URL del stream *
                </label>
                <input type="url" style={inputCls} value={streamUrl}
                  onChange={e=>setStreamUrl(e.target.value)}
                  placeholder="https://radios.solumedia.com:6740/stream" />
                <p className="text-xs mt-1" style={{ color:'var(--muted)' }}>
                  Proporcionado por solumedia.com al activar el servicio.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color:'var(--muted)' }}>
                  Tipo de servidor
                </label>
                <select style={inputCls} value={streamType} onChange={e=>setStreamType(e.target.value)}>
                  <option value="shoutcast">Shoutcast (recomendado)</option>
                  <option value="icecast">Icecast</option>
                  <option value="http">HTTP genérico</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color:'var(--muted)' }}>
                  URL de metadata / stats
                </label>
                <input type="url" style={inputCls} value={metaUrl}
                  onChange={e=>setMetaUrl(e.target.value)}
                  placeholder="https://radios.solumedia.com:6740/stats" />
                <p className="text-xs mt-1" style={{ color:'var(--muted)' }}>
                  Endpoint del que se lee el título, artista y oyentes en tiempo real.
                </p>
              </div>
            </div>

            <AnimatePresence>
              {saved && (
                <motion.div className="flex items-center gap-2 mt-4 text-sm"
                  style={{ color:'#00a850' }}
                  initial={{ opacity:0, y:-8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
                >
                  <CheckCircle2 size={14} /> Configuración guardada
                </motion.div>
              )}
              {error && (
                <motion.div className="flex items-center gap-2 mt-4 text-sm"
                  style={{ color:'#b42828' }}
                  initial={{ opacity:0, y:-8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
                >
                  <AlertCircle size={14} /> {error}
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button onClick={save} disabled={saving}
              className="mt-6 flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-semibold"
              style={{ background:'var(--ink)', color:'var(--paper)', opacity:saving?0.6:1 }}
              whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }}
            >
              <Save size={13} />
              {saving ? 'Guardando…' : 'Guardar configuración'}
            </motion.button>
          </div>

          {/* .env info */}
          <div className="p-5 rounded-3xl mt-4"
            style={{ background:'rgba(201,160,64,0.07)', border:'1px solid rgba(201,160,64,0.2)' }}>
            <p className="text-xs font-semibold mb-2" style={{ color:'var(--gold)' }}>
              Alternativa: variables de entorno
            </p>
            <p className="text-xs leading-relaxed" style={{ color:'var(--muted)' }}>
              También podés configurar el stream directamente en el archivo{' '}
              <code className="px-1 py-0.5 rounded" style={{ background:'var(--border)', fontFamily:'JetBrains Mono, monospace' }}>.env</code>{' '}
              del backend PHP con las variables{' '}
              <code style={{ fontFamily:'JetBrains Mono, monospace' }}>RADIO_STREAM_URL</code> y{' '}
              <code style={{ fontFamily:'JetBrains Mono, monospace' }}>RADIO_METADATA_URL</code>.
            </p>
          </div>
        </div>
      </AdminLayout>
    </>
  );
}
