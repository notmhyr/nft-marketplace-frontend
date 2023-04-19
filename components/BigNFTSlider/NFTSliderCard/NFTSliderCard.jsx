import React, { useEffect, useState } from "react";
import Image from "next/image";
import { FaEthereum } from "react-icons/fa";
import { BsArrowUpRight } from "react-icons/bs";
import style from "./NFTSliderCard.module.scss";
import Button from "../../Button/Button";
import images from "../../../img";
import { cutAddress } from "../../../utils/cutAddress";
import Identicon from "react-identicons";
import { countDownTimer } from "../../../utils/date";
import { useRouter } from "next/router";

const NFTSliderCard = ({ nft }) => {
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
    <div className={style.card}>
      <div className={style.card_left}>
        <h2>{nft.name}</h2>
        <div className={style.card_left_creator}>
          <Identicon
            string={nft.owner}
            size={40}
            className={style.card_left_creator_icon}
          />

          <span>{cutAddress(nft.owner)}</span>
        </div>
        <p>{nft.description}</p>
        <div className={style.card_left_auction}>
          <div className={style.card_left_auction_left}>
            <span>Current Bid</span>
            <strong>
              {nft.auction.currentBid > 0 ? nft.auction.currentBid : "0.0"}{" "}
              <FaEthereum />
            </strong>
          </div>
          <div className={style.card_left_auction_right}>
            <span>Auction {countDown?.message}</span>
            {countDown == false ? (
              <div>
                <span>auction is ended</span>
              </div>
            ) : (
              <div className={style.card_left_auction_right_endTime}>
                <div className={style.card_left_auction_right_endTime_box}>
                  <span>{countDown?.days}</span>
                  <span>days</span>
                </div>

                <span className={style.card_left_auction_right_endTime_colon}>
                  :
                </span>

                <div className={style.card_left_auction_right_endTime_box}>
                  <span>{countDown?.hours}</span>
                  <span>hours</span>
                </div>

                <span className={style.card_left_auction_right_endTime_colon}>
                  :
                </span>

                <div className={style.card_left_auction_right_endTime_box}>
                  <span>{countDown?.minutes}</span>
                  <span>minutes</span>
                </div>
                <span className={style.card_left_auction_right_endTime_colon}>
                  :
                </span>

                <div className={style.card_left_auction_right_endTime_box}>
                  <span>{countDown?.seconds}</span>
                  <span>seconds</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className={style.card_left_buttons}>
          <Button
            btnName="Place a bid"
            handleClick={() => router.push(`/nfts/${nft._id}`)}
            icon={<BsArrowUpRight fontSize={12} />}
          />
          <Button
            btnName="View"
            reverse={true}
            handleClick={() => router.push(`/nfts/${nft._id}`)}
            icon={<BsArrowUpRight fontSize={12} />}
          />
        </div>
      </div>

      <div className={style.card_right}>
        <Image src={nft.image} alt="nft pic" height={320} width={300} />
      </div>
    </div>
  );
};

export default NFTSliderCard;
