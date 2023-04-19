import nft from "../../../models/NFTModel";
import connectDB from "../../../utils/connectDB";

const handler = async (req, res) => {
  const { collectionAddress, owner, tokenId } = req.body;

  // returns if all values not sended
  if (!collectionAddress || !owner || !tokenId) {
    return res.status(400).json({
      status: "error",
      message: "missing value",
    });
  }

  try {
    await connectDB();
    const deletedNFT = await nft.findOneAndDelete({
      collectionAddress,
      owner,
      tokenId,
    });

    res.status(200).json({
      status: "success",
      data: {
        nft: deletedNFT,
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
