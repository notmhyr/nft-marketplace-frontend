import React from "react";
import Image from "next/image";
import style from "./Service.module.scss";
import images from "../../img";
const Service = () => {
  return (
    <div className={style.service}>
      <div className={style.service_box}>
        <div className={style.service_item}>
          <Image
            src={images.service3}
            alt="Filter & Discover"
            width={100}
            height={100}
          />
          <p className={style.service_item_step}>
            <span>Step 1</span>
          </p>
          <h3>Connect Wallet</h3>
          <p>
            Connect with wallet, discover, buy NTFs, sell your NFTs and earn
            money
          </p>
        </div>

        <div className={style.service_item}>
          <Image
            src={images.service2}
            alt="Filter & Discover"
            width={100}
            height={100}
          />
          <p className={style.service_item_step}>
            <span>Step 2</span>
          </p>
          <h3>Filter & Discover</h3>
          <p>
            Connect with wallet, discover, buy NTFs, sell your NFTs and earn
            money
          </p>
        </div>

        <div className={style.service_item}>
          <Image
            src={images.service4}
            alt="Filter & Discover"
            width={100}
            height={100}
          />
          <p className={style.service_item_step}>
            <span>Step 3</span>
          </p>
          <h3>Create NFT</h3>
          <p>
            Connect with wallet, discover, buy NTFs, sell your NFTs and earn
            money
          </p>
        </div>

        <div className={style.service_item}>
          <Image
            src={images.service1}
            alt="Filter & Discover"
            width={100}
            height={100}
          />
          <p className={style.service_item_step}>
            <span>Step 4</span>
          </p>
          <h3>Start Trading</h3>
          <p>
            Connect with wallet, discover, buy NTFs, sell your NFTs and earn
            money
          </p>
        </div>
      </div>
    </div>
  );
};

export default Service;
