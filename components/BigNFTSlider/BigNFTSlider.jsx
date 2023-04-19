import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Autoplay, Navigation } from "swiper";
import "swiper/css/navigation";
import "swiper/css/effect-fade";
import style from "./BigNFTSlider.module.scss";
import NFTSliderCard from "./NFTSliderCard/NFTSliderCard";
import images from "../../img";
import axios from "axios";
const NFTSlider = ({ NFTs }) => {
  return (
    <div className={style.slider}>
      <div className={style.slider_box}>
        <Swiper
          modules={[Navigation, Autoplay]}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
          }}
          navigation={true}
          speed={800}
          slidesPerView={1}
          loop
          className={`${style.slider_swiper} bigSlider_swiper`}
        >
          {NFTs.map((item, i) => (
            <SwiperSlide key={i + 1}>
              <NFTSliderCard nft={item} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default NFTSlider;
