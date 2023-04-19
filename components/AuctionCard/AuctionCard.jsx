import React, { useEffect, useState } from "react";
import Image from "next/image";
import { FaEthereum } from "react-icons/fa";

//internal import
import style from "./AuctionCard.module.scss";
import { countDownTimer } from "../../utils/date";
import { useRouter } from "next/router";
const AuctionCard = ({ nft }) => {
  //count down data
  const [countDown, setCountDown] = useState("");
  const router = useRouter();
  useEffect(() => {
    // check if auction data is loaded
    const timer = setInterval(() => {
      const newCountDown = countDownTimer(
        nft.auction.startTime,
        nft.auction.endTime
      );
      setCountDown(newCountDown);
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <div
      className={style.auctionCard}
      onClick={() => router.push(`/nfts/${nft._id}`)}
    >
      <div className={style.auctionCard_box}>
        <div className={style.auctionCard_remainingTime}>
          <div className={style.auctionCard_remainingTime_info}>
            <small>Remaining time</small>
            <p>
              <span>{countDown?.days}d</span>
              <span>:</span>
              <span>{countDown?.hours}h</span>
              <span>:</span>
              <span>{countDown?.minutes}m</span>
              <span>:</span>
              <span>{countDown?.seconds}s</span>
            </p>
          </div>
        </div>
        <Image src={nft.image} alt="nft" width={400} height={400} />

        <div className={style.auctionCard_info}>
          <div className={style.auctionCard_info_info}>
            <h4>{nft.name}</h4>
            <div className={style.auctionCard_info_bid}>
              <span className={style.auctionCard_info_bid_current}>
                current bid
              </span>
              <span className={style.auctionCard_info_bid_price}>
                {nft.auction.currentBid > 0 ? nft.auction.currentBid : "0.0"}{" "}
                <FaEthereum />
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuctionCard;
