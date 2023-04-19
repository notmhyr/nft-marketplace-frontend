import React, { useContext, useEffect, useState } from "react";
import { MdOutlineClose } from "react-icons/md";
import {
  useContractEvent,
  useContractWrite,
  useNetwork,
  useWaitForTransaction,
} from "wagmi";
import { toast } from "react-toastify";
import axios from "axios";
import { ethers } from "ethers";

//internal imports
import style from "./OfferModel.module.scss";
import formstyle from "../../styles/Form.module.scss";
import { Button } from "../componentIndex";
import { dateToSeconds } from "../../utils/date";
import { convertToWei } from "../../utils/convertUnits";
import getConfigs from "../../utils/contractConfigs";
import Link from "next/link";
import { ValidateNetworkContext } from "../../context/ValidateNetwork";

// getting today's date for set it as minimum date input
const today = new Date();
const dd = String(today.getDate()).padStart(2, "0");
const mm = String(today.getMonth() + 1).padStart(2, "0");
const yyyy = today.getFullYear();
const now = yyyy + "-" + mm + "-" + dd;

const MakeOfferModel = ({
  handleCloseBtn,
  isOpen,
  marketplaceConfig,
  nftAddress,
  tokenId,
  fetchNFT,
}) => {
  // input values
  const [WethAmount, setWethAmount] = useState(0);
  const [expiration, setExpiration] = useState("");
  const [wethConfig, setWethConfig] = useState("");

  const { validateNetwork } = useContext(ValidateNetworkContext);

  // loading state
  const [isLoading, setIsLoading] = useState(false);

  const { chain } = useNetwork();
  const chainId = chain?.id.toString(); // current chain id

  const handleWethAmountForm = (e) => {
    setWethAmount(e.target.value);
  };

  const handleListSubmit = async (e) => {
    e.preventDefault();

    if ((WethAmount <= 0, !expiration)) {
      toast.error("wethAmount and expiration is required");
      return;
    }

    setIsLoading(true);

    // approve marketplace to spend the weth amount
    validateNetwork(approveWeth);
  };

  // wagmi hooks
  const { data, write: approveWeth } = useContractWrite({
    ...wethConfig,
    functionName: "approve",
    args: [marketplaceConfig.address, convertToWei(WethAmount)],

    onError(e) {
      setIsLoading(false);
      toast.error(e.reason);
      console.log(e);
    },
  });

  const waitForConfirmation = useWaitForTransaction({
    hash: data?.hash,

    onSuccess() {
      validateNetwork(createOffer);
    },
    onError(e) {
      toast.error("failed to approve");
      console.log(e);
    },
  });

  const { write: createOffer } = useContractWrite({
    ...marketplaceConfig,
    functionName: "createOffer",
    args: [
      nftAddress,
      tokenId,
      convertToWei(WethAmount),
      dateToSeconds(expiration),
    ],
    onSuccess() {
      setIsLoading(false);
      toast.success("offer created successfully");
      handleCloseBtn();
    },
    onError(e) {
      toast.error(e.reason);
      setIsLoading(false);
      console.log(e);
    },
  });

  useContractEvent({
    ...marketplaceConfig,
    eventName: "OfferCreated",
    async listener(offerer, nft, tokenId, amount) {
      try {
        const { data } = await axios.post("/api/listNFT/createOffer", {
          nftAddress: nft,
          tokenId: tokenId.toString(),
          offer: {
            offerer,
            amount: ethers.utils.formatEther(amount).toString(),
            expireAt: expiration,
          },
        });

        if (data.status === "success") {
          fetchNFT();
          console.log("offer added to db successfully");
        }
      } catch (error) {
        console.log(error);
      }
    },
    once: true,
  });

  useEffect(() => {
    const { wethConfig } = getConfigs(chainId);
    setWethConfig(wethConfig);
  }, []);
  return (
    <div
      className={style.makeOfferModel}
      style={isOpen ? { scale: "1" } : { scale: "0" }}
    >
      <div className={style.makeOfferModel_box}>
        <MdOutlineClose
          className={style.makeOfferModel_box_closeBtn}
          onClick={!isLoading ? handleCloseBtn : () => {}}
        />
        <form
          className={style.makeOfferModel_box_form}
          onSubmit={handleListSubmit}
        >
          <div className={formstyle.Form_box_input}>
            <label>
              Offer amount in weth* <Link href={`/weth`}>(swap weth)</Link>
            </label>
            <input
              type="number"
              placeholder="1.4 WETH"
              required
              step="0.1"
              value={WethAmount}
              onChange={handleWethAmountForm}
              className={formstyle.Form_box_input_input}
            />
          </div>

          <div className={formstyle.Form_box_input}>
            <label>Expiration date*</label>
            <input
              type="date"
              min={now}
              onChange={(e) => setExpiration(e.target.value)}
              className={formstyle.Form_box_input_input}
            />
          </div>

          <div className={formstyle.Form_box_button}>
            <Button
              btnName="Make offer"
              type="submit"
              loading={isLoading}
              disabled={isLoading}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default MakeOfferModel;
