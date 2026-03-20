// pages/admin/grabaciones.tsx
import Head from 'next/head';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Trash2, Eye, EyeOff, Download, X } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { formatDuration, formatDate, type Recording, type Show } from '../../lib/types';

export default function AdminGrabaciones() {
  const router  = useRouter();
  const [eps, setEps]       = useState<Recording[]>([]);
  const [shows, setShows]   = useState<Show[]>([]);
  const [modal, setModal]   = useState(false);
  const [progress, setProg] = useState(0);
  const [uploading, setUp]  = useState(false);
  const [msg, setMsg]       = useState('');
  const fileRef = useRef<HTMLInputElement>(null);
  const formRef = useRef({ title:'', show_id:'', description:'', published:'0', recorded_at:'' });

  useEffect(() => {
    fetch('/api/auth/index.php').then(r=>r.json())
      .then(d=>{ if(!d.authenticated) router.replace('/admin/login'); })
      .catch(()=>router.replace('/admin/login'));
    load();
  }, []);

  const load = async () => {
    const [eRes, sRes] = await Promise.all([
      fetch('/api/recordings/index.php'), fetch('/api/shows/index.php'),
    ]);
    if (eRes.ok) setEps(await eRes.json());
    if (sRes.ok) setShows(await sRes.json());
  };

  const upload = () => {
    const file = fileRef.current?.files?.[0];
    if (!file) { setMsg('Seleccioná un archivo.'); return; }
    if (!formRef.current.title) { setMsg('El título es requerido.'); return; }
    const fd = new FormData();
    fd.append('file',        file);
    fd.append('title',       formRef.current.title);
    fd.append('show_id',     formRef.current.show_id);
    fd.append('description', formRef.current.description);
    fd.append('published',   formRef.current.published);
    fd.append('recorded_at', formRef.current.recorded_at || new Date().toISOString().slice(0,19));
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/recordings/index.php');
    setUp(true); setMsg(''); setProg(0);
    xhr.upload.onprogress = e => { if (e.lengthComputable) setProg(Math.round(e.loaded/e.total*100)); };
    xhr.onload = () => {
      setUp(false);
      const data = JSON.parse(xhr.responseText);
      if (xhr.status < 300) { setModal(false); load(); }
      else setMsg(data.error || 'Error al subir.');
    };
    xhr.onerror = () => { setUp(false); setMsg('Error de red.'); };
    xhr.send(fd);
  };

  const togglePublish = async (ep: Recording) => {
    await fetch(`/api/recordings/index.php?id=${ep.id}`, {
      method:'PUT', headers:{'Content-Type':'application/json'},
      body:JSON.stringify({ published: ep.published ? 0 : 1 }),
    });
    load();
  };

  const del = async (id: number) => {
    if (!confirm('¿Eliminar esta grabación?')) return;
    await fetch(`/api/recordings/index.php?id=${id}`, { method:'DELETE' });
    load();
  };

  const inputCls = {
    width:'100%', background:'#F8F7F4', border:'1px solid var(--border)',
    borderRadius:'0.75rem', color:'var(--ink)', fontFamily:'Plus Jakarta Sans',
    fontSize:'0.875rem', padding:'0.55rem 0.85rem', outline:'none',
  } as React.CSSProperties;

  return (
    <>
      <Head><title>Grabaciones — Admin</title></Head>
      <AdminLayout>
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-xs tracking-widest uppercase mb-1" style={{ color:'var(--gold)', fontFamily:'JetBrains Mono, monospace' }}>Admin</p>
            <h1 style={{ fontFamily:'Cormorant Garant, Georgia, serif', fontSize:'2.5rem', fontWeight:300, lineHeight:1 }}>Grabaciones</h1>
          </div>
          <motion.button onClick={() => { setModal(true); setMsg(''); setProg(0); }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-semibold"
            style={{ background:'var(--ink)', color:'var(--paper)' }}
            whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }}
          >
            <Upload size={14} /> Subir episodio
          </motion.button>
        </div>

        <div className="rounded-3xl overflow-hidden" style={{ background:'var(--surface)', border:'1px solid var(--border)' }}>
          {eps.length === 0 ? (
            <div className="py-16 text-center">
              <p style={{ fontFamily:'Cormorant Garant', fontSize:'1.5rem', fontStyle:'italic', color:'var(--muted)' }}>
                Sin grabaciones todavía
              </p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom:'1px solid var(--border)' }}>
                  {['Título','Programa','Fecha','Duración','Estado',''].map(h => (
                    <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider"
                      style={{ color:'var(--muted)', fontFamily:'JetBrains Mono, monospace' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {eps.map((ep, i) => (
                  <motion.tr key={ep.id}
                    initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.04 }}
                    style={{ borderBottom:'1px solid var(--border)' }} className="group"
                  >
                    <td className="px-5 py-4 font-semibold max-w-xs" style={{ color:'var(--ink)' }}>
                      <p className="truncate">{ep.title}</p>
                      {ep.description && <p className="text-xs truncate mt-0.5" style={{ color:'var(--muted)' }}>{ep.description}</p>}
                    </td>
                    <td className="px-5 py-4 text-xs" style={{ color:'var(--muted)' }}>{ep.show_title || '—'}</td>
                    <td className="px-5 py-4 text-xs" style={{ color:'var(--muted)' }}>{formatDate(ep.recorded_at)}</td>
                    <td className="px-5 py-4 text-xs font-mono" style={{ color:'var(--muted)' }}>
                      {ep.duration_sec > 0 ? formatDuration(ep.duration_sec) : '—'}
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
                        style={{
                          background: ep.published ? 'rgba(0,180,80,0.1)' : 'rgba(180,140,0,0.1)',
                          color:      ep.published ? '#00a850' : '#a89000',
                        }}>
                        {ep.published ? 'Publicado' : 'Borrador'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                        <motion.button onClick={() => togglePublish(ep)} title={ep.published ? 'Despublicar' : 'Publicar'}
                          className="w-7 h-7 rounded-lg flex items-center justify-center"
                          style={{ background:'var(--border)', color:'var(--muted)' }}
                          whileHover={{ background:'var(--ink)', color:'var(--paper)' }}
                        >
                          {ep.published ? <EyeOff size={12} /> : <Eye size={12} />}
                        </motion.button>
                        <a href={ep.file_url} download>
                          <motion.div className="w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer"
                            style={{ background:'var(--border)', color:'var(--muted)' }}
                            whileHover={{ background:'var(--ink)', color:'var(--paper)' }}
                          >
                            <Download size={12} />
                          </motion.div>
                        </a>
                        <motion.button onClick={() => del(ep.id)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center"
                          style={{ background:'rgba(180,40,40,0.08)', color:'#b42828' }}
                          whileHover={{ background:'rgba(180,40,40,0.2)' }}
                        >
                          <Trash2 size={12} />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Upload modal */}
        <AnimatePresence>
          {modal && (
            <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4"
              style={{ background:'rgba(17,17,16,0.5)', backdropFilter:'blur(8px)' }}
              initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
              onClick={e => { if(e.target===e.currentTarget && !uploading) setModal(false); }}
            >
              <motion.div className="w-full max-w-md rounded-3xl p-7"
                style={{ background:'var(--surface)' }}
                initial={{ scale:0.94, y:20 }} animate={{ scale:1, y:0 }}
                exit={{ scale:0.94, y:20 }}
                transition={{ type:'spring', stiffness:400, damping:30 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 style={{ fontFamily:'Cormorant Garant, Georgia, serif', fontSize:'1.75rem', fontWeight:400 }}>
                    Subir episodio
                  </h2>
                  {!uploading && <button onClick={() => setModal(false)} style={{ color:'var(--muted)' }}><X size={16} /></button>}
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color:'var(--muted)' }}>Título *</label>
                    <input type="text" style={inputCls} onChange={e => formRef.current.title = e.target.value} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color:'var(--muted)' }}>Programa</label>
                    <select style={inputCls} onChange={e => formRef.current.show_id = e.target.value}>
                      <option value="">Sin programa</option>
                      {shows.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color:'var(--muted)' }}>Descripción</label>
                    <textarea style={{ ...inputCls, minHeight:60, resize:'vertical' }}
                      onChange={e => formRef.current.description = e.target.value} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold mb-1.5" style={{ color:'var(--muted)' }}>Fecha</label>
                      <input type="datetime-local" style={inputCls} onChange={e => formRef.current.recorded_at = e.target.value} />
                    </div>
                    <div className="flex items-end gap-2">
                      <div>
                        <label className="block text-xs font-semibold mb-1.5" style={{ color:'var(--muted)' }}>Publicar</label>
                        <input type="checkbox" style={{ width:18, height:18, accentColor:'var(--ink)', cursor:'pointer' }}
                          onChange={e => formRef.current.published = e.target.checked ? '1' : '0'} />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color:'var(--muted)' }}>
                      Archivo de audio (MP3, máx 200 MB)
                    </label>
                    <input type="file" ref={fileRef} accept="audio/*"
                      className="w-full text-xs" style={{ color:'var(--muted)', fontFamily:'Plus Jakarta Sans' }} />
                  </div>

                  {uploading && (
                    <div>
                      <div className="h-1.5 rounded-full overflow-hidden" style={{ background:'var(--border)' }}>
                        <motion.div className="h-full rounded-full" style={{ background:'var(--ink)' }}
                          animate={{ width:`${progress}%` }} transition={{ duration:0.3 }} />
                      </div>
                      <p className="text-xs mt-1.5 text-center" style={{ color:'var(--muted)', fontFamily:'JetBrains Mono, monospace' }}>
                        {progress}%
                      </p>
                    </div>
                  )}
                </div>
                {msg && <p className="text-xs mt-3" style={{ color:'#b42828' }}>{msg}</p>}
                <div className="flex justify-end gap-2 mt-6">
                  <motion.button onClick={() => setModal(false)} disabled={uploading}
                    className="px-4 py-2.5 rounded-2xl text-sm font-semibold"
                    style={{ background:'var(--border)', color:'var(--muted)', opacity:uploading?0.4:1 }}
                    whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }}
                  >Cancelar</motion.button>
                  <motion.button onClick={upload} disabled={uploading}
                    className="px-5 py-2.5 rounded-2xl text-sm font-semibold flex items-center gap-2"
                    style={{ background:'var(--ink)', color:'var(--paper)', opacity:uploading?0.6:1 }}
                    whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }}
                  >
                    <Upload size={13} />
                    {uploading ? 'Subiendo…' : 'Subir'}
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </AdminLayout>
    </>
  );
}
