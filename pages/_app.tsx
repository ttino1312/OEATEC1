// pages/_app.tsx
import type { AppProps } from 'next/app';
import Head from 'next/head';
import Layout from '../components/Layout';
import '../styles/globals.css';

export default function App({ Component, pageProps, router }: AppProps & { router: any }) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Radio Técnica Uno — La voz de la EEST N°1 OEA, Hurlingham, Buenos Aires." />
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  );
}
