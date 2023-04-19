import connectDB from "../../../utils/connectDB";
import NFTModel from "../../../models/listingModel";
import offerModel from "../../../models/offerModel";

// this route return single listed nft

const handler = async (req, res) => {
  const { id } = req.query;

  try {
    await connectDB();
    const nft = await NFTModel.findById(id).populate({
      path: "offers",
      model: offerModel,
    });

    res.status(200).json({
      status: "success",
      data: {
        nft,
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
