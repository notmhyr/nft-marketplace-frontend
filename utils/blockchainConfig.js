import { EthereumClient, w3mConnectors } from "@web3modal/ethereum";
import { configureChains, createClient } from "wagmi";

import { localhost, sepolia } from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";

// configuration for connect wallets and interacting with blockchain
const blockchainConfig = () => {
  const chains = [sepolia];
  const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;

  // [w3mProvider({ projectId })]
  const { provider } = configureChains(chains, [
    alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY }),
    jsonRpcProvider({
      rpc: (chain) => ({
        http: `https://eth-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`,
      }),
    }),
  ]);

  const wagmiClient = createClient({
    autoConnect: true,
    connectors: w3mConnectors({ projectId, version: 1, chains }),
    provider,
  });
  const ethereumClient = new EthereumClient(wagmiClient, chains);

  return {
    wagmiClient,
    ethereumClient,
  };
};

export default blockchainConfig;
