import React, { useContext, useEffect, useState } from "react";
import Link from "next/link";
import {
  useAccount,
  useContractEvent,
  useContractRead,
  useContractWrite,
  useNetwork,
  useWaitForTransaction,
} from "wagmi";
import axios from "axios";
import Image from "next/image";
import { ethers } from "ethers";

// internal imports
import {
  Button,
  ListNFTModel,
  LoadingComponent,
  NFTCard,
  WebsiteHead,
} from "../../components/componentIndex";
import style from "../../styles/mynfts.module.scss";
import { toast } from "react-toastify";
import getConfigs from "../../utils/contractConfigs";
import nftCollectionAbi from "../../constants/nftCollectionAbi.json";
import { ValidateNetworkContext } from "../../context/ValidateNetwork";

const MyNfts = () => {
  // listing form values
  const [collectionAddress, setCollectionAddress] = useState("");
  const [tokenId, setTokenId] = useState("");
  const [price, setPrice] = useState(0);
  const [tokenURI, setTokenURI] = useState("");
  const [collectionName, setCollectionName] = useState("");

  // for open and close model
  const [isOpen, setIsOpen] = useState(false);

  const { validateNetwork } = useContext(ValidateNetworkContext);

  // loading state
  const [isLoadingNFTs, setIsLoadingNFTs] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // nfts data
  const [notListedNFTs, setNotListedNFTs] = useState([]);
  const [listedNFTs, setListedNFTs] = useState([]);

  //tabs state
  const [notListed, setNotListed] = useState(true);
  const [listed, setListed] = useState(false);

  // marketplace config (address,abi)
  const [marketplace, setMarketplace] = useState();

  // check if the page is mounted to prevent hydration error
  const [mounted, setMounted] = useState(false);

  const { address, isConnected } = useAccount();

  // fetch user's not listed nfts form api
  const fetchNotListedNfts = async () => {
    setIsLoadingNFTs(true);
    try {
      const { data } = await axios.get(`/api/nfts/${address}`);
      if (data.status == "success" && data.data.nfts.length > 0) {
        const nfts = await Promise.all(
          data.data.nfts.map(async (el) => {
            const nft = await fetchTokenURIData(el.tokenURI);
            return { ...el, ...nft };
          })
        );

        setNotListedNFTs(nfts);
      }
      setIsLoadingNFTs(false);
    } catch (error) {
      setIsLoadingNFTs(false);
      console.log(error);
    }
  };

  // fetch user's listed nfts form api
  const fetchListedNFTs = async () => {
    setIsLoadingNFTs(true);

    try {
      const { data } = await axios.get(
        `/api/listNFT/getListedNFTs?owner=${address}`
      );
      if (data.status == "success" && data.data.nfts.length > 0) {
        const nfts = await Promise.all(
          data.data.nfts.map(async (el) => {
            const nft = await fetchTokenURIData(el.tokenURI);

            return { ...el, ...nft };
          })
        );
        setListedNFTs(nfts);
      }
      setIsLoadingNFTs(false);
    } catch (error) {
      setIsLoadingNFTs(false);
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

  useEffect(() => {
    setMounted(true);

    // get contract configs
    const { marketplaceConfig } = getConfigs();
    setMarketplace(marketplaceConfig);
    fetchNotListedNfts();
  }, []);

  // fetch nft on initial load and on account change
  useEffect(() => {
    setNotListedNFTs([]);
    fetchNotListedNfts();
    setListedNFTs([]);
    fetchListedNFTs();
  }, [address]);

  // function for handle opening model
  const openModel = (collection, tokenId, tokenURI, collectionName) => {
    setCollectionAddress(collection);
    setTokenId(tokenId);
    setTokenURI(tokenURI);
    setCollectionName(collectionName);
    setIsOpen(true);
  };

  // function for convert decimal to wei
  const convertToWei = (price) => {
    if (!price) {
      return;
    }
    return ethers.utils.parseEther(price.toString());
  };

  // functions for handle click tabs
  const activeNotListedTab = () => {
    setListed(false);
    setNotListed(true);
    fetchNotListedNfts();
  };
  const activeListTab = () => {
    setListed(true);
    setNotListed(false);
    fetchListedNFTs();
  };

  // required props to send for listModel component
  const handlePriceForm = (e) => {
    setPrice(e.target.value);
  };
  const handleCloseBtn = () => {
    setIsOpen(false);
    setCollectionAddress("");
    setTokenId("");
    setTokenURI("");
    setCollectionName("");
    setPrice(0);
  };

  const handleListSubmit = async (e) => {
    e.preventDefault();

    if (price <= 0) {
      toast.error("price is required");
      return;
    }
    setIsLoading(true);

    //approve marketplace before listing nft
    validateNetwork(approve);
  };

  // wagmi hooks

  // approve nft to marketplace function
  const {
    data: approveData,
    write: approve,
    isSuccess: isApproved,
  } = useContractWrite({
    address: collectionAddress,
    abi: nftCollectionAbi,
    functionName: "approve",
    args: [marketplace?.address, tokenId],

    onSuccess() {
      console.log("nft approved for marketplace successfully");
      // calling the listItem function when is approved
    },

    onError(e) {
      toast.error(e.reason);
      setIsLoading(false);

      console.log(e);
    },
  });

  // wait for approve transaction and run list item if transaction was successful
  const waitForConfirmation = useWaitForTransaction({
    hash: approveData?.hash,

    onSuccess() {
      listItem?.();
    },
    onError(e) {
      toast.error("failed to approve");
      console.log(e);
    },
  });

  // listItem function
  const { write: listItem } = useContractWrite({
    ...marketplace,
    functionName: "listItem",
    args: [collectionAddress, tokenId, convertToWei(price)],

    onSuccess() {
      console.log("NFT listed successfully");
    },
    onError(e) {
      toast.error(e.reason);
      console.log(e);
      setIsLoading(false);
    },
  });

  // listen for listing event from contract
  useContractEvent({
    ...marketplace,
    eventName: "ItemListed",
    async listener(owner, nftAddress, tokenId, price) {
      console.log("event running");
      try {
        const { data: deleteRes } = await axios.delete("/api/nfts/deleteNFT", {
          data: {
            collectionAddress: nftAddress,
            owner,
            tokenId: tokenId.toString(),
          },
        });
        const { data } = await axios.post("/api/listNFT", {
          owner,
          nftAddress,
          tokenId: tokenId.toString(),
          price: ethers.utils.formatEther(price).toString(),
          tokenURI,
          collectionName,
        });

        toast.success("NFT listed successfully");
        handleCloseBtn();
        activeListTab();
        setIsLoading(false);
        setNotListedNFTs([]);

        console.log("deleted nft from database successfully");

        console.log("listed nft to database successfully");
      } catch (error) {
        console.log(error);
      }
    },
  });

  if (mounted && !isConnected) {
    return (
      <div className={style.message}>
        <p>Please connect your wallet</p>
      </div>
    );
  }

  return (
    <div className={style.myNfts}>
      <WebsiteHead title="My NFTs" />

      <h2>My NFTs</h2>

      <div className={style.myNfts_tabs}>
        <button
          onClick={activeNotListedTab}
          className={`${notListed ? style.active : ""}`}
        >
          not listed
        </button>
        <button
          onClick={activeListTab}
          className={`${listed ? style.active : ""}`}
        >
          listed
        </button>
      </div>

      <ListNFTModel
        handleCloseBtn={handleCloseBtn}
        isOpen={isOpen}
        price={price}
        handlePriceForm={handlePriceForm}
        loading={isLoading}
        handleListSubmit={handleListSubmit}
      />

      {isLoadingNFTs ? (
        <LoadingComponent message="loading your Nfts" />
      ) : notListed ? (
        notListedNFTs.length == 0 ? (
          <div className={style.message}>
            <p>
              you don't have any NFTs <Link href="/createNFT">create one</Link>
            </p>
          </div>
        ) : (
          <div className={style.myNfts_box}>
            {notListedNFTs.map((nft, i) => {
              return (
                <div className={style.myNfts_box_nftCard} key={i}>
                  <Image src={nft.image} alt="nft" width={300} height={330} />

                  <div className={style.myNfts_box_nftCard_info}>
                    <h4>{nft.name}</h4>
                    <p>{nft.description}</p>
                    <Button
                      btnName="List NFT"
                      handleClick={() =>
                        openModel(
                          nft.collectionAddress,
                          nft.tokenId,
                          nft.tokenURI,
                          nft.collectionName
                        )
                      }
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )
      ) : listedNFTs.length == 0 ? (
        <div className={style.message}>
          <p>you don't have any listed NFTs</p>
        </div>
      ) : (
        <div className={style.myNfts_box}>
          {listedNFTs.map((nft, i) => (
            <NFTCard nft={nft} key={i} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyNfts;
