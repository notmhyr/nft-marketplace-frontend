import React, { useState } from "react";
import { RiUserFollowFill } from "react-icons/ri";
import { FaUserAlt } from "react-icons/fa";
// internal imports
import style from "./FollowerTab.module.scss";
import Button from "../Button/Button";
import images from "../../img";
import FollowerTabCard from "./FollowerTabCard/FollowerTabCard";
import { useRouter } from "next/router";

const FollowerTab = () => {
  const [popular, setPopular] = useState(true);
  const [following, setFollowing] = useState(false);

  const router = useRouter();
  const popularArray = [
    {
      background: images.creatorbackground1,
      user: images.user1,
      name: "John Doe",
    },
    {
      background: images.creatorbackground2,
      user: images.user2,
      name: "Ted Carrie",
    },
    {
      background: images.creatorbackground3,
      user: images.user3,
      name: "Sarah Freeman",
    },
    {
      background: images.creatorbackground4,
      user: images.user4,
      name: "James Smith",
    },
    {
      background: images.creatorbackground5,
      user: images.user5,
      name: "AI Bean",
    },
    {
      background: images.creatorbackground6,
      user: images.user6,
      name: "Boris Bell",
    },
    {
      background: images.creatorbackground1,
      user: images.user3,
      name: "Hellen Miller",
    },
    {
      background: images.creatorbackground3,
      user: images.user1,
      name: "Lucky Turner",
    },
  ];
  const FollowingArray = [
    {
      background: images.creatorbackground3,
      user: images.user3,
      name: "Lucky Turner",
    },
    {
      background: images.creatorbackground4,
      user: images.user4,
      name: "Boris Bell",
    },
    {
      background: images.creatorbackground5,
      user: images.user5,
      name: "James Smith",
    },
    {
      background: images.creatorbackground6,
      user: images.user6,
      name: "Hellen Miller",
    },
    {
      background: images.creatorbackground1,
      user: images.user1,
      name: "John Doe",
    },
    {
      background: images.creatorbackground2,
      user: images.user2,
      name: "Sarah Freeman",
    },
  ];

  const openPopular = () => {
    if (!popular) {
      setPopular(true);
      setFollowing(false);
    }
  };

  const openFollowing = () => {
    if (!following) {
      setFollowing(true);
      setPopular(false);
    }
  };
  return (
    <div className={style.followerTab}>
      <div className={style.followerTab_title}>
        <h2>Top Creator List</h2>
      </div>

      <div className={style.followerTab_tabs}>
        <Button
          btnName="Popular"
          icon={<FaUserAlt fontSize={12} />}
          handleClick={openPopular}
        />
        <Button
          btnName="Following"
          icon={<RiUserFollowFill fontSize={12} />}
          handleClick={openFollowing}
        />
      </div>

      {popular && (
        <div className={style.followerTab_users}>
          {popularArray.map((el, i) => (
            <FollowerTabCard item={el} key={i + 1} />
          ))}
        </div>
      )}

      {following && (
        <div className={style.followerTab_users}>
          {FollowingArray.map((el, i) => (
            <FollowerTabCard item={el} key={i + 1} />
          ))}
        </div>
      )}

      <div className={style.followerTab_btn}>
        <Button btnName="Show me more" />
        <Button
          btnName="Become creator"
          reverse={true}
          handleClick={() => router.push("/createNFT")}
        />
      </div>
    </div>
  );
};

export default FollowerTab;
