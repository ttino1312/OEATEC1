// pages/admin/programacion.tsx
import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, X, Check } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { type Show, type Presenter, DAYS_MAP } from '../../lib/types';

const DAYS_ALL = ['1','2','3','4','5','6','7'];

const emptyShow = (): Partial<Show> => ({
  title: '', description: '', start_time: '', end_time: '',
  days: [], presenter_ids: [], active: 1,
});

export default function AdminProgramacion() {
  const router = useRouter();
  const [shows, setShows]         = useState<Show[]>([]);
  const [presenters, setPresenters] = useState<Presenter[]>([]);
  const [modal, setModal]         = useState(false);
  const [editing, setEditing]     = useState<Partial<Show>>(emptyShow());
  const [saving, setSaving]       = useState(false);
  const [msg, setMsg]             = useState('');

  useEffect(() => {
    fetch('/api/auth/index.php').then(r => r.json())
      .then(d => { if (!d.authenticated) router.replace('/admin/login'); })
      .catch(() => router.replace('/admin/login'));
    load();
  }, []);

  const load = async () => {
    const [sRes, pRes] = await Promise.all([
      fetch('/api/shows/index.php'), fetch('/api/presenters/index.php'),
    ]);
    if (sRes.ok) setShows(await sRes.json());
    if (pRes.ok) setPresenters(await pRes.json());
  };

  const openNew  = () => { setEditing(emptyShow()); setModal(true); setMsg(''); };
  const openEdit = (s: Show) => { setEditing({ ...s, days: s.days || [], presenter_ids: s.presenter_ids?.map(Number) || [] }); setModal(true); setMsg(''); };

  const toggleDay = (d: string) => {
    const days = editing.days || [];
    setEditing({ ...editing, days: days.includes(d) ? days.filter(x => x !== d) : [...days, d] });
  };

  const togglePresenter = (id: number) => {
    const ids = editing.presenter_ids || [];
    setEditing({ ...editing, presenter_ids: ids.includes(id) ? ids.filter(x => x !== id) : [...ids, id] });
  };

  const save = async () => {
    if (!editing.title || !editing.start_time || !editing.end_time) {
      setMsg('Completá título y horario.'); return;
    }
    setSaving(true);
    const method = editing.id ? 'PUT' : 'POST';
    const url    = editing.id ? `/api/shows/index.php?id=${editing.id}` : '/api/shows/index.php';
    try {
      const res = await fetch(url, {
        method, headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editing),
      });
      const data = await res.json();
      if (!res.ok) { setMsg(data.error || 'Error'); }
      else         { setModal(false); load(); }
    } catch { setMsg('Error de red.'); }
    setSaving(false);
  };

  const del = async (id: number) => {
    if (!confirm('¿Eliminar este programa?')) return;
    await fetch(`/api/shows/index.php?id=${id}`, { method: 'DELETE' });
    load();
  };

  const inputCls = {
    width: '100%', background: '#F8F7F4', border: '1px solid var(--border)',
    borderRadius: '0.75rem', color: 'var(--ink)', fontFamily: 'Plus Jakarta Sans',
    fontSize: '0.875rem', padding: '0.55rem 0.85rem', outline: 'none',
  } as React.CSSProperties;

  return (
    <>
      <Head><title>Programación — Admin</title></Head>
      <AdminLayout>
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-xs tracking-widest uppercase mb-1"
              style={{ color: 'var(--gold)', fontFamily: 'JetBrains Mono, monospace' }}>Admin</p>
            <h1 style={{ fontFamily: 'Cormorant Garant, Georgia, serif', fontSize: '2.5rem', fontWeight: 300, lineHeight: 1 }}>
              Programación
            </h1>
          </div>
          <motion.button onClick={openNew}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-semibold"
            style={{ background: 'var(--ink)', color: 'var(--paper)' }}
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          >
            <Plus size={14} /> Nuevo programa
          </motion.button>
        </div>

        {/* Table */}
        <div className="rounded-3xl overflow-hidden" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
          {shows.length === 0 ? (
            <div className="py-16 text-center">
              <p style={{ fontFamily: 'Cormorant Garant', fontSize: '1.5rem', fontStyle: 'italic', color: 'var(--muted)' }}>
                Sin programas cargados
              </p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  {['Programa','Días','Horario','Presentadores',''].map(h => (
                    <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider"
                      style={{ color: 'var(--muted)', fontFamily: 'JetBrains Mono, monospace' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {shows.map((s, i) => (
                  <motion.tr key={s.id}
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    style={{ borderBottom: '1px solid var(--border)' }}
                    className="group"
                  >
                    <td className="px-5 py-4 font-semibold" style={{ color: 'var(--ink)' }}>{s.title}</td>
                    <td className="px-5 py-4 text-xs" style={{ color: 'var(--muted)' }}>
                      {(s.days || []).map(d => DAYS_MAP[d]?.slice(0,3)).join(', ')}
                    </td>
                    <td className="px-5 py-4 font-mono text-xs" style={{ color: 'var(--muted)' }}>
                      {s.start_time?.slice(0,5)} – {s.end_time?.slice(0,5)}
                    </td>
                    <td className="px-5 py-4 text-xs" style={{ color: 'var(--muted)' }}>
                      {s.presenter_names?.join(', ') || '—'}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                        <motion.button onClick={() => openEdit(s)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center"
                          style={{ background: 'var(--border)', color: 'var(--muted)' }}
                          whileHover={{ background: 'var(--ink)', color: 'var(--paper)' }}
                        >
                          <Pencil size={12} />
                        </motion.button>
                        <motion.button onClick={() => del(s.id)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center"
                          style={{ background: 'rgba(180,40,40,0.08)', color: '#b42828' }}
                          whileHover={{ background: 'rgba(180,40,40,0.2)' }}
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

        {/* Modal */}
        <AnimatePresence>
          {modal && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              style={{ background: 'rgba(17,17,16,0.5)', backdropFilter: 'blur(8px)' }}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={e => { if (e.target === e.currentTarget) setModal(false); }}
            >
              <motion.div
                className="w-full max-w-lg rounded-3xl p-7 overflow-y-auto"
                style={{ background: 'var(--surface)', maxHeight: '90vh' }}
                initial={{ scale: 0.94, y: 20 }} animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.94, y: 20 }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 style={{ fontFamily: 'Cormorant Garant, Georgia, serif', fontSize: '1.75rem', fontWeight: 400 }}>
                    {editing.id ? 'Editar programa' : 'Nuevo programa'}
                  </h2>
                  <button onClick={() => setModal(false)} style={{ color: 'var(--muted)' }}><X size={16} /></button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--muted)' }}>Título *</label>
                    <input style={inputCls} value={editing.title || ''} onChange={e => setEditing({...editing, title: e.target.value})} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--muted)' }}>Hora inicio</label>
                      <input type="time" style={inputCls} value={editing.start_time || ''} onChange={e => setEditing({...editing, start_time: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--muted)' }}>Hora fin</label>
                      <input type="time" style={inputCls} value={editing.end_time || ''} onChange={e => setEditing({...editing, end_time: e.target.value})} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-2" style={{ color: 'var(--muted)' }}>Días</label>
                    <div className="flex flex-wrap gap-2">
                      {DAYS_ALL.map(d => {
                        const on = (editing.days || []).includes(d);
                        return (
                          <motion.button key={d} onClick={() => toggleDay(d)} type="button"
                            className="px-3 py-1.5 rounded-xl text-xs font-semibold"
                            style={{
                              background: on ? 'var(--ink)' : 'var(--paper)',
                              color:      on ? 'var(--paper)' : 'var(--muted)',
                              border:     on ? '1px solid var(--ink)' : '1px solid var(--border)',
                            }}
                            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                          >
                            {DAYS_MAP[d].slice(0,3)}
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>
                  {presenters.length > 0 && (
                    <div>
                      <label className="block text-xs font-semibold mb-2" style={{ color: 'var(--muted)' }}>Presentadores</label>
                      <div className="flex flex-wrap gap-2">
                        {presenters.map(p => {
                          const on = (editing.presenter_ids || []).includes(p.id);
                          return (
                            <motion.button key={p.id} onClick={() => togglePresenter(p.id)} type="button"
                              className="px-3 py-1.5 rounded-xl text-xs font-semibold"
                              style={{
                                background: on ? 'var(--ink)' : 'var(--paper)',
                                color:      on ? 'var(--paper)' : 'var(--muted)',
                                border:     on ? '1px solid var(--ink)' : '1px solid var(--border)',
                              }}
                              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                            >
                              {on && <Check size={10} className="inline mr-1" />}{p.name}
                            </motion.button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  <div>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--muted)' }}>Descripción</label>
                    <textarea style={{ ...inputCls, minHeight: 72, resize: 'vertical' }}
                      value={editing.description || ''} onChange={e => setEditing({...editing, description: e.target.value})} />
                  </div>
                </div>

                {msg && <p className="text-xs mt-4" style={{ color: '#b42828' }}>{msg}</p>}

                <div className="flex justify-end gap-2 mt-6">
                  <motion.button onClick={() => setModal(false)}
                    className="px-4 py-2.5 rounded-2xl text-sm font-semibold"
                    style={{ background: 'var(--border)', color: 'var(--muted)' }}
                    whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  >
                    Cancelar
                  </motion.button>
                  <motion.button onClick={save} disabled={saving}
                    className="px-5 py-2.5 rounded-2xl text-sm font-semibold"
                    style={{ background: 'var(--ink)', color: 'var(--paper)', opacity: saving ? 0.6 : 1 }}
                    whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  >
                    {saving ? 'Guardando…' : 'Guardar'}
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
