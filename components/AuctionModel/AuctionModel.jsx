import React, { useContext, useEffect, useState } from "react";
import { MdOutlineClose } from "react-icons/md";
import { useContractEvent, useContractRead, useContractWrite } from "wagmi";
import { toast } from "react-toastify";
import axios from "axios";
import { ethers } from "ethers";

//internal imports
import style from "./AuctionModel.module.scss";
import formstyle from "../../styles/Form.module.scss";
import { Button } from "../componentIndex";
import { dateToSeconds } from "../../utils/date";
import { convertToWei } from "../../utils/convertUnits";
import { useRouter } from "next/router";
import { ValidateNetworkContext } from "../../context/ValidateNetwork";
// getting today's date for set it as minimum date input
const today = new Date();
const dd = String(today.getDate()).padStart(2, "0");
const mm = String(today.getMonth() + 1).padStart(2, "0");
const yyyy = today.getFullYear();
const hour = String(today.getHours()).padStart(2, "0");
const minutes = String(today.getMinutes()).padStart(2, "0");
const now = `${yyyy}-${mm}-${dd}T${hour}:${minutes}`;

const AuctionModel = ({
  handleCloseBtn,
  isOpen,
  auctionConfig,
  nftAddress,
  tokenId,
  fetchNFT,
}) => {
  // input values
  const [minBid, setMinBid] = useState(0);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const [loading, setLoading] = useState(false);

  const { validateNetwork } = useContext(ValidateNetworkContext);

  const router = useRouter();

  const handleMinBidForm = (e) => {
    setMinBid(e.target.value);
  };

  const handleListSubmit = async (e) => {
    e.preventDefault();

    if ((minBid <= 0, !startTime, !endTime)) {
      toast.error("all fields are required");
      return;
    }
    setLoading(true);

    validateNetwork(write);
  };

  // wagmi hooks
  const { write, isLoading, isSuccess } = useContractWrite({
    ...auctionConfig,
    functionName: "createAuction",
    args: [
      nftAddress,
      tokenId,
      convertToWei(minBid),
      dateToSeconds(startTime),
      dateToSeconds(endTime),
    ],

    onSuccess() {
      toast.success("auction created successfully");
      // router.reload();
    },
    onError(e) {
      toast.error(e.reason);
      setLoading(false);
      console.log(e.message);
    },
  });

  // event listener for create auction
  useContractEvent({
    ...auctionConfig,
    eventName: "AuctionCreated",
    async listener(nft, tokenId, minBid, startTime, endTime) {
      try {
        const { data } = await axios.post("/api/listNFT/createAuction", {
          nftAddress: nft,
          tokenId: tokenId.toString(),
          auction: {
            minBid: ethers.utils.formatEther(minBid),
            startTime: startTime.toString(),
            endTime: endTime.toString(),
          },
        });
        setLoading(false);
        handleCloseBtn();

        console.log("auction added to db");
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
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
        <form
          className={style.auctionModel_box_form}
          onSubmit={handleListSubmit}
        >
          <div className={formstyle.Form_box_input}>
            <label>Minimum bid*</label>
            <input
              type="number"
              placeholder="1.4 ETH"
              required
              min={0}
              step="0.1"
              value={minBid}
              onChange={handleMinBidForm}
              className={formstyle.Form_box_input_input}
            />
          </div>

          <div className={formstyle.Form_box_input}>
            <label>Start date*</label>
            <input
              required
              type="datetime-local"
              min={now}
              onChange={(e) => setStartTime(e.target.value)}
              className={formstyle.Form_box_input_input}
            />
          </div>

          <div className={formstyle.Form_box_input}>
            <label>Ending date*</label>
            <input
              required
              type="datetime-local"
              min={now}
              onChange={(e) => setEndTime(e.target.value)}
              className={formstyle.Form_box_input_input}
            />
          </div>

          <div className={formstyle.Form_box_button}>
            <Button
              btnName="Create auction"
              type="submit"
              loading={loading}
              disabled={loading}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuctionModel;
