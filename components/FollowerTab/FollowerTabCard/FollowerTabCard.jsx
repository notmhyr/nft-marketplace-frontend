import React, { useState } from "react";
import Image from "next/image";
import { MdVerified } from "react-icons/md";
import { FiCheck } from "react-icons/fi";
//internal imports
import style from "./FollowerTabCard.module.scss";
import { Button } from "../../componentIndex";

const FollowerTabCard = ({ item }) => {
  const [following, setFollowing] = useState(false);

  const followMe = () => {
    setFollowing((prevState) => !prevState);
  };
  return (
    <div className={style.card}>
      <Image src={item.background} alt="background" width={300} height={300} />

      <div className={style.card_profile}>
        <Image src={item.user} alt="user" width={50} height={50} />
      </div>

      <div className={style.card_info}>
        <div className={style.card_info_name}>
          <h4>
            {item.name}
            <span>
              <MdVerified />
            </span>
          </h4>
          <p>12.321 ETH</p>
        </div>

        <div className={style.card_info_following}>
          {following ? (
            <Button
              btnName="Following"
              icon={<FiCheck fontSize={12} />}
              handleClick={followMe}
            />
          ) : (
            <Button btnName="Follow" handleClick={followMe} />
          )}
        </div>
      </div>
    </div>
  );
};

export default FollowerTabCard;
