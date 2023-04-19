import connectDB from "../../../utils/connectDB";
import NFTModel from "../../../models/listingModel";
import offerModel from "../../../models/offerModel";
const handler = async (req, res) => {
  const { nftAddress, tokenId, offer } = req.body;
  if (!nftAddress || !tokenId || !offer) {
    return res.status(400).json({
      status: "error",
      message: "missing value",
    });
  }

  try {
    await connectDB();
    const nft = await NFTModel.findOne({ nftAddress, tokenId });

    if (!nft) {
      return res.status(400).json({
        status: "error",
        message: "this nft doesn't exist",
      });
    }

    const newOffer = await offerModel.create({
      offerer: offer.offerer,
      amount: offer.amount,
      expireAt: offer.expireAt,
    });
    nft.offers.push(newOffer._id);

    await nft.save();

    res.status(201).json({
      status: "success",
      data: {
        nft,
        offer: newOffer,
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
