import { ethers } from "ethers";

// function for convert decimal to wei
export const convertToWei = (price) => {
  if (!price) {
    return;
  }
  return ethers.utils.parseEther(price.toString());
};
