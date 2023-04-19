import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { MdOutlineClose } from "react-icons/md";
import {
  TiSocialFacebook,
  TiSocialLinkedin,
  TiSocialTwitter,
  TiSocialYoutube,
  TiSocialInstagram,
  TiArrowSortedDown,
  TiArrowSortedUp,
} from "react-icons/ti";
import { FaRegImage } from "react-icons/fa";
import { MdHelpCenter } from "react-icons/md";
import { IoExitOutline } from "react-icons/io5";
import style from "./Sidebar.module.scss";
import Logo from "../../Logo/Logo";
import { useAccount, useDisconnect } from "wagmi";
import { Web3Button } from "@web3modal/react";
import { cutAddress } from "../../../utils/cutAddress";
import { TbCopy } from "react-icons/tb";
import { BsCheckLg } from "react-icons/bs";

const Sidebar = ({ setSidebar }) => {
  const [helpCenter, setHelpCenter] = useState(false);
  const [profile, setProfile] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [copied, setCopied] = useState(false);

  const { disconnect } = useDisconnect();
  const { address, isConnected } = useAccount();

  useEffect(() => {
    setMounted(true);
  }, []);
  const helpCenterArr = [
    {
      name: "About",
      link: "/aboutus",
    },
    {
      name: "Contact Us",
      link: "/contactus",
    },
    {
      name: "Sign Up",
      link: "/signUp",
    },
    {
      name: "Log In",
      link: "/login",
    },
    {
      name: "Subscription",
      link: "/subscription",
    },
  ];

  const handleCopy = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };
  return (
    <div className={style.sidebar}>
      <MdOutlineClose
        className={style.sidebar_closeBtn}
        onClick={() => setSidebar(false)}
      />

      <div className={style.sidebar_box}>
        <Logo />
        <p>
          Discover the most outstanding articles on all topics of NFT own
          stories and share them
        </p>

        <div className={style.sidebar_socials}>
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

      <div className={style.sidebar_menu}>
        {isConnected && (
          <div className={style.sidebar_profile}>
            <div
              className={style.sidebar_profileTitle}
              onClick={() => setProfile((prevState) => !prevState)}
            >
              <div className={style.sidebar_profileTitle_left}>
                <div className={style.sidebar_profileTitle_left_avatar}>
                  <w3m-avatar size="medium"></w3m-avatar>
                </div>
                {mounted && (
                  <div>
                    <p>No name</p>
                    <small>{cutAddress(address)}</small>
                  </div>
                )}
                {!copied ? (
                  <TbCopy onClick={handleCopy} fontSize={18} />
                ) : (
                  <BsCheckLg fontSize={12.5} />
                )}
              </div>

              {profile ? <TiArrowSortedUp /> : <TiArrowSortedDown />}
            </div>
            {profile && (
              <div className={style.sidebar_profile_menu}>
                <div className={style.profile_menu_item}>
                  <FaRegImage />
                  <p>
                    <Link href={"/mynfts"}>My NFTs</Link>
                  </p>
                </div>

                <div className={style.profile_menu_item}>
                  <MdHelpCenter />
                  <p>
                    <Link href={"/contactus"}>Help</Link>
                  </p>
                </div>

                <div className={style.profile_menu_item}>
                  <IoExitOutline />
                  <p onClick={() => disconnect()}>Disconnect</p>
                </div>
              </div>
            )}
          </div>
        )}

        <Link href="/">Home</Link>
        <Link href="/collection/create">Collection</Link>
        <Link href="/nfts">NFTs</Link>

        <div className={style.sidebar_menu_help}>
          <div
            onClick={() => setHelpCenter((prevState) => !prevState)}
            className={style.sidebar_menu_helpTitle}
          >
            <span>Help Center</span>
            {helpCenter ? <TiArrowSortedUp /> : <TiArrowSortedDown />}
          </div>

          {helpCenter && (
            <div className={style.sidebar_menu_help_dropDown}>
              {helpCenterArr.map((el, i) => (
                <Link href={el.link} key={i + 1} className={style.helpCenter}>
                  {el.name}
                </Link>
              ))}
            </div>
          )}
        </div>

        <Link href="createNFT">Create NFT</Link>
      </div>

      {!isConnected && (
        <div className={style.sidebar_button}>
          <Web3Button icon="hide" label="Connect Wallet" />
        </div>
      )}
    </div>
  );
};

export default Sidebar;
