import { createContext, useEffect, useState } from "react";
import { useNetwork, useSwitchNetwork } from "wagmi";
import getConfigs from "../utils/contractConfigs";
import { toast } from "react-toastify";

export const ValidateNetworkContext = createContext();

const ValidateNetworkProvider = ({ children }) => {
  const [expectedChainId, setExpectedChainId] = useState("");

  const { chain } = useNetwork();
  const chainId = chain?.id; // current chain id

  const { switchNetworkAsync, isSuccess, error } = useSwitchNetwork({
    chainId: expectedChainId,
  });

  useEffect(() => {
    // get contract chain id
    const { chainId } = getConfigs();
    setExpectedChainId(chainId);
  }, []);

  // a function for validating the network before writing to the contract if wrong chain id is active then send switch request
  async function validateNetwork(write) {
    try {
      if (chainId !== expectedChainId) {
        await switchNetworkAsync?.();
        setTimeout(write, 120);
      } else {
        write();
      }
    } catch (error) {
      toast.error("failed to change the network");
      console.log(error);
    }
  }

  return (
    <ValidateNetworkContext.Provider value={{ validateNetwork }}>
      {children}
    </ValidateNetworkContext.Provider>
  );
};

export default ValidateNetworkProvider;
