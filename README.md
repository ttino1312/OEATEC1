# Radio Técnica Uno — Frontend Next.js
### EEST N°1 "OEA" · Hurlingham, Buenos Aires

Rediseño completo del sitio. Stack: **Next.js 14 (Pages Router) · Tailwind CSS · Framer Motion**.

---

## Estructura

```
radio-tecnica-uno/
├── pages/
│   ├── index.tsx            ← Home editorial
│   ├── programacion.tsx     ← Grilla semanal por día
│   ├── podcast.tsx          ← Episodios + player flotante
│   ├── institucional.tsx    ← Info de la escuela
│   ├── contacto.tsx         ← Dirección + mapa
│   ├── privacidad.tsx       ← Política de privacidad
│   └── admin/
│       ├── login.tsx        ← Login admin
│       ├── index.tsx        ← Dashboard en vivo
│       ├── programacion.tsx ← CRUD shows
│       ├── presentadores.tsx← CRUD presentadores
│       ├── grabaciones.tsx  ← Upload + CRUD episodios
│       └── configuracion.tsx← Config del stream
├── components/
│   ├── Layout.tsx           ← Wrapper con SideNav + Player + transiciones
│   ├── SideNav.tsx          ← Navbar lateral flotante
│   ├── RadioPlayer.tsx      ← Player persistente en barra inferior
│   ├── Reveal.tsx           ← Scroll reveal animations
│   └── admin/
│       └── AdminLayout.tsx  ← Layout del panel admin
├── hooks/
│   ├── useRadioMetadata.ts  ← Polling de metadata del stream
│   └── (useAudioPlayer en mismo archivo)
├── lib/
│   └── types.ts             ← TypeScript types + helpers
├── styles/
│   └── globals.css          ← Design tokens + utilidades
├── public/
│   └── logo.png             ← Logo EEST N°1 OEA (ya incluido)
└── .env.local.example       ← Variables de entorno
```

---

## Instalación

### 1. Requisitos
- Node.js 18+
- npm o yarn

### 2. Instalar dependencias
```bash
cd radio-tecnica-uno
npm install
```

### 3. Configurar entorno
```bash
cp .env.local.example .env.local
# Editar .env.local con los valores correctos
```

Variables clave:
```
PHP_API_URL=http://localhost/radio-escolar   # URL del backend PHP
NEXT_PUBLIC_STREAM_URL=https://...           # URL del stream de audio
```

### 4. Correr en desarrollo
```bash
npm run dev
# → http://localhost:3000
```

### 5. Build para producción
```bash
npm run build
npm start
```

---

## Integración con el backend PHP

El frontend se conecta al backend PHP (carpeta `radio-escolar/`) que debe estar
corriendo en un servidor con Apache/PHP 8+.

**En desarrollo local:**
- Backend PHP: http://localhost/radio-escolar
- Frontend Next.js: http://localhost:3000
- Configurar `PHP_API_URL=http://localhost/radio-escolar` en `.env.local`

**En producción Hostinger:**
Los dos proyectos pueden convivir en el mismo servidor:
- PHP backend en `public_html/` (o subdirectorio)
- Next.js puede deployarse en Vercel, Railway, o exportarse como HTML estático

**Opción más simple para Hostinger:** exportar como HTML estático:
```bash
# en next.config.js agregar: output: 'export'
npm run build
# subir la carpeta out/ vía FTP
```

---

## Diseño

**Paleta:**
- `--ink`    `#111110` — Negro casi puro
- `--paper`  `#F8F7F4` — Blanco cálido (fondo)
- `--muted`  `#8C897F` — Gris medio
- `--border` `#E3E1DB` — Gris claro para bordes
- `--gold`   `#C9A040` — Acento dorado (mínimo)

**Tipografías:**
- Display: `Cormorant Garant` (serif elegante, para títulos)
- Cuerpo:  `Plus Jakarta Sans` (sans-serif limpio)
- Mono:    `JetBrains Mono` (etiquetas técnicas, horarios)

**Animaciones:** Framer Motion en todo. Transiciones de página, scroll reveals
escalonados, micro-interacciones en botones y cards.

---

## Créditos

Proyecto desarrollado como pasantía técnica por estudiantes de la EEST N°6
"Chacabuco" (Morón) para la EEST N°1 "OEA" (Hurlingham) · Buenos Aires · Argentina.

---

## Setup rápido (sin backend PHP)

Si todavía no tenés el backend PHP corriendo, el frontend igual funciona — simplemente
la metadata va a mostrar "Radio Técnica Uno" con estado OFFLINE y el play no va a funcionar
hasta que configures `NEXT_PUBLIC_STREAM_URL`.

Para que el play funcione:
```
# .env.local
NEXT_PUBLIC_STREAM_URL=https://radios.solumedia.com:6740/stream
```

Para que la metadata funcione, necesitás el backend PHP corriendo en XAMPP:
```
PHP_API_URL=http://localhost/radio-escolar
```

Los errores `runtime.lastError: Could not establish connection` en la consola son
de **extensiones de Chrome** (como adblockers), no del proyecto. Ignorarlos.
