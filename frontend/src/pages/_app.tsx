import Navbar from "@/components/NavBar/NavBar";
import "@/styles/globals.css";
import WagmiProvider from "@/utils/wagmiProvider";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WagmiProvider>
      <Navbar />
      <Component {...pageProps} />
    </WagmiProvider>
  );
}
