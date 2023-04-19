import React from "react";
import { RiSendPlaneFill } from "react-icons/ri";
import Image from "next/image";
//internal imports
import style from "./Subscribe.module.scss";
import { Title } from "../componentIndex";
import images from "../../img";

const Subscribe = () => {
  return (
    <div className={style.subscribe}>
      <div className={style.subscribe_box}>
        <div className={style.subscribe_left}>
          <Title
            heading="Never miss a drop
"
            paragraph="Subcribe to our super-exclusive drop list and be the first to know abour upcoming drops"
          />
          <div className={style.subscribe_left_step}>
            <span>01</span>
            <p>Get more discount</p>
          </div>
          <div className={style.subscribe_left_step}>
            <span>02</span>
            <p>Get premium magazines</p>
          </div>

          <div className={style.subscribe_left_inputBox}>
            <input type="email" placeholder="Enter your email" />
            <RiSendPlaneFill className={style.subscribe_left_inputBox_icon} />
          </div>
        </div>
        <div className={style.subscribe_right}>
          <Image
            src={images.subscribe1}
            alt="subscribe"
            width={500}
            height={500}
          />
        </div>
      </div>
    </div>
  );
};

export default Subscribe;
