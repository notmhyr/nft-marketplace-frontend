import React, { useContext, useEffect, useState } from "react";
import Image from "next/image";
import { TiArrowSortedDown, TiArrowSortedUp } from "react-icons/ti";
import { FiHeart, FiEye } from "react-icons/fi";
import { FaWallet } from "react-icons/fa";
import { TfiAlarmClock } from "react-icons/tfi";
import { MdOutlineLocalOffer } from "react-icons/md";
import { useRouter } from "next/router";
import {
  useAccount,
  useContractEvent,
  useContractRead,
  useContractWrite,
  useNetwork,
} from "wagmi";
import axios from "axios";
import Identicon from "react-identicons";
import { toast } from "react-toastify";
import { ethers } from "ethers";

// internal imports
import style from "../../styles/NFTDetail.module.scss";
import {
  AuctionModel,
  Button,
  LoadingComponent,
  PLaceBidModel,
  WebsiteHead,
} from "../../components/componentIndex";
import { OfferModel } from "../../components/componentIndex";
import getConfigs from "../../utils/contractConfigs";
import { cutAddress } from "../../utils/cutAddress";
import { convertToWei } from "../../utils/convertUnits";
import { countDownTimer, isEnded } from "../../utils/date";
import { ValidateNetworkContext } from "../../context/ValidateNetwork";

