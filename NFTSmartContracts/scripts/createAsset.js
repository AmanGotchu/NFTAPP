const pinataApiKey = "150e55689ae69d0e084f";
const pinataSecretApiKey = "3e6ac2baa923a7d85e437342cb52ff78116de2ab08fee60f14243b431c8a2fce";
const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");

const pinFileToIPFS = async () => {
  const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
  let data = new FormData();
  const readStream = fs.createReadStream("./a.png")
  data.append("file", readStream);
  console.log(readStream);

  const res = await axios.post(url, data, {
    maxContentLength: "Infinity", 
    headers: {
      "Content-Type": `multipart/form-data; boundary=${data._boundary}`,
      pinata_api_key: pinataApiKey, 
      pinata_secret_api_key: pinataSecretApiKey,
    },
  });
  console.log(res.data);
};

pinFileToIPFS();