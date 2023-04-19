import React, { useContext, useEffect, useState } from "react";
import { MdOutlineClose } from "react-icons/md";
import { useContractEvent, useContractWrite } from "wagmi";
import { toast } from "react-toastify";
import axios from "axios";
import { ethers } from "ethers";

//internal imports
import style from "./PlaceBidModel.module.scss";
import formstyle from "../../styles/Form.module.scss";
import { Button } from "../componentIndex";
import { convertToWei } from "../../utils/convertUnits";
import { useRouter } from "next/router";
import { ValidateNetworkContext } from "../../context/ValidateNetwork";

const PLaceBidModel = ({
  handleCloseBtn,
  isOpen,
  auctionConfig,
  nftAddress,
  tokenId,
  minBid,
  currentBid,
  fetchNFT,
}) => {
  // input values
  const [bid, setBid] = useState(0);

  const { validateNetwork } = useContext(ValidateNetworkContext);

  const router = useRouter();

  const handleBidForm = (e) => {
    setBid(e.target.value);
  };

  const handleListSubmit = async (e) => {
    e.preventDefault();

    if (bid <= minBid || bid <= currentBid) {
      toast.error("bid should be greater than min bid or current bid");
      return;
    }

    //approve marketplace before listing nft
    validateNetwork(write);
  };

  // wagmi hooks
  const { write, isLoading, isSuccess } = useContractWrite({
    ...auctionConfig,
    functionName: "placeBid",
    args: [nftAddress, tokenId],
    overrides: {
      value: convertToWei(bid),
    },

    onSuccess() {
      toast.success("auction created successfully");
      handleCloseBtn();
    },
    onError(e) {
      toast.error(e.reason);
      console.log(e);
    },
  });

  return (
    <div
      className={style.auctionModel}
      style={isOpen ? { scale: "1" } : { scale: "0" }}
    >
      <div className={style.auctionModel_box}>
        <MdOutlineClose
          className={style.auctionModel_box_closeBtn}
          onClick={!isLoading ? handleCloseBtn : () => {}}
        />

        <div className={style.auctionModel_box_status}>
          <span>minimum bid : {minBid} ETH</span>
          <span>top bid: {currentBid} ETH</span>
        </div>
        <form
          className={style.auctionModel_box_form}
          onSubmit={handleListSubmit}
        >
          <div className={formstyle.Form_box_input}>
            <label>bid*</label>
            <input
              type="number"
              placeholder="1.4 ETH"
              required
              min={currentBid ? currentBid : minBid}
              step="0.1"
              value={bid}
              onChange={handleBidForm}
              className={formstyle.Form_box_input_input}
            />
          </div>

          <div className={formstyle.Form_box_button}>
            <Button
              btnName="Place bid"
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

export default PLaceBidModel;
