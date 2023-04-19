import React, { useEffect, useState } from "react";
import { HiBars3BottomRight } from "react-icons/hi2";
import Link from "next/link";
import Image from "next/image";
import { Web3Button } from "@web3modal/react";
// Internal imports
import style from "./Navbar.module.scss";
import images from "../../img";
import Button from "../Button/Button";
import Logo from "../Logo/Logo";
import Sidebar from "./Sidebar/Sidebar";
import Profile from "./Profile/Profile";
import { useAccount } from "wagmi";
import { useRouter } from "next/router";

const Navbar = () => {
  const [mounted, setMounted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { address, isConnected } = useAccount();

  const router = useRouter();

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

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    router.events.on("routeChangeStart", () => setSidebarOpen(false));
  }, [router]);
  return (
    <nav className={style.navbar}>
      <div className={style.navbar_left}>
        <Link href="/">
          <Logo />
        </Link>
      </div>

      <div className={style.navbar_middle}>
        <Link href="/collection/create" className={style.navbar_middle_link}>
          Collection
        </Link>
        <Link href="/nfts" className={style.navbar_middle_link}>
          NFTs
        </Link>
        <div className={style.navbar_dropdown}>
          <span>Help Center</span>
          <div className={style.navbar_dropdown_menu}>
            {helpCenterArr.map((el, i) => (
              <Link href={el.link} key={i + 1} className={style.helpCenter}>
                {el.name}
              </Link>
            ))}
          </div>
        </div>

        <Link href="/createNFT" className={style.navbar_middle_link}>
          Create NFT
        </Link>
      </div>

      <div className={style.navbar_right}>
        {!isConnected && mounted ? (
          <Web3Button icon="hide" label="Connect Wallet" />
        ) : (
          <div className={style.navbar_profile}>
            <div className={style.navbar_profile_avatar}>
              <w3m-avatar size="medium"></w3m-avatar>
            </div>

            <div className={style.navbar_profile_el}>
              <Profile />
            </div>
          </div>
        )}
      </div>

      <div className={style.navbar_bars} onClick={() => setSidebarOpen(true)}>
        <HiBars3BottomRight />
      </div>

      {sidebarOpen && (
        <div className={style.sidebar}>
          <Sidebar setSidebar={setSidebarOpen} />
        </div>
      )}
    </nav>
  );
};

export default Navbar;
