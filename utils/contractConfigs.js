import {
  auctionAbi,
  marketplaceAbi,
  nftFactoryAbi,
  wethAbi,
  contractAddresses,
} from "../constants";

// the active chain id for the project
const chainId = 11155111;

// return contract configs (address,abi,chainId)
const getConfigs = () => {
  if (chainId in contractAddresses) {
    const marketplaceAddress = contractAddresses[chainId].marketplace;
    const auctionAddress = contractAddresses[chainId].auction;
    const nftFactoryAddress = contractAddresses[chainId].nftFactory;
    const wethAddress = contractAddresses[chainId].weth;

    const marketplaceConfig = {
      address: marketplaceAddress,
      abi: marketplaceAbi,
      chainId,
    };
    const auctionConfig = {
      address: auctionAddress,
      abi: auctionAbi,
      chainId,
    };
    const nftFactoryConfig = {
      address: nftFactoryAddress,
      abi: nftFactoryAbi,
      chainId,
    };

    const wethConfig = {
      address: wethAddress,
      abi: wethAbi,
      chainId,
    };

    return {
      marketplaceConfig,
      auctionConfig,
      nftFactoryConfig,
      wethConfig,
      chainId,
    };
  } else {
    console.log("app doesn't support this chain id");
    return false;
  }
};

export default getConfigs;
