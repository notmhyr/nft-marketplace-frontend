import connectDB from "../../../utils/connectDB";
import NFTModel from "../../../models/listingModel";
import CollectionModel from "../../../models/collectionModel";
const handler = async (req, res) => {
  const {
    owner,
    nftAddress,
    tokenId,
    price,
    tokenURI,
    offers,
    auction,
    collectionName,
  } = req.body;

  // returns if all values not sended
  if (
    !owner ||
    !nftAddress ||
    !tokenId ||
    !price ||
    !tokenURI ||
    !collectionName
  ) {
    return res.status(400).json({
      status: "error",
      message: "missing value",
    });
  }

  try {
    await connectDB();

    // check if nft already exist in database
    const listingExist = await NFTModel.findOne({ owner, nftAddress, tokenId });
    if (listingExist) {
      return res.status(400).json({
        status: "error",
        message: "this nft already exist",
      });
    }

    // create new document
    const newListing = new NFTModel({
      owner,
      nftAddress,
      tokenId,
      price,
      tokenURI,
      offers,
      auction,
      collectionName,
    });

    await newListing.save();

    const collection = await CollectionModel.findOne({
      collectionAddress: nftAddress,
    });

    // update the collections
    if (collection) {
      collection.listedNFTs.push(newListing._id);
      await collection.save();
    } else {
      const newCollection = await CollectionModel.create({
        collectionAddress: nftAddress,
        collectionName,
        listedNFTs: [newListing._id],
      });
    }

    // sending the success response to client
    res.status(201).json({
      status: "success",
      data: {
        nft: newListing,
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
