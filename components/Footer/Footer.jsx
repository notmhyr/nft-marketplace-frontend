import React from "react";
import { RiSendPlaneFill } from "react-icons/ri";
import Link from "next/link";
import {
  TiSocialFacebook,
  TiSocialLinkedin,
  TiSocialTwitter,
  TiSocialYoutube,
  TiSocialInstagram,
  TiArrowSortedDown,
  TiArrowSortedUp,
} from "react-icons/ti";
// internal imports
import style from "./Footer.module.scss";
import { Logo } from "../componentIndex";
const Footer = () => {
  const helpCenterArr = [
    {
      name: "About",
      link: "aboutus",
    },
    {
      name: "Contact Us",
      link: "contactus",
    },
    {
      name: "Sign Up",
      link: "signUp",
    },
    {
      name: "Log In",
      link: "login",
    },
    {
      name: "Subscription",
      link: "subscription",
    },
  ];
  return (
    <footer className={style.footer}>
      <div className={style.footer_box}>
        <div className={style.footer_col1}>
          <Logo />
          <p>
            The world's first and largest digital marketplace for crypto
            collectibles and non-fungible tokens (NFTs). Buy, sell, and discover
            exclusive digital items.
          </p>
          <div className={style.footer_col1_socials}>
            <a href="#">
              <TiSocialFacebook />
            </a>
            <a href="#">
              <TiSocialInstagram />
            </a>
            <a href="#">
              <TiSocialTwitter />
            </a>
            <a href="#">
              <TiSocialLinkedin />
            </a>
            <a href="#">
              <TiSocialYoutube />
            </a>
          </div>
        </div>

        <div className={style.footer_col2}>
          <div className={style.footer_col2_left}>
            <strong>Discover</strong>
            <Link href="/collection/create">Collection</Link>
            <Link href="/nfts">All NFTs</Link>
            <Link href="/createNFT">Create NFT</Link>
            <Link href="/user/mynfts">My NFTs</Link>
          </div>

          <div className={style.footer_col2_right}>
            <strong>Help center</strong>
            {helpCenterArr.map((el, i) => (
              <Link href={el.link} key={i + 1}>
                {el.name}
              </Link>
            ))}
          </div>
        </div>

        <div className={style.footer_col3}>
          <strong>Subscribe</strong>
          <div className={style.footer_col3_inputBox}>
            <input type="email" placeholder="Enter your email" />
            <RiSendPlaneFill className={style.footer_col3_inputBox_icon} />
          </div>
          <p>
            Discover, collect, and sell extraordinary NFTs Galaxy is the world
            best and largest NFT marketplace
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
