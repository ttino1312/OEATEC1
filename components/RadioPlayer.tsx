// components/RadioPlayer.tsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Play, Pause, Volume2, VolumeX, Loader2 } from 'lucide-react';
import { useRadioMetadata, useAudioPlayer, useStreamUrl } from '../hooks/useRadioMetadata';

export default function RadioPlayer() {
  const meta      = useRadioMetadata(12000);
  const streamUrl = useStreamUrl();
  const { playing, loading, volume, toggle, changeVolume } = useAudioPlayer(streamUrl);
  const [muted, setMuted]     = useState(false);
  const [prevVol, setPrevVol] = useState(0.8);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const toggleMute = () => {
    if (muted) { changeVolume(prevVol); setMuted(false); }
    else { setPrevVol(volume); changeVolume(0); setMuted(true); }
  };

  const track = [meta.artist, meta.title].filter(Boolean).join(' — ') || 'Radio Técnica Uno';

  if (!mounted) return null;

  return (
    <motion.div className="player-bar"
      initial={{ y: 80 }} animate={{ y: 0 }}
      transition={{ delay: 0.55, duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}>
      <div style={{
        display: 'flex', alignItems: 'center', width: '100%',
        gap: 'clamp(0.65rem, 2vw, 1.25rem)',
        padding: '0 clamp(0.875rem, 3vw, 1.75rem)',
      }}>

        {/* Cover */}
        <div style={{ width: 34, height: 34, borderRadius: 8, overflow: 'hidden', flexShrink: 0, border: '1px solid rgba(255,255,255,0.1)', position: 'relative' }}>
          <Image src={meta.cover || '/logo.png'} alt="portada" fill sizes="34px"
            style={{ objectFit: 'cover' }}
            onError={(e) => { (e.target as HTMLImageElement).src = '/logo.png'; }} />
        </div>

        {/* Station label — md+ */}
        <div className="hidden md:block" style={{ flexShrink: 0 }}>
          <p style={{ fontSize: '0.62rem', fontFamily: 'IBM Plex Mono, monospace', color: 'rgb(190,190,190)', letterSpacing: '0.08em' }}>
            RADIO T1
          </p>
        </div>

        {/* Play button — always clickable */}
        <motion.button
          onClick={toggle}
          style={{
            width: 32, height: 32, borderRadius: '50%', border: 'none', flexShrink: 0,
            background: playing ? 'rgb(255,255,255)' : 'rgba(255,255,255,0.14)',
            color: playing ? 'rgb(60,60,60)' : 'rgb(255,255,255)',
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            opacity: streamUrl ? 1 : 0.45,
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.92 }}
          title={playing ? 'Pausar' : streamUrl ? 'Reproducir' : 'Configurar stream primero'}
        >
          <AnimatePresence mode="wait" initial={false}>
            {loading ? (
              <motion.span key="spin" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Loader2 size={12} style={{ animation: 'spin 1s linear infinite' }} />
              </motion.span>
            ) : playing ? (
              <motion.span key="pause" initial={{ scale: 0.6 }} animate={{ scale: 1 }} exit={{ scale: 0.6 }}>
                <Pause size={12} fill="currentColor" />
              </motion.span>
            ) : (
              <motion.span key="play" initial={{ scale: 0.6 }} animate={{ scale: 1 }} exit={{ scale: 0.6 }}>
                <Play size={12} fill="currentColor" style={{ marginLeft: 1 }} />
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>

        {/* Track info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <AnimatePresence mode="wait">
            <motion.p key={track}
              style={{ fontSize: '0.78rem', fontWeight: 500, color: 'rgb(255,255,255)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', lineHeight: 1.35 }}
              initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}>
              {track}
            </motion.p>
          </AnimatePresence>
          <p style={{ fontSize: '0.65rem', color: 'rgb(122,122,122)', marginTop: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {meta.show || 'EEST N°1 "OEA" · Hurlingham'}
          </p>
        </div>

        {/* Volume — sm+ */}
        <div className="hidden sm:flex" style={{ alignItems: 'center', gap: '0.45rem', flexShrink: 0 }}>
          <button onClick={toggleMute} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgb(122,122,122)', display: 'flex', padding: 2 }}>
            {muted || volume === 0 ? <VolumeX size={12} /> : <Volume2 size={12} />}
          </button>
          <input type="range" min={0} max={1} step={0.02}
            value={muted ? 0 : volume}
            onChange={e => { changeVolume(parseFloat(e.target.value)); setMuted(false); }}
            style={{ width: 60 }} />
        </div>

        {/* Live badge */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 4, padding: '3px 8px', borderRadius: 99, flexShrink: 0,
          background: meta.live ? 'rgba(255,255,255,0.1)' : 'transparent',
          border: meta.live ? '1px solid rgba(255,255,255,0.18)' : '1px solid rgba(255,255,255,0.06)',
        }}>
          {meta.live && <span className="live-dot" style={{ width: 5, height: 5, borderRadius: '50%', background: 'rgb(200,200,200)', flexShrink: 0 }} />}
          <span style={{ fontSize: '0.58rem', fontFamily: 'IBM Plex Mono, monospace', color: meta.live ? 'rgb(200,200,200)' : 'rgb(84,84,84)', letterSpacing: '0.1em' }}>
            {meta.live ? 'VIVO' : 'OFF'}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
