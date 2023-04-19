import React from "react";
import Image from "next/image";
import { MdVerified } from "react-icons/md";

import style from "./TopCollectionCard.module.scss";
import { useRouter } from "next/router";

const TopCollectionCard = ({ collection }) => {
  const router = useRouter();
  return (
    <div
      className={style.topCollectionCard}
      onClick={() => router.push(`/collection/${collection.id}`)}
    >
      <div className={style.topCollectionCard_images}>
        <Image
          src={collection?.nfts[0]?.image}
          alt="nft collection"
          width={500}
          height={300}
        />
        <div className={style.topCollectionCard_images_smallImg}>
          <Image
            src={collection?.nfts[1]?.image}
            alt="nft"
            width={200}
            height={200}
          />
          <Image
            src={collection?.nfts[2]?.image}
            alt="nft"
            width={200}
            height={200}
          />
          <Image
            src={collection?.nfts[3]?.image}
            alt="nft"
            width={200}
            height={200}
          />
        </div>
      </div>

      <div className={style.topCollectionCard_info}>
        <div className={style.topCollectionCard_info_name}>
          <h3>{collection.collectionName}</h3>
          {/* <div className={style.topCollectionCard_info_name_creator}>
            <Image src={item.user} alt="creator" width={45} height={45} />
            <span>creator</span>
            <strong>
              Mhyr Hosaini <MdVerified />
            </strong>
          </div> */}
        </div>
        <span className={style.topCollectionCard_info_value}>
          {collection.avg.toFixed(2)} ETH
        </span>
      </div>
    </div>
  );
};

export default TopCollectionCard;
