import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Navigation } from "swiper";
import "swiper/css/navigation";
import { BsArrowUpRight } from "react-icons/bs";

//internal imports
import style from "./SmallNFTSlider.module.scss";
import images from "../../img";
import { Button, NFTCard, Title } from "../componentIndex";
import axios from "axios";
import { useRouter } from "next/router";
const SmallNFTSlider = () => {
  const [NFTs, setNFTs] = useState([]);
  const [isLoadingNFTs, setIsLoadingNFTs] = useState(false);

  const router = useRouter();

  // fetch user's listed nfts form api
  const fetchListedNFTs = async () => {
    setIsLoadingNFTs(true);

    try {
      const { data } = await axios.get(`/api/listNFT/getListedNFTs`);
      if (data.status == "success" && data.data.nfts.length > 0) {
        const filteredNFTs = data.data.nfts.slice(0, 14);
        const nfts = await Promise.all(
          filteredNFTs.map(async (el) => {
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
    <div className={style.smallNftSlider}>
      <div className={style.smallNftSlider_title}>
        <Title
          heading="Explore Popular NFTs"
          paragraph="Buy NFT and enjoy your life"
        />
      </div>
      <Swiper
        modules={[Navigation]}
        navigation={true}
        grabCursor
        breakpoints={{
          300: {
            slidesPerView: 1,
            spaceBetween: 2,
          },
          600: {
            slidesPerView: 2,
            spaceBetween: 10,
          },

          890: {
            slidesPerView: 3,
            spaceBetween: 20,
          },
          1100: {
            slidesPerView: 4,
            spaceBetween: 22,
          },
        }}
        speed={850}
        className={`${style.smallNftSlider_swiper} smallNftSlider_swiper`}
      >
        {NFTs.map((nft, i) => (
          <SwiperSlide key={i + 1}>
            <NFTCard nft={nft} />
          </SwiperSlide>
        ))}
      </Swiper>

      <Button
        btnName="See more"
        reverse={true}
        icon={<BsArrowUpRight fontSize={12} />}
        handleClick={() => router.push("/nfts")}
      />
    </div>
  );
};

export default SmallNFTSlider;
