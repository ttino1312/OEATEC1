// pages/admin/login.tsx
import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Eye, EyeOff, LogIn } from 'lucide-react';

export default function AdminLogin() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw]     = useState(false);
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  useEffect(() => {
    fetch('/api/auth/index.php').then(r => r.json())
      .then(d => { if (d.authenticated) router.replace('/admin'); })
      .catch(() => {});
  }, []);

  const login = async () => {
    if (!username || !password) { setError('Completá usuario y contraseña.'); return; }
    setLoading(true); setError('');
    try {
      const res  = await fetch('/api/auth/index.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (data.authenticated) router.push('/admin');
      else setError(data.error || 'Credenciales incorrectas.');
    } catch {
      setError('Error de conexión.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head><title>Admin — Radio Técnica Uno</title></Head>
      <div
        className="min-h-screen flex items-center justify-center px-4"
        style={{ background: 'var(--paper)' }}
      >
        <motion.div
          className="w-full max-w-sm"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        >
          {/* Logo */}
          <div className="flex flex-col items-center mb-10">
            <Image src="/logo.png" alt="EEST N°1 OEA" width={64} height={64}
              className="rounded-full mb-4" style={{ border: '1px solid var(--border)' }} />
            <h1 style={{ fontFamily: 'Cormorant Garant, Georgia, serif',
              fontSize: '1.75rem', fontWeight: 400, color: 'var(--ink)' }}>
              Panel Admin
            </h1>
            <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>
              Radio Técnica Uno — EEST N°1 "OEA"
            </p>
          </div>

          <div className="p-8 rounded-3xl" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>

            {/* Error */}
            {error && (
              <motion.p
                className="text-xs px-3 py-2 rounded-xl mb-5 text-center"
                style={{ background: 'rgba(180,40,40,0.08)', color: '#b42828' }}
                initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
              >
                {error}
              </motion.p>
            )}

            {/* Username */}
            <div className="mb-4">
              <label className="block text-xs font-semibold mb-2"
                style={{ color: 'var(--muted)', fontFamily: 'Plus Jakarta Sans' }}>
                Usuario
              </label>
              <input
                type="text" value={username}
                onChange={e => setUsername(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && login()}
                autoComplete="username"
                className="w-full px-4 py-3 rounded-2xl text-sm outline-none"
                style={{
                  background: 'var(--paper)', border: '1px solid var(--border)',
                  color: 'var(--ink)', fontFamily: 'Plus Jakarta Sans',
                  transition: 'border-color 0.2s',
                }}
                onFocus={e => (e.target.style.borderColor = 'var(--gold)')}
                onBlur={e  => (e.target.style.borderColor = 'var(--border)')}
              />
            </div>

            {/* Password */}
            <div className="mb-6">
              <label className="block text-xs font-semibold mb-2"
                style={{ color: 'var(--muted)', fontFamily: 'Plus Jakarta Sans' }}>
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'} value={password}
                  onChange={e => setPassword(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && login()}
                  autoComplete="current-password"
                  className="w-full px-4 py-3 pr-10 rounded-2xl text-sm outline-none"
                  style={{
                    background: 'var(--paper)', border: '1px solid var(--border)',
                    color: 'var(--ink)', fontFamily: 'Plus Jakarta Sans',
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={e => (e.target.style.borderColor = 'var(--gold)')}
                  onBlur={e  => (e.target.style.borderColor = 'var(--border)')}
                />
                <button
                  type="button" onClick={() => setShowPw(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: 'var(--muted)' }}
                >
                  {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <motion.button
              onClick={login} disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-semibold"
              style={{
                background: 'var(--ink)', color: 'var(--paper)',
                opacity: loading ? 0.6 : 1, cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: 'Plus Jakarta Sans',
              }}
              whileHover={!loading ? { scale: 1.02 } : {}}
              whileTap={!loading ? { scale: 0.98 } : {}}
            >
              <LogIn size={14} />
              {loading ? 'Ingresando…' : 'Ingresar'}
            </motion.button>
          </div>

          <div className="text-center mt-6">
            <a href="/" className="text-xs" style={{ color: 'var(--muted)' }}>
              ← Volver al sitio
            </a>
          </div>
        </motion.div>
      </div>
    </>
  );
}