const NFTDetail = () => {
  const [NFT, setNFT] = useState("");
  const [descriptionOpen, setDescriptionOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [offerCreator, setOfferCreator] = useState("");

  //count down data
  const [countDown, setCountDown] = useState("");

  const { validateNetwork } = useContext(ValidateNetworkContext);

  // contract config (address,abi)
  const [marketplace, setMarketplace] = useState();
  const [auction, setAuction] = useState();

  // loading state
  const [isLoadingNFT, setIsLoadingNFT] = useState(false);

  // for open and close model
  const [isOfferOpen, setIsOfferOpen] = useState(false);
  const [isAuctionOpen, setIsAuctionOpen] = useState(false);
  const [isPlaceBidOpen, setIsPlaceBidOpen] = useState(false);

  // check if the page is mounted to prevent hydration error
  const [mounted, setMounted] = useState(false);

  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();
  const chainId = chain?.id.toString(); // current chain id

  const router = useRouter();
  const { id } = router.query;

  const fetchNFT = async () => {
    setIsLoadingNFT(true);
    try {
      const { data } = await axios.get(`/api/listNFT/${id}`);
      if (data.status == "success") {
        const returnedNFT = data.data.nft;
        const tokenURIData = await fetchTokenURIData(returnedNFT.tokenURI);

        setNFT({ ...returnedNFT, ...tokenURIData });
        setIsLoadingNFT(false);
      }
    } catch (error) {
      setNFT(null);
      setIsLoadingNFT(false);
      console.log(error);
    }
  };

  // fetch token uri data (name,image,description)
  const fetchTokenURIData = async (tokenURI) => {
    try {
      const { data } = await axios.get(`https://ipfs.io/ipfs/${tokenURI}`);
      data.image = `https://ipfs.io/ipfs/${data.image}`;
      return data;
    } catch (e) {
      console.log(e);
    }
  };

  // function for handle opening model
  const openOfferModel = () => {
    setIsOfferOpen(true);
  };
  const openAuctionModel = () => {
    setIsAuctionOpen(true);
  };

  const openPlaceBidModel = () => {
    setIsPlaceBidOpen(true);
  };

  // props for model
  const handleOfferCloseBtn = () => {
    setIsOfferOpen(false);
  };
  const handleAuctionCloseBtn = () => {
    setIsAuctionOpen(false);
  };

  const handlePlaceBidCloseBtn = () => {
    setIsPlaceBidOpen(false);
  };

  //wagmi hooks

  const { data: auctionData } = useContractRead({
    ...auction,
    functionName: "getAuction",
    args: [NFT?.nftAddress, NFT?.tokenId],
    watch: true,
    select: (data) => {
      return {
        owner: data.auctionOwner,
        minBid: Number(ethers.utils.formatEther(data.minBid)),
        startTime: data.startTime.toString(),
        endTime: data.endTime.toString(),
      };
    },
  });

  const { data: topBid } = useContractRead({
    ...auction,
    functionName: "getHighestBidder",
    args: [NFT?.nftAddress, NFT?.tokenId],
    watch: true,
    select: (data) => {
      return {
        bidder: data.bidder,
        bid: Number(ethers.utils.formatEther(data.bid)),
      };
    },
  });

  const { write: cancelAuction, isLoading: isCancelAuctionLoading } =
    useContractWrite({
      ...auction,
      functionName: "cancelAuction",
      args: [NFT?.nftAddress, NFT?.tokenId],

      onSuccess() {
        toast.success("canceled the auction successfully");
      },
      onError(e) {
        toast.error(e.reason);
        console.log(e);
      },
    });

  const { write: resultAuction, isLoading: isResultAuctionLoading } =
    useContractWrite({
      ...auction,
      functionName: "resultAuction",
      args: [NFT?.nftAddress, NFT?.tokenId],

      onSuccess() {
        toast.success("resulted the auction successfully");
      },
      onError(e) {
        toast.error(e.reason);
        console.log(e);
      },
    });

  // cancel listing
  const { write: cancelListing, isLoading: isCancelListingLoading } =
    useContractWrite({
      ...marketplace,
      functionName: "cancelListing",
      args: [NFT?.nftAddress, NFT?.tokenId],

      onSuccess() {
        toast.success("canceled the listing successfully");
      },
      onError(e) {
        toast.error(e.reason);
        console.log(e);
      },
    });

  // buy nft function
  const { write: buyNFT, isLoading: loadingBuy } = useContractWrite({
    ...marketplace,
    functionName: "buyItem",
    args: [NFT?.nftAddress, NFT?.tokenId],
    overrides: {
      value: convertToWei(NFT?.price),
    },
    onSuccess() {
      toast.success("bought the NFT successfully");
    },
    onError(e) {
      toast.error(e.reason);
      console.log(e);
    },
  });

  // accept offer function
  const { write: acceptOffer, isLoading: loadingAcceptOffer } =
    useContractWrite({
      ...marketplace,
      functionName: "acceptOffer",
      args: [NFT?.nftAddress, NFT?.tokenId, offerCreator],

      onSuccess() {
        toast.success("accepted offer successfully");
        router.replace("/");
      },
      onError(e) {
        toast.error(e.reason);
        console.log(e);
      },
    });

  // event listener for buying nft
  useContractEvent({
    ...marketplace,
    eventName: "ItemSold",
    async listener(seller, buyer, nft, tokenId) {
      try {
        const { data: deleteRes } = await axios.delete(
          "/api/listNFT/deleteListing",
          {
            data: {
              nftAddress: nft,
              owner: seller,
              tokenId: tokenId.toString(),
            },
          }
        );

        const { date: nftRes } = await axios.post("/api/nfts/createNFT", {
          collectionAddress: nft,
          owner: buyer,
          tokenId: tokenId.toString(),
          tokenURI: NFT?.tokenURI,
        });

        console.log("nft deleted from listing and added to nfts");
      } catch (error) {
        console.log(error);
      }
    },
    once: true,
  });

  // event listener for resulting auction
  useContractEvent({
    ...auction,
    eventName: "AuctionResulted",
    async listener(oldOwner, nft, tokenId, winner, winingPrice) {
      try {
        const { data: deleteRes } = await axios.delete(
          "/api/listNFT/deleteListing",
          {
            data: {
              nftAddress: nft,
              owner: oldOwner,
              tokenId: tokenId.toString(),
            },
          }
        );

        const { date: nftRes } = await axios.post("/api/nfts/createNFT", {
          collectionAddress: nft,
          owner: winner,
          tokenId: tokenId.toString(),
          tokenURI: NFT?.tokenURI,
        });

        console.log("nft deleted from listing and added to nfts");
        router.replace("/");
      } catch (error) {
        console.log(error);
      }
    },
  });

  // event listener for canceling the listing
  useContractEvent({
    ...marketplace,
    eventName: "ItemCanceled",
    async listener(owner, nftAddress, tokenId) {
      try {
        const { data: deleteRes } = await axios.delete(
          "/api/listNFT/deleteListing",
          {
            data: {
              nftAddress,
              owner,
              tokenId: tokenId.toString(),
            },
          }
        );

        const { date: nftRes } = await axios.post("/api/nfts/createNFT", {
          collectionAddress: nftAddress,
          owner,
          tokenId: tokenId.toString(),
          tokenURI: NFT?.tokenURI,
        });

        console.log("nft deleted from listing and added to nfts");
        router.replace("/user/mynfts");
      } catch (error) {}
    },
  });

  // event listener for cancel auction
  useContractEvent({
    ...auction,
    eventName: "AuctionCanceled",
    async listener(nft, tokenId) {
      try {
        const { data } = await axios.post("/api/listNFT/createAuction", {
          nftAddress: nft,
          tokenId: tokenId.toString(),
          auction: {},
        });

        console.log("auction deleted in to db");
      } catch (error) {
        console.log(error);
      }
    },
  });

  // event listener for update current bid in auction
  useContractEvent({
    ...auction,
    eventName: "BidPlaced",
    async listener(nft, tokenId, bidder, bid) {
      try {
        const { data } = await axios.post("/api/listNFT/updateCurrentBid", {
          nftAddress: nft,
          tokenId: tokenId.toString(),
          bid: ethers.utils.formatEther(bid),
        });

        console.log("new bid added in to db");
      } catch (error) {
        console.log(error);
      }
    },
  });

  useEffect(() => {
    setMounted(true);
    // get contract configs
    const { marketplaceConfig, auctionConfig } = getConfigs(chainId);
    setMarketplace(marketplaceConfig);
    setAuction(auctionConfig);
  }, []);

  useEffect(() => {
    if (id) {
      fetchNFT();
    }
  }, [id]);

  useEffect(() => {
    // check if auction data is loaded
    if (auctionData?.minBid > 0) {
      const timer = setInterval(() => {
        const newCountDown = countDownTimer(
          auctionData.startTime,
          auctionData.endTime
        );
        setCountDown(newCountDown);
      }, 1000);

      return () => {
        clearInterval(timer);
      };
    }
  }, [auctionData]);

  useEffect(() => {
    if (offerCreator) {
      validateNetwork(acceptOffer);
    }
  }, [offerCreator]);

  if (mounted && !isConnected) {
    return (
      <div className={style.message}>
        <p>Please connect your wallet</p>
      </div>
    );
  }

  if (mounted && isLoadingNFT) {
    return <LoadingComponent message="loading the NFt" />;
  }

  if (mounted && NFT === null) {
    return (
      <div className={style.message}>
        <p>This NFT doesn't exist</p>
      </div>
    );
  }

  return (
    <div className={style.nft}>
      <WebsiteHead title={NFT?.name} />

      {mounted && (
        <div>
          <OfferModel
            handleCloseBtn={handleOfferCloseBtn}
            isOpen={isOfferOpen}
            marketplaceConfig={marketplace}
            nftAddress={NFT?.nftAddress}
            tokenId={NFT?.tokenId}
            fetchNFT={fetchNFT}
          />

          <AuctionModel
            nftAddress={NFT?.nftAddress}
            tokenId={NFT?.tokenId}
            isOpen={isAuctionOpen}
            handleCloseBtn={handleAuctionCloseBtn}
            auctionConfig={auction}
          />

          <PLaceBidModel
            nftAddress={NFT?.nftAddress}
            tokenId={NFT?.tokenId}
            isOpen={isPlaceBidOpen}
            handleCloseBtn={handlePlaceBidCloseBtn}
            minBid={auctionData?.minBid}
            currentBid={topBid?.bid}
            auctionConfig={auction}
          />
        </div>
      )}

      <div className={style.nft_left}>
        <Image src={NFT?.image} alt="nft" width={550} height={550} />

        <div className={style.nft_left_tab}>
          <div
            className={style.nft_left_tab_dropDown}
            onClick={() => setDescriptionOpen((prevState) => !prevState)}
          >
            <span>Description</span>{" "}
            {descriptionOpen ? <TiArrowSortedUp /> : <TiArrowSortedDown />}
          </div>
          {descriptionOpen && <p>{NFT?.description}</p>}
        </div>

        <div className={style.nft_left_tab}>
          <div
            className={style.nft_left_tab_dropDown}
            onClick={() => setDetailOpen((prevState) => !prevState)}
          >
            <span>Details</span>{" "}
            {detailOpen ? <TiArrowSortedUp /> : <TiArrowSortedDown />}
          </div>

          {detailOpen && (
            <div>
              <div className={style.nft_left_tab_collectionAddress}>
                <span>Collection address</span>
                <span>{NFT?.nftAddress}</span>
              </div>

              <div className={style.nft_left_tab_tokenId}>
                <span>Token id :</span> <span>{NFT?.tokenId}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className={style.nft_right}>
        <h2>{NFT?.name}</h2>

        <div className={style.nft_right_stats}>
          <div className={style.nft_right_stats_child}>
            <FiEye fontSize={27} /> 1 view
          </div>

          <div className={style.nft_right_stats_child}>
            <FiHeart fontSize={27} /> 0 favorites
          </div>
        </div>

        <div className={style.nft_right_creator}>
          <Identicon
            string={NFT?.owner}
            size={40}
            className={style.nft_right_creator_icon}
          />

          <div className={style.nft_right_creator_stats}>
            <span>creator</span>
            <strong>
              {NFT?.owner === address && mounted
                ? "You"
                : cutAddress(NFT?.owner)}
            </strong>
          </div>
        </div>

        {auctionData?.minBid !== 0 && mounted && (
          <div>
            {countDown === false ? (
              <div>
                <p>auction is ended</p>
              </div>
            ) : (
              <div className={style.nft_right_auction}>
                <div className={style.nft_right_auction_endsIn}>
                  <TfiAlarmClock fontSize={27} />
                  <span>Auction {countDown?.message} in :</span>
                </div>

                <div className={style.nft_right_auction_endTime}>
                  <div className={style.nft_right_auction_endTime_box}>
                    <span>{countDown?.days}</span>
                    <span>days</span>
                  </div>

                  <span className={style.nft_right_auction_endsIn_colon}>
                    :
                  </span>

                  <div className={style.nft_right_auction_endTime_box}>
                    <span>{countDown?.hours}</span>
                    <span>hours</span>
                  </div>

                  <span className={style.nft_right_auction_endsIn_colon}>
                    :
                  </span>

                  <div className={style.nft_right_auction_endTime_box}>
                    <span>{countDown?.minutes}</span>
                    <span>minutes</span>
                  </div>
                  <span className={style.nft_right_auction_endsIn_colon}>
                    :
                  </span>

                  <div className={style.nft_right_auction_endTime_box}>
                    <span>{countDown?.seconds}</span>
                    <span>seconds</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        <div className={style.nft_right_price}>
          {auctionData?.minBid !== 0 && mounted ? (
            <div className={style.nft_right_price_box}>
              <small>Current Bid</small>
              <span>{topBid?.bid} ETH</span>
            </div>
          ) : (
            <div className={style.nft_right_price_box}>
              <small>price</small>
              <span>{NFT?.price} ETH</span>
            </div>
          )}
        </div>

        {NFT?.owner === address && mounted ? (
          <div className={style.nft_right_buttons}>
            {auctionData?.minBid === 0 ? (
              <Button btnName="Create auction" handleClick={openAuctionModel} />
            ) : (
              <div className={style.nft_right_buttons}>
                <Button
                  btnName="Result auction"
                  handleClick={() => {
                    if (isEnded(auctionData?.endTime)) {
                      validateNetwork(resultAuction);
                    } else {
                      toast.error("auction is not ended");
                    }
                  }}
                  loading={isResultAuctionLoading}
                  disabled={isResultAuctionLoading}
                />

                <Button
                  btnName="Cancel auction"
                  handleClick={() => validateNetwork(cancelAuction)}
                  loading={isCancelAuctionLoading}
                  disabled={isCancelAuctionLoading}
                  reverse={true}
                />
              </div>
            )}
            <Button
              btnName="Cancel listing"
              handleClick={() => {
                validateNetwork(cancelListing);
              }}
              loading={isCancelListingLoading}
              disabled={isCancelListingLoading}
              reverse={true}
            />
          </div>
        ) : (
          <div className={style.nft_right_buttons}>
            {auctionData?.minBid !== 0 && mounted && (
              <div>
                <Button
                  btnName="Place bid"
                  icon={<FaWallet fontSize={12} />}
                  handleClick={() => {
                    if (!isEnded(auctionData?.startTime)) {
                      toast.error("auction is not started");
                    } else if (isEnded(auctionData?.endTime)) {
                      toast.error("auction is ended");
                    } else {
                      openPlaceBidModel();
                    }
                  }}
                />
              </div>
            )}

            {auctionData?.minBid === 0 && mounted && (
              <div className={style.nft_right_buttons}>
                {!NFT?.offers.some((e) => e.offerer === address) && (
                  <Button
                    btnName="Make offer"
                    icon={<MdOutlineLocalOffer fontSize={15} />}
                    handleClick={openOfferModel}
                  />
                )}

                <Button
                  btnName="Buy item"
                  loading={loadingBuy}
                  disabled={loadingBuy}
                  handleClick={() => validateNetwork(buyNFT)}
                />
              </div>
            )}
          </div>
        )}

        <div className={style.nft_right_offers}>
          <h4>Offers</h4>
          <div className={style.nft_right_offers_box}>
            {NFT?.offers?.length == 0 ? (
              <div className={style.nft_right_offers_box_message}>
                <p>No offers</p>
              </div>
            ) : (
              NFT?.offers?.map((el, i) => (
                <div className={style.nft_right_offers_box_child} key={i}>
                  <div className={style.nft_right_offerer}>
                    {/* <w3m-avatar size="medium" /> */}
                    <Identicon
                      string={el.offerer}
                      size={40}
                      className={style.nft_right_offerer_icon}
                    />
                    <div className={style.nft_right_offerer_stats}>
                      <span>offerer</span>
                      <strong>{cutAddress(el.offerer)}</strong>
                    </div>
                  </div>
                  <strong>{el.amount} WETH</strong>

                  {NFT?.owner === address && mounted && (
                    <Button
                      btnName="Accept offer"
                      handleClick={() => {
                        setOfferCreator(el.offerer);
                      }}
                      disabled={loadingAcceptOffer}
                    />
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NFTDetail;
