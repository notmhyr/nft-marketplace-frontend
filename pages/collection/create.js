import React, { useContext, useEffect, useState } from "react";
import { Button, WebsiteHead } from "../../components/componentIndex";
import {
  useAccount,
  useContractRead,
  useContractWrite,
  useNetwork,
  useSwitchNetwork,
} from "wagmi";
import { toast } from "react-toastify";

//internal imports
import style from "../../styles/createCollection.module.scss";
import formstyle from "../../styles/Form.module.scss";
import getConfigs from "../../utils/contractConfigs";
import { useRouter } from "next/router";
import { ValidateNetworkContext } from "../../context/ValidateNetwork";
const Create = () => {
  // form input values
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [royaltyFee, setRoyaltyFee] = useState(0);
  const [feeRecipient, setFeeRecipient] = useState("");
  // nft factory config
  const [nftFactoryConfig, setNftFactoryConfig] = useState({});
  // check if the page is mounted to prevent hydration error
  const [mounted, setMounted] = useState(false);

  const { validateNetwork } = useContext(ValidateNetworkContext);

  const { address, isConnected } = useAccount();

  const { chain } = useNetwork();
  const chainId = chain?.id; // current chain id

  const {
    switchNetworkAsync,
    isSuccess: isSwitched,
    error: errorToSwitch,
  } = useSwitchNetwork({
    chainId: 11155111,
  });
  const router = useRouter();
  const { redirect } = router.query;

  // use wagmi hooks for make the function call on the contract
  const { data: platformFee } = useContractRead({
    ...nftFactoryConfig,
    functionName: "platformFee",
  });

  const { write, isLoading } = useContractWrite({
    ...nftFactoryConfig,
    functionName: "createCollection",
    args: [name, symbol, royaltyFee * 100, feeRecipient],
    overrides: {
      value: platformFee,
    },

    onSuccess() {
      toast.success("collection created successfully");
      setName("");
      setSymbol("");
      setRoyaltyFee(0);
      setFeeRecipient("");
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
      console.log(e.message);
    },
  });

  async function handleSubmit(e) {
    e.preventDefault();

    validateNetwork(write);
  }

  useEffect(() => {
    setMounted(true);

    // get contract configs
    const { nftFactoryConfig } = getConfigs();
    setNftFactoryConfig(nftFactoryConfig);
  }, []);

  if (mounted && !isConnected) {
    return (
      <div className={style.message}>
        <p>Please connect your wallet</p>
      </div>
    );
  }

  return (
    <div className={style.create}>
      <WebsiteHead title="Create collection" />

      <h2>Create Collection</h2>
      <form className={style.create_form} onSubmit={handleSubmit}>
        <div className={formstyle.Form_box_input}>
          <label htmlFor="name">Name*</label>
          <input
            type="text"
            placeholder="Collection name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={formstyle.Form_box_input_input}
          />
        </div>

        <div className={formstyle.Form_box_input}>
          <label htmlFor="name">Symbol*</label>
          <input
            type="text"
            placeholder="Collection Symbol"
            required
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            className={formstyle.Form_box_input_input}
          />
        </div>

        <div className={formstyle.Form_box_input}>
          <label htmlFor="name">Royalty fee*</label>
          <input
            type="number"
            min={0}
            max={10}
            step="0.5"
            placeholder="2.5"
            required
            value={royaltyFee}
            onChange={(e) => setRoyaltyFee(e.target.value)}
            className={formstyle.Form_box_input_input}
          />
        </div>

        <div className={formstyle.Form_box_input}>
          <label htmlFor="name">Fee recipient*</label>
          <input
            type="text"
            placeholder="0x02943..."
            required
            value={feeRecipient}
            onChange={(e) => setFeeRecipient(e.target.value)}
            className={formstyle.Form_box_input_input}
          />
        </div>

        <div className={formstyle.Form_box_button}>
          <Button
            btnName="Create"
            type="submit"
            loading={isLoading}
            disabled={isLoading}
          />
        </div>
      </form>
    </div>
  );
};

export default Create;
