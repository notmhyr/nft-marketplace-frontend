import { useEffect, useState } from "react";
import { Web3Modal } from "@web3modal/react";
import { WagmiConfig, useNetwork, useSwitchNetwork } from "wagmi";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/router";

//INTERNAL IMPORTS
import "../styles/globals.scss";
import style from "../styles/home.module.scss";
import { Footer, LoadingComponent, Navbar } from "../components/componentIndex";
import getConfigs from "../utils/contractConfigs";
import blockchainConfig from "../utils/blockchainConfig";
import ValidateNetworkProvider from "../context/ValidateNetwork";

// configuration for connect wallets and interacting with blockchain
const { wagmiClient, ethereumClient } = blockchainConfig();

// App component
function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const { chain } = useNetwork();
  const chainId = chain?.id.toString(); // current chain id

  useEffect(() => {
    if (chainId) {
      if (chainId !== "11155111") {
        toast.error(
          `this network is not supported please switch it to Sepolia`
        );
      }
    }
  }, [chainId]);

  useEffect(() => {
    const handleStart = (url) => setLoading(true);
    const handleComplete = (url) => setLoading(false);

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
    };
  }, [router]);

  return (
    <div className={style.app}>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        pauseOnHover
        theme="dark"
      />

      <WagmiConfig client={wagmiClient}>
        <ValidateNetworkProvider>
          <Navbar />
          {loading && <LoadingComponent wrap={true} />}
          <Component {...pageProps} />
          <Footer />
        </ValidateNetworkProvider>
      </WagmiConfig>

      <Web3Modal
        projectId={process.env.NEXT_PUBLIC_PROJECT_ID}
        ethereumClient={ethereumClient}
        themeVariables={{
          "--w3m-font-family": "Roboto, sans-serif",
          "--w3m-background-color": "#272727ff",
          "--w3m-accent-color": "#272727ff",
        }}
      />
    </div>
  );
}

export default MyApp;
