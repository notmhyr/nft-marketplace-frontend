import React from "react";
import { FaEthereum } from "react-icons/fa";
import Image from "next/image";
import { useAccount } from "wagmi";
import { useRouter } from "next/router";

//internal imports
import style from "./NFTCard.module.scss";

const NFTCard = ({ nft }) => {
  const { address } = useAccount();
  const router = useRouter();
  return (
    <div
      className={style.smallNftCard}
      onClick={() => router.push(`/nfts/${nft._id}`)}
    >
      <div className={style.smallNftCard_box}>
        <div className={style.smallNftCard_box_collection}>
          <div className={style.smallNftCard_box_collection_info}>
            <small>NFT name</small>
            <p>{nft.name}</p>
          </div>
        </div>

        <Image src={nft.image} alt="nft" width={300} height={330} />

        <div className={style.smallNftCard_box_info}>
          <div className={style.smallNftCard_box_info_info}>
            <strong>{nft.price} ETH</strong>
          </div>
        </div>

        <div className={style.smallNftCard_box_buyNow}>
          <div className={style.smallNftCard_box_buyNow_box}>
            <span>{address == nft.owner ? "View" : "Buy Now"}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NFTCard;
