import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

import style from "../../styles/collection.module.scss";
import { NFTCard, WebsiteHead } from "../../components/componentIndex";
import axios from "axios";

const Collection = () => {
  const [Collection, setCollection] = useState([]);

  const router = useRouter();
  const { id } = router.query;

  // fetch single collection form api
  const fetchCollections = async () => {
    try {
      const { data } = await axios.get(`/api/collections/${id}`);

      const { collection } = data.data;
      // calculate avg of prices
      let sum = 0;
      collection.listedNFTs.map((nft) => {
        sum += nft.price;
      });
      const avg = sum / collection.listedNFTs.length;

      const nfts = await Promise.all(
        collection.listedNFTs.map(async (nft) => {
          const nftURIData = await fetchTokenURIData(nft.tokenURI);
          return { ...nft, ...nftURIData };
        })
      );

      setCollection({
        collectionAddress: collection.collectionAddress,
        collectionName: collection.collectionName,
        avg,
        nfts,
      });
    } catch (error) {
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
    if (id) {
      fetchCollections();
    }
  }, [id]);

  return (
    <div className={style.collection}>
      <WebsiteHead title={Collection?.collectionName} />

      <div className={style.collection_header}>
        <h3>{Collection?.collectionName}</h3>

        <div className={style.collection_header_avg}>
          <span>Avg price :</span>
          <strong>{Collection?.avg?.toFixed(2)} ETH</strong>
        </div>
      </div>

      <div className={style.collection_box}>
        {Collection?.nfts?.map((el, i) => (
          <NFTCard nft={el} key={i} />
        ))}
      </div>
    </div>
  );
};

export default Collection;
