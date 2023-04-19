import React, { useCallback, useContext, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { BsFillImageFill } from "react-icons/bs";
import { MdOutlineClose } from "react-icons/md";
import {
  useAccount,
  useContractEvent,
  useContractRead,
  useContractWrite,
} from "wagmi";
import Image from "next/image";
import { toast } from "react-toastify";
import axios from "axios";
import { useRouter } from "next/router";

//internal import
import { Button, WebsiteHead } from "../components/componentIndex";
import style from "../styles/createNFT.module.scss";
import formstyle from "../styles/Form.module.scss";
import getConfigs from "../utils/contractConfigs";
import { uploadFileToIPFS, uploadJSONToIPFS } from "../utils/uploadToPinata";
import nftCollectionAbi from "../constants/nftCollectionAbi.json";
import { ValidateNetworkContext } from "../context/ValidateNetwork";

const CreateNFT = () => {
  // form input values
  const [imageFile, setImageFile] = useState("");
  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [collection, setCollection] = useState("");
  const [description, setDescription] = useState("");

  const [tokenURI, setTokenURI] = useState("");

  // loading state
  const [loading, setLoading] = useState(false);

  // contract config (address,abi,chainId)
  const [nftFactoryConfig, setNftFactoryConfig] = useState({});

  // check if the page is mounted to prevent hydration error
  const [mounted, setMounted] = useState(false);

  // validation for chainId
  const { validateNetwork } = useContext(ValidateNetworkContext);

  const { address, isConnected } = useAccount();

  const router = useRouter();

  // configuration for using dropzone package
  const onDrop = useCallback(async (acceptedFile) => {
    setImageFile(acceptedFile[0]);
    setImage(URL.createObjectURL(acceptedFile[0]));
  });
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "image/*",
    maxSize: 5000000,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!imageFile || !collection) {
      setLoading(false);
      toast.error("all fields are required");
      return;
    }

    toast.info("this may take some time");

    try {
      //upload the image to ipfs
      const { pinataURL: imgURL } = await uploadFileToIPFS(imageFile);

      console.log(`this uploaded image url to pinata ${imgURL}`);

      // creating metadata for NFT
      const metadata = {
        name,
        description,
        image: imgURL,
      };

      //upload metadata to ipfs
      const { success, pinataURL: metadataURL } = await uploadJSONToIPFS(
        metadata
      );

      if (success) {
        console.log(`this uploaded metadata url to pinata ${metadataURL}`);

        setTokenURI(metadataURL);
      }
    } catch (error) {
      setLoading(false);
      console.log(`error to upload file into pinata ${error}`);
    }
  };

  // use wagmi hooks for make the function call on the contract

  const { data: collectionsOwned } = useContractRead({
    ...nftFactoryConfig,
    functionName: "getCollectionsOwned",
    args: [address],
    enabled: isConnected ? true : false,
    watch: true,
  });

  // mint function
  const { write } = useContractWrite({
    address: collection,
    abi: nftCollectionAbi,
    functionName: "mint",
    args: [tokenURI],
    chainId: 11155111,
    async onSuccess() {
      toast.success("nft created successfully");
      setTimeout(() => {
        toast.info("waiting to get added in database");
      }, 2000);
    },
    onError(e) {
      setLoading(false);
      toast.error(e.reason);
      console.log(e);
    },
  });

  // listening for mint event on contract to store the data to db
  useContractEvent({
    address: collection,
    abi: nftCollectionAbi,
    eventName: "Minted",
    async listener(tokenId, tokenURI, minter, collectionName) {
      try {
        const { data } = await axios.post("/api/nfts/createNFT", {
          collectionAddress: collection,
          collectionName,
          owner: minter,
          tokenId: tokenId.toString(),
          tokenURI,
        });
        setLoading(false);
        setImage("");
        setImageFile("");
        setName("");
        setDescription("");
        console.log("nft added to db");
        router.push("/user/mynfts");
      } catch (error) {
        setLoading(false);

        console.log(error);
      }
    },
  });

  useEffect(() => {
    setMounted(true);

    // get contract configs
    const { nftFactoryConfig } = getConfigs();
    setNftFactoryConfig(nftFactoryConfig);
  }, [isConnected]);

  // call the write when token URI is set because set State for token uri doesn't update the state immediately
  useEffect(() => {
    if (tokenURI) {
      validateNetwork(write);
    }
  }, [tokenURI]);

  const handleClose = () => {
    setImage(false);
    setImageFile("");
  };

  if (mounted && !isConnected) {
    return (
      <div className={style.message}>
        <p>Please connect your wallet</p>
      </div>
    );
  }

  return collectionsOwned?.length == 0 ? (
    <div className={style.message}>
      <p>
        You have no collections in order to create NFT please{" "}
        <span
          onClick={() => router.push("/collection/create?redirect=/createNFT")}
        >
          create a collection
        </span>
      </p>
    </div>
  ) : (
    <form className={style.createNFT} onSubmit={handleSubmit}>
      <WebsiteHead title="Create NFT" />

      <h1>Create New NFT</h1>

      <div className={style.createNFT_title}>
        <strong>Image, Video, Audio, or 3D Model *</strong>
        <span>
          File types supported: JPG, PNG, GIF, SVG, MP4, WEBM, MP3, WAV, OGG,
          GLB, GLTF. Max size: 100 MB
        </span>
      </div>

      {!image ? (
        <div className={style.createNFT_dropzone} {...getRootProps()}>
          <input {...getInputProps()} />
          <div className={style.createNFT_dropzone_icon}>
            <BsFillImageFill fontSize={50} />
          </div>
          <span>Drag & drop file</span>
          <span>or browse media on your device</span>
        </div>
      ) : (
        <div className={style.createNFT_image}>
          <Image src={image} alt="nft" width={300} height={300} />
          <div
            className={style.createNFT_image_icon}
            onClick={() => handleClose()}
          >
            <MdOutlineClose />
          </div>
        </div>
      )}

      <div className={style.createNFT_form}>
        <div className={formstyle.Form_box_input}>
          <label htmlFor="name">Name*</label>
          <input
            type="text"
            placeholder="Nft name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={formstyle.Form_box_input_input}
          />
        </div>
        <div className={formstyle.Form_box_input}>
          <label htmlFor="name">Collection*</label>
          <span>This is the collection where your item will appear.</span>
          <select
            defaultValue=""
            onChange={(e) => setCollection(e.target.value)}
            required
          >
            <option value="">Select collection</option>
            {collectionsOwned?.map((collection, i) => {
              return (
                <option value={collection.collectionAddress} key={i}>
                  {collection.name}
                </option>
              );
            })}
          </select>
        </div>

        <div className={formstyle.Form_box_input}>
          <label htmlFor="description">Description</label>
          <textarea
            name=""
            id=""
            cols="30"
            rows="6"
            placeholder="description for your NFT"
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>

        <div className={formstyle.Form_box_button}>
          <Button
            btnName="Create"
            type="submit"
            loading={loading}
            disabled={loading}
          />
        </div>
      </div>
    </form>
  );
};

export default CreateNFT;
