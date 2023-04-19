import React, { useEffect, useState } from "react";
import Link from "next/link";
import { FaRegImage } from "react-icons/fa";
import { MdHelpCenter } from "react-icons/md";
import { IoExitOutline } from "react-icons/io5";
import style from "./Profile.module.scss";
import { useAccount, useDisconnect } from "wagmi";
import { cutAddress } from "../../../utils/cutAddress";
import { TbCopy } from "react-icons/tb";
import { BsCheckLg } from "react-icons/bs";
const Profile = () => {
  const [mounted, setMounted] = useState(false);
  const [copied, setCopied] = useState(false);
  const { disconnect } = useDisconnect();
  const { address, isConnected } = useAccount();

  const handleCopy = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  useEffect(() => {
    setMounted(true);
  }, []);
  return (
    <div className={style.profile}>
      <div className={style.profile_account}>
        <div className={style.profile_account_avatar}>
          <w3m-avatar size="medium"></w3m-avatar>
        </div>

        {mounted && (
          <div className={style.profile_account_info}>
            <p>No name</p>
            <small>{cutAddress(address)}</small>
          </div>
        )}
        {!copied ? (
          <TbCopy onClick={handleCopy} className={style.profile_account_copy} />
        ) : (
          <BsCheckLg fontSize={12.5} />
        )}
      </div>

      <div className={style.profile_menu}>
        <div className={style.profile_menu_one_item}>
          <FaRegImage />
          <p>
            <Link href={"/user/mynfts"}>My NFTs</Link>
          </p>
        </div>

        <div className={style.profile_menu_one_item}>
          <MdHelpCenter />
          <p>
            <Link href={"/contactus"}>Help</Link>
          </p>
        </div>

        <div className={style.profile_menu_one_item}>
          <IoExitOutline />
          <p onClick={() => disconnect()}>Disconnect</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
