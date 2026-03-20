// pages/admin/presentadores.tsx
import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, UserMinus, X } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { type Presenter } from '../../lib/types';

const empty = (): Partial<Presenter> => ({ name:'', email:'', phone:'', bio:'', photo_url:'' });

const inputCls = {
  width:'100%', background:'#F8F7F4', border:'1px solid var(--border)',
  borderRadius:'0.75rem', color:'var(--ink)', fontFamily:'Plus Jakarta Sans',
  fontSize:'0.875rem', padding:'0.55rem 0.85rem', outline:'none',
} as React.CSSProperties;

export default function AdminPresentadores() {
  const router = useRouter();
  const [list, setList]     = useState<Presenter[]>([]);
  const [modal, setModal]   = useState(false);
  const [editing, setEditing] = useState<Partial<Presenter>>(empty());
  const [saving, setSaving] = useState(false);
  const [msg, setMsg]       = useState('');

  useEffect(() => {
    fetch('/api/auth/index.php').then(r=>r.json())
      .then(d=>{ if(!d.authenticated) router.replace('/admin/login'); })
      .catch(()=>router.replace('/admin/login'));
    load();
  }, []);

  const load = async () => {
    const r = await fetch('/api/presenters/index.php');
    if (r.ok) setList(await r.json());
  };

  const save = async () => {
    if (!editing.name) { setMsg('El nombre es requerido.'); return; }
    setSaving(true);
    const method = editing.id ? 'PUT' : 'POST';
    const url    = editing.id ? `/api/presenters/index.php?id=${editing.id}` : '/api/presenters/index.php';
    try {
      const res  = await fetch(url, { method, headers:{'Content-Type':'application/json'}, body:JSON.stringify(editing) });
      const data = await res.json();
      if (!res.ok) setMsg(data.error || 'Error');
      else { setModal(false); load(); }
    } catch { setMsg('Error de red.'); }
    setSaving(false);
  };

  const deactivate = async (id: number) => {
    if (!confirm('¿Desactivar este presentador?')) return;
    await fetch(`/api/presenters/index.php?id=${id}`, { method:'DELETE' });
    load();
  };

  return (
    <>
      <Head><title>Presentadores — Admin</title></Head>
      <AdminLayout>
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-xs tracking-widest uppercase mb-1" style={{ color:'var(--gold)', fontFamily:'JetBrains Mono, monospace' }}>Admin</p>
            <h1 style={{ fontFamily:'Cormorant Garant, Georgia, serif', fontSize:'2.5rem', fontWeight:300, lineHeight:1 }}>
              Presentadores
            </h1>
          </div>
          <motion.button onClick={() => { setEditing(empty()); setModal(true); setMsg(''); }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-semibold"
            style={{ background:'var(--ink)', color:'var(--paper)' }}
            whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }}
          >
            <Plus size={14} /> Nuevo presentador
          </motion.button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {list.length === 0 ? (
            <div className="col-span-3 py-16 text-center">
              <p style={{ fontFamily:'Cormorant Garant', fontSize:'1.5rem', fontStyle:'italic', color:'var(--muted)' }}>
                Sin presentadores cargados
              </p>
            </div>
          ) : list.map((p, i) => (
            <motion.div key={p.id}
              initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.05 }}
              className="p-5 rounded-3xl group relative"
              style={{ background:'var(--surface)', border:'1px solid var(--border)' }}
            >
              <div className="w-10 h-10 rounded-full mb-3 flex items-center justify-center text-sm font-bold"
                style={{ background:'var(--border)', color:'var(--muted)' }}>
                {p.name.charAt(0).toUpperCase()}
              </div>
              <p className="font-semibold text-sm" style={{ color:'var(--ink)' }}>{p.name}</p>
              {p.email && <p className="text-xs mt-0.5" style={{ color:'var(--muted)' }}>{p.email}</p>}
              {p.bio && <p className="text-xs mt-2 leading-relaxed line-clamp-2" style={{ color:'var(--muted)' }}>{p.bio}</p>}
              <div className="flex gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <motion.button onClick={() => { setEditing({...p}); setModal(true); setMsg(''); }}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1"
                  style={{ background:'var(--border)', color:'var(--muted)' }}
                  whileHover={{ background:'var(--ink)', color:'var(--paper)' }}
                >
                  <Pencil size={10} /> Editar
                </motion.button>
                <motion.button onClick={() => deactivate(p.id)}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1"
                  style={{ background:'rgba(180,40,40,0.08)', color:'#b42828' }}
                  whileHover={{ background:'rgba(180,40,40,0.18)' }}
                >
                  <UserMinus size={10} /> Desactivar
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        <AnimatePresence>
          {modal && (
            <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4"
              style={{ background:'rgba(17,17,16,0.5)', backdropFilter:'blur(8px)' }}
              initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
              onClick={e => { if(e.target===e.currentTarget) setModal(false); }}
            >
              <motion.div className="w-full max-w-md rounded-3xl p-7"
                style={{ background:'var(--surface)' }}
                initial={{ scale:0.94, y:20 }} animate={{ scale:1, y:0 }}
                exit={{ scale:0.94, y:20 }}
                transition={{ type:'spring', stiffness:400, damping:30 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 style={{ fontFamily:'Cormorant Garant, Georgia, serif', fontSize:'1.75rem', fontWeight:400 }}>
                    {editing.id ? 'Editar' : 'Nuevo presentador'}
                  </h2>
                  <button onClick={() => setModal(false)} style={{ color:'var(--muted)' }}><X size={16} /></button>
                </div>
                <div className="space-y-4">
                  {[
                    { k:'name',      label:'Nombre *',    type:'text'  },
                    { k:'email',     label:'Email',       type:'email' },
                    { k:'phone',     label:'Teléfono',    type:'tel'   },
                    { k:'photo_url', label:'URL de foto', type:'url'   },
                  ].map(f => (
                    <div key={f.k}>
                      <label className="block text-xs font-semibold mb-1.5" style={{ color:'var(--muted)' }}>{f.label}</label>
                      <input type={f.type} style={inputCls}
                        value={(editing as any)[f.k] || ''}
                        onChange={e => setEditing({...editing, [f.k]: e.target.value})} />
                    </div>
                  ))}
                  <div>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color:'var(--muted)' }}>Bio</label>
                    <textarea style={{ ...inputCls, minHeight:72, resize:'vertical' }}
                      value={editing.bio || ''}
                      onChange={e => setEditing({...editing, bio:e.target.value})} />
                  </div>
                </div>
                {msg && <p className="text-xs mt-3" style={{ color:'#b42828' }}>{msg}</p>}
                <div className="flex justify-end gap-2 mt-6">
                  <motion.button onClick={() => setModal(false)}
                    className="px-4 py-2.5 rounded-2xl text-sm font-semibold"
                    style={{ background:'var(--border)', color:'var(--muted)' }}
                    whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }}
                  >Cancelar</motion.button>
                  <motion.button onClick={save} disabled={saving}
                    className="px-5 py-2.5 rounded-2xl text-sm font-semibold"
                    style={{ background:'var(--ink)', color:'var(--paper)', opacity:saving?0.6:1 }}
                    whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }}
                  >{saving ? 'Guardando…' : 'Guardar'}</motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </AdminLayout>
    </>
  );
}
