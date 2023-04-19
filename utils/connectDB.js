import mongoose from "mongoose";

// connect to mongo db database
const connectDB = async () => {
  const options = {
    family: 4,
  };
  try {
    mongoose.connect(process.env.NEXT_PUBLIC_MONGODB_URI, options);
    console.log("connected to db");
  } catch (error) {
    console.log(`error for connect to db ${error}`);
  }
};

export default connectDB;
