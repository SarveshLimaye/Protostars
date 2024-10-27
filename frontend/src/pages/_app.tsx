import dynamic from "next/dynamic";
import "@/styles/globals.css";
import WagmiProvider from "@/utils/wagmiProvider";
import type { AppProps } from "next/app";

const Navbar = dynamic(() => import("@/components/Navbar/NavBar"), {
  ssr: false,
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WagmiProvider>
      <Navbar />
      <Component {...pageProps} />
    </WagmiProvider>
  );
}
