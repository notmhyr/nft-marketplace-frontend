const FormData = require("form-data");
const axios = require("axios");

const JWT = `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`;

//functions to interact with pinata programmatically

// upload the image to ipfs
export const uploadFileToIPFS = async (imageFile) => {
  const url = "https://api.pinata.cloud/pinning/pinFileToIPFS";
  const formData = new FormData();
  formData.append("file", imageFile);

  try {
    const res = await axios.post(url, formData, {
      maxBodyLength: "Infinity",
      headers: {
        "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
        Authorization: JWT,
      },
    });
    return {
      success: true,
      pinataURL: res.data.IpfsHash,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: error.message,
    };
  }
};

// upload the metadata to pinata
export const uploadJSONToIPFS = async (metadata) => {
  const url = "https://api.pinata.cloud/pinning/pinJSONToIPFS";

  try {
    const res = await axios.post(url, metadata, {
      headers: {
        "Content-Type": "application/json",
        Authorization: JWT,
      },
    });

    return {
      success: true,
      pinataURL: res.data.IpfsHash,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: error.message,
    };
  }
};
