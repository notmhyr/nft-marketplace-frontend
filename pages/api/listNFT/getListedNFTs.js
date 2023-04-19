import connectDB from "../../../utils/connectDB";
import NFTModel from "../../../models/listingModel";
import offerModel from "../../../models/offerModel";

export default async function handler(req, res) {
  const { owner } = req.query;

  try {
    await connectDB();

    // if owner query is passed return nfts that address is owned
    if (owner) {
      const nfts = await NFTModel.find({ owner })
        .populate({ path: "offers", model: offerModel })
        .sort({
          createdAt: -1,
        });

      return res.status(200).json({
        status: "success",
        results: nfts.length,
        data: {
          nfts,
        },
      });
    }

    const nfts = await NFTModel.find()
      .populate({ path: "offers", model: offerModel })
      .sort({
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
}
