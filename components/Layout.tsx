// components/Layout.tsx
import { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/router';
import SideNav, { TopBar } from './SideNav';
import RadioPlayer from './RadioPlayer';
import Footer from './Footer';

const BARE_ROUTES = ['/admin/login'];
const ADMIN_ROUTES_PREFIX = '/admin';

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  enter:   { opacity: 1, y: 0,  transition: { duration: 0.38, ease: [0.25, 0.1, 0.25, 1] } },
  exit:    { opacity: 0, y: -8, transition: { duration: 0.2 } },
};

export default function Layout({ children }: { children: ReactNode }) {
  const router = useRouter();

  // Bare pages (login) — no chrome at all
  if (BARE_ROUTES.includes(router.pathname)) return <>{children}</>;

  // Admin pages — use their own AdminLayout inside, no sidebar/player
  if (router.pathname.startsWith(ADMIN_ROUTES_PREFIX)) return <>{children}</>;

  const isHome = router.pathname === '/';

  return (
    <div className="layout-wrapper">
      <SideNav />
      <div className="main-content" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <TopBar />
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={router.pathname}
            variants={pageVariants}
            initial="initial"
            animate="enter"
            exit="exit"
            style={{ flex: 1 }}
          >
            {children}
            {/* Footer on every public page except home (home has its own) */}
            {!isHome && <Footer />}
          </motion.div>
        </AnimatePresence>
      </div>
      <RadioPlayer />
    </div>
  );
}
