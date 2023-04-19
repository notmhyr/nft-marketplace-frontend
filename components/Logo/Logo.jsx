import React from "react";
import style from "./Logo.module.scss";
import Head from "next/head";

const Logo = () => {
  return (
    <div className={`${style.logo}`}>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link
          href="https://fonts.googleapis.com/css2?family=Shantell+Sans:ital,wght@1,700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <h3 className={style.logo_title}>galaxy</h3>
      <span className={style.logo_name}>nft marketplace</span>
    </div>
  );
};

export default Logo;
