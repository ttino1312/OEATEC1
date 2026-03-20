// pages/privacidad.tsx
import Head from 'next/head';
import { Reveal } from '../components/Reveal';

const SECTIONS = [
  {
    title: '1. Información que recopilamos',
    content: `Este sitio web no recopila datos personales de forma automática más allá de los registros técnicos estándar del servidor (dirección IP, navegador, páginas visitadas) necesarios para el funcionamiento del servicio. No utilizamos cookies de seguimiento ni publicidad de terceros.`,
  },
  {
    title: '2. Uso de la información',
    content: `Los datos técnicos de acceso son utilizados únicamente para el mantenimiento y mejora del servicio. No son vendidos, cedidos ni compartidos con terceros.`,
  },
  {
    title: '3. Menores de edad',
    content: `La EEST N°1 "OEA" es una institución educativa que trabaja con menores de edad. Toda publicación de voz, imagen o dato personal de estudiantes menores de 18 años requiere consentimiento escrito previo de su padre, madre o tutor legal, en cumplimiento de la Ley 26.061 de Protección Integral de los Derechos de Niñas, Niños y Adolescentes y la normativa de la Provincia de Buenos Aires.`,
  },
  {
    title: '4. Grabaciones y podcast',
    content: `Los programas radiales y episodios de podcast publicados en este sitio son producidos por estudiantes bajo supervisión docente. Los participantes y sus tutores han prestado consentimiento explícito para la publicación. Las grabaciones pueden ser descargadas para uso personal y educativo no comercial, citando la fuente.`,
  },
  {
    title: '5. Propiedad intelectual',
    content: `Los contenidos producidos por la radio escolar son propiedad de la EEST N°1 "OEA" y de sus estudiantes. Queda prohibida su reproducción comercial sin autorización expresa. La música emitida en el stream en vivo puede estar sujeta a licencias de SADAIC u otras sociedades de gestión colectiva.`,
  },
  {
    title: '6. Seguridad',
    content: `Este sitio utiliza HTTPS para proteger las comunicaciones. El panel de administración está protegido por autenticación. No almacenamos contraseñas en texto plano.`,
  },
  {
    title: '7. Cambios a esta política',
    content: `Esta política puede ser actualizada en cualquier momento. La versión vigente siempre estará disponible en esta página con la fecha de última actualización.`,
  },
  {
    title: '8. Contacto',
    content: `Para cualquier consulta relacionada con el tratamiento de datos personales, escribir a: contacto@eest1oea.edu.ar`,
  },
];

export default function Privacidad() {
  return (
    <>
      <Head><title>Política de Privacidad — EEST N°1 "OEA"</title></Head>

      <div className="px-8 md:px-16 pt-16 pb-24 max-w-3xl">
        <Reveal>
          <p className="text-xs tracking-widest uppercase mb-4"
            style={{ color: 'var(--muted)', fontFamily: 'JetBrains Mono, monospace' }}>
            Legal
          </p>
          <h1 className="leading-none mb-4"
            style={{ fontFamily: 'Cormorant Garant, Georgia, serif',
              fontSize: 'clamp(2rem, 5vw, 4rem)', fontWeight: 300, letterSpacing: '-0.02em' }}>
            Política de Privacidad
          </h1>
          <p className="text-xs mb-14" style={{ color: 'var(--muted)', fontFamily: 'JetBrains Mono, monospace' }}>
            Última actualización: enero 2025
          </p>
        </Reveal>

        <div className="space-y-10" style={{ borderTop: '1px solid var(--border)', paddingTop: '2.5rem' }}>
          {SECTIONS.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.04}>
              <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '2.5rem' }}>
                <h2 className="font-semibold text-base mb-3" style={{ color: 'var(--ink)' }}>
                  {s.title}
                </h2>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
                  {s.content}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.2}>
          <p className="mt-12 text-xs" style={{ color: 'var(--muted)', fontFamily: 'JetBrains Mono, monospace' }}>
            EEST N°1 "OEA" · Hurlingham, Buenos Aires · Provincia de Buenos Aires, Argentina
          </p>
        </Reveal>
      </div>
    </>
  );
}
