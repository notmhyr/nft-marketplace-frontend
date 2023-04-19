import React, { useState } from "react";
import { TiArrowSortedDown, TiArrowSortedUp } from "react-icons/ti";
import {
  FaFilter,
  FaAngleDown,
  FaAngleUp,
  FaWallet,
  FaMusic,
  FaVideo,
  FaImages,
  FaUserAlt,
} from "react-icons/fa";
import { MdVerified } from "react-icons/md";

import style from "./Filter.module.scss";
import { Button, Title } from "../componentIndex";
const Filter = () => {
  const [filter, setFilter] = useState(false);
  const [image, setImage] = useState(false);
  const [video, setVideo] = useState(false);
  const [music, setMusic] = useState(false);

  const openFilter = () => {
    setFilter((prevState) => !prevState);
  };
  const openImage = () => {
    setImage((prevState) => !prevState);
  };
  const openVideo = () => {
    setVideo((prevState) => !prevState);
  };
  const openMusic = () => {
    setMusic((prevState) => !prevState);
  };

  return (
    <div className={style.filter}>
      <div className={style.filter_box}>
        <div className={style.filter_top}>
          <div className={style.filter_top_left}>
            <button>NFTs</button>
            <button>Arts</button>
            <button>Musics</button>
            <button>Sports</button>
            <button>Photography</button>
          </div>

          <div className={style.filter_top_right}>
            <button onClick={openFilter}>
              Filter {""} {filter ? <TiArrowSortedUp /> : <TiArrowSortedDown />}
            </button>
          </div>
        </div>

        {filter && (
          <div className={style.filter_bottom}>
            <button
              onClick={openImage}
              className={`${image ? style.active : ""}`}
            >
              Images <FaImages fontSize={12} />
            </button>
            <button
              onClick={openMusic}
              className={`${music ? style.active : ""}`}
            >
              Musics <FaMusic fontSize={12} />
            </button>
            <button
              onClick={openVideo}
              className={`${video ? style.active : ""}`}
            >
              Videos <FaVideo fontSize={12} />
            </button>
            <button className={style.active}>
              Verified <MdVerified fontSize={12} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Filter;
