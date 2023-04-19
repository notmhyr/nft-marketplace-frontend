import nft from "../../../models/NFTModel";
import connectDB from "../../../utils/connectDB";

const handler = async (req, res) => {
  const { owner } = req.query;
  try {
    await connectDB();

    const nfts = await nft.find({ owner }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      status: "success",
      results: nfts.length,
      data: {
        nfts,
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
