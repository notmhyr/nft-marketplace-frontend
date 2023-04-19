import React from "react";
import Image from "next/image";
import style from "./HeroSection.module.scss";
import Button from "../Button/Button";
import images from "../../img";
import { useRouter } from "next/router";
const HeroSection = () => {
  const router = useRouter();
  return (
    <div className={style.heroSection}>
      <div className={style.heroSection_left}>
        <h1>Discover, collect, and sell NFTs</h1>
        <p>
          Discover the most outstanding NTFs in all topics of life. Creative
          your NTFs and sell them
        </p>
        <Button
          btnName="Create NFT"
          handleClick={() => router.push("/createNFT")}
        />

        <div className={style.heroSection_status}>
          <div className={style.heroSection_status_item}>
            <h3>20k+</h3>
            <span>Active User</span>
          </div>
          <div className={style.heroSection_status_item}>
            <h3>35k+</h3>
            <span>Our Artworks</span>
          </div>
          <div className={style.heroSection_status_item}>
            <h3>50k+</h3>
            <span>Available Artist</span>
          </div>
          <div className={style.heroSection_status_item}>
            <h3>12k+</h3>
            <span>Trending Art</span>
          </div>
        </div>
      </div>

      <div className={style.heroSection_right}>
        <div className={style.heroSection_right_top}>
          <Image
            src={images.hero1}
            alt="Hero section"
            width={300}
            height={400}
            className={style.heroSection_right_hero1}
          />
          <Image
            src={images.hero2}
            alt="Hero section"
            width={300}
            height={400}
            className={style.heroSection_right_hero2}
          />
        </div>
        <div className={style.heroSection_right_bottom}>
          <Image
            src={images.hero3}
            alt="Hero section"
            width={300}
            height={400}
            className={style.heroSection_right_hero3}
          />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
