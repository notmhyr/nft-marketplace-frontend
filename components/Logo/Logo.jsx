import React from "react";
import style from "./Logo.module.scss";

const Logo = () => {
  return (
    <div className={style.logo}>
      <h3 className={style.logo_title}>galaxy</h3>
      <span className={style.logo_name}>nft marketplace</span>
    </div>
  );
};

export default Logo;
