import React, { useEffect, useState } from "react";
import axios from "axios";

//internal imports
import {
  Filter,
  LoadingComponent,
  NFTCard,
  WebsiteHead,
} from "../../components/componentIndex";
import style from "../../styles/nfts.module.scss";
const NFTs = () => {
  const [NFTs, setNFTs] = useState([]);
  const [isLoadingNFTs, setIsLoadingNFTs] = useState(false);

  // fetch user's listed nfts form api
  const fetchListedNFTs = async () => {
    setIsLoadingNFTs(true);

    try {
      const { data } = await axios.get(`/api/listNFT/getListedNFTs`);
      if (data.status == "success" && data.data.nfts.length > 0) {
        const nfts = await Promise.all(
          data.data.nfts.map(async (el) => {
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
    <div className={style.nft}>
      <WebsiteHead title="All NFTs" />

      <h2>All available NFTs</h2>
      <Filter />
      {isLoadingNFTs ? (
        <LoadingComponent message="loading all Nfts" />
      ) : NFTs?.length === 0 ? (
        <div className={style.message}>
          <p>No available NFTs</p>
        </div>
      ) : (
        <div className={style.nft_box}>
          {NFTs?.map((el, i) => (
            <NFTCard nft={el} key={i} />
          ))}
        </div>
      )}
    </div>
  );
};

export default NFTs;
