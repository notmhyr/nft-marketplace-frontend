import React, { useEffect, useState } from "react";

import style from "../styles/home.module.scss";
import {
  TopCollection,
  FollowerTab,
  Service,
  HeroSection,
  FeaturedNFTs,
  Subscribe,
  SmallNFTSlider,
  WebsiteHead,
  AuctionSlider,
} from "../components/componentIndex";
import axios from "axios";

const index = () => {
  const [NFTs, setNFTs] = useState([]);
  const [isLoadingNFTs, setIsLoadingNFTs] = useState(false);

  const fetchListedNFTs = async () => {
    setIsLoadingNFTs(true);

    try {
      const { data } = await axios.get(`/api/listNFT/getAuctions`);
      if (data.status == "success" && data.data.nfts.length > 0) {
        // slice nft to only 20 nfts
        const filteredNFT = data.data.nfts.slice(0, 20);
        const nfts = await Promise.all(
          filteredNFT.map(async (el) => {
            const nft = await fetchTokenURIData(el.tokenURI);

            return { ...el, ...nft };
          })
        );
        setNFTs(nfts);
      }
      setIsLoadingNFTs(false);
    } catch (error) {
      setIsLoadingNFTs(false);
      console.log(error);
    }
  };

  // fetch token uri data (name,image,description)
  const fetchTokenURIData = async (tokenURI) => {
    try {
      const { data } = await axios.get(`https://ipfs.io/ipfs/${tokenURI}`);
      data.image = `https://ipfs.io/ipfs/${data.image}`;
      return data;
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchListedNFTs();
  }, []);

  return (
    <div className={style.home}>
      <WebsiteHead title="Home" />
      <div className={style.grayCircle}></div>

      <HeroSection />
      <Service />
      <AuctionSlider NFTs={NFTs?.slice(0, 5)} />
      <FollowerTab />
      <TopCollection />
      <FeaturedNFTs NFTs={NFTs?.slice(5, 14)} />
      <Subscribe />
      <SmallNFTSlider />
    </div>
  );
};

export default index;
