import React, { useEffect, useState } from "react";
import {
  BsFillAlarmFill,
  BsFillCalendarDateFill,
  BsCalendar3,
} from "react-icons/bs";
//internal imports
import style from "./TopCollection.module.scss";
import images from "../../img";
import TopCollectionCard from "./TopCollectionCard/TopCollectionCard";
import { Button } from "../componentIndex";
import axios from "axios";
const TopCollection = () => {
  const [Collections, setCollections] = useState([]);

  // fetch all collections form api
  const fetchCollections = async () => {
    try {
      const { data } = await axios.get(`/api/collections/getCollections`);
      const filteredCollection = data.data.collections.filter(
        (coll) => coll.listedNFTs.length >= 3
      );
      // slice collections to only 6 nfts
      const slicedCollection = filteredCollection.slice(0, 6);
      const collections = await Promise.all(
        slicedCollection.map(async (el) => {
          // calculate avg of prices
          let sum = 0;
          el.listedNFTs.map((nft) => {
            sum += nft.price;
          });
          const avg = sum / el.listedNFTs.length;

          const nfts = await Promise.all(
            el.listedNFTs.map(async (nft) => {
              const nftURIData = await fetchTokenURIData(nft.tokenURI);
              return { ...nft, ...nftURIData };
            })
          );

          return {
            id: el._id,
            collectionAddress: el.collectionAddress,
            collectionName: el.collectionName,
            avg,
            nfts,
          };
        })
      );
      setCollections(collections);
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
    fetchCollections();
  }, []);
  return (
    <div className={style.topCollection}>
      <div className={style.followerTab_title}>
        <h2>Top Collection List</h2>
      </div>

      <div className={style.topCollection_tabs}>
        <Button btnName="24 hours" icon={<BsFillAlarmFill fontSize={12} />} />
        <Button btnName="7 days" icon={<BsCalendar3 fontSize={12} />} />
        <Button
          btnName="30 days"
          icon={<BsFillCalendarDateFill fontSize={12} />}
        />
      </div>

      <div className={style.topCollection_collections}>
        {Collections.map((el, i) => (
          <TopCollectionCard collection={el} key={i + 1} />
        ))}
      </div>
    </div>
  );
};

export default TopCollection;
