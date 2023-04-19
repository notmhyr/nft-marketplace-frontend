import connectDB from "../../../utils/connectDB";
import NFTModel from "../../../models/listingModel";
import CollectionModel from "../../../models/collectionModel";

// this route return single collection

const handler = async (req, res) => {
  const { id } = req.query;
  console.log(id);
  try {
    await connectDB();
    const collection = await CollectionModel.findById(id).populate({
      path: "listedNFTs",
      model: NFTModel,
    });

    res.status(200).json({
      status: "success",
      data: {
        collection,
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
