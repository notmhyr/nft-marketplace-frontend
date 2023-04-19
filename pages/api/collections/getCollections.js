import connectDB from "../../../utils/connectDB";
import CollectionModel from "../../../models/collectionModel";
import NFTModel from "../../../models/listingModel";

const handler = async (req, res) => {
  try {
    await connectDB();

    const collections = await CollectionModel.find().populate({
      path: "listedNFTs",
      model: NFTModel,
    });

    res.status(200).json({
      status: "success",
      results: collections.length,
      data: {
        collections,
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
