import React from "react";
// internal imports
import style from "./FeaturedNFTs.module.scss";
import { Title, Filter, LoadingComponent } from "../componentIndex";
import images from "../../img";
import AuctionCard from "../AuctionCard/AuctionCard";

const FeaturedNFTs = ({ NFTs, loading }) => {
  return (
    <div className={style.featuredNfts}>
      <div className={style.featuredNfts_box}>
        <div className={style.featuredNfts_box_title}>
          <Title
            heading="Featured NFTs"
            paragraph="Discover the most outstanding NFTs in all topics of life."
          />
        </div>
        <Filter />
        {loading ? (
          <LoadingComponent message="loading Nfts" />
        ) : (
          <div className={style.featuredNfts_nfts}>
            {NFTs.map((el, i) => (
              <AuctionCard nft={el} key={i + 1} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FeaturedNFTs;
