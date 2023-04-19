import React, { useContext, useEffect, useState } from "react";
import style from "../styles/weth.module.scss";
import formstyle from "../styles/Form.module.scss";
import { Button, WebsiteHead } from "../components/componentIndex";
import {
  useAccount,
  useContractRead,
  useContractWrite,
  useNetwork,
} from "wagmi";
import getConfigs from "../utils/contractConfigs";
import { convertToWei } from "../utils/convertUnits";
import { useRouter } from "next/router";
import { ethers } from "ethers";
import { toast } from "react-toastify";
import { ValidateNetworkContext } from "../context/ValidateNetwork";

// page for exchanging eth to weth since there is no official weth created on sepolia i use my own one
const Weth = () => {
  const [amount, setAmount] = useState(0);
  const [wethConfig, setWethConfig] = useState("");

  // check if the page is mounted to prevent hydration error
  const [mounted, setMounted] = useState(false);

  const { validateNetwork } = useContext(ValidateNetworkContext);

  const { address, isConnected } = useAccount();

  const router = useRouter();
  const { redirect } = router.query;

  const handleSubmit = (e) => {
    e.preventDefault();
    validateNetwork(write);
  };

  const { data: balance } = useContractRead({
    ...wethConfig,
    functionName: "balanceOf",
    args: [address],
    watch: true,
    select: (data) => {
      return ethers.utils.formatEther(data);
    },
  });

  const { write, isLoading } = useContractWrite({
    ...wethConfig,
    functionName: "deposit",
    overrides: {
      value: convertToWei(amount),
    },

    onSuccess() {
      toast.success("exchanged eth to weth successfully");
      setAmount(0);
      // if redirect exist in rout query we redirect use
      if (redirect) {
        // set time out delay to give user time to see the success message
        setTimeout(() => {
          router.replace(redirect);
        }, 3000);
      }
    },
    onError(e) {
      toast.error(e.reason);
      console.log(e);
    },
  });

  useEffect(() => {
    setMounted(true);
    // get contract configs
    const { wethConfig } = getConfigs();
    setWethConfig(wethConfig);
  }, []);

  if (mounted && !isConnected) {
    return (
      <div className={style.message}>
        <p>Please connect your wallet</p>
      </div>
    );
  }
  return (
    <div className={style.weth}>
      <WebsiteHead title="Weth" />

      <form className={style.weth_form} onSubmit={handleSubmit}>
        <div className={formstyle.Form_box_input}>
          <label htmlFor="name">Amount to convert (sepolia)*</label>
          <input
            type="number"
            min={0}
            placeholder="2.5 ETH"
            step={0.001}
            required
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className={formstyle.Form_box_input_input}
          />
        </div>
        <div className={formstyle.Form_box_button}>
          <Button
            btnName="Deposit"
            type="submit"
            loading={isLoading}
            disabled={isLoading}
          />
        </div>

        <div className={style.weth_form_info}>
          <p>
            balance : <strong>{balance} WETH</strong>
          </p>
          <p>
            contract address: <small>{wethConfig.address}</small>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Weth;
