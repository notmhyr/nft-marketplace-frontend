import nft from "../../../models/NFTModel";
import connectDB from "../../../utils/connectDB";

const handler = async (req, res) => {
  const { collectionAddress, collectionName, owner, tokenId, tokenURI } =
    req.body;

  // returns if all values not sended
  if (
    !collectionAddress ||
    !collectionName ||
    !owner ||
    !tokenId ||
    !tokenURI
  ) {
    return res.status(400).json({
      status: "error",
      message: "missing value",
    });
  }
  try {
    await connectDB();
    const nftExist = await nft.findOne({ owner, collectionAddress, tokenId });

    console.log(nftExist);

    if (nftExist) {
      return res.status(400).json({
        status: "error",
        message: "this nft already exist",
      });
    }

    const newNft = await nft.create({
      collectionAddress,
      collectionName,
      owner,
      tokenId,
      tokenURI,
    });

    res.status(201).json({
      status: "success",
      data: {
        nft: newNft,
      },
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      status: "error",
      message: "something went wrong in the server",
    });
  }
};

export default handler;
