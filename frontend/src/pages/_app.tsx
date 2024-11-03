import dynamic from "next/dynamic";
import "@/styles/globals.css";
import WagmiProvider from "@/utils/wagmiProvider";
import type { AppProps } from "next/app";
import Footer from "@/components/Footer/Footer";
import Head from "next/head";

const Navbar = dynamic(() => import("@/components/NavBar/NavBar"), {
  ssr: false,
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>SkillSphere</title>
        <meta
          name="description"
          content="Showcase Your Skills, Protect Your Identity"
        />
      </Head>
      <WagmiProvider>
        <Navbar />
        <Component {...pageProps} />
        <Footer />
      </WagmiProvider>
    </>
  );
}
