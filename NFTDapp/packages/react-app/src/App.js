import React, {useState} from "react";
import { Contract } from "@ethersproject/contracts";
import { JsonRpcProvider, getDefaultProvider, Web3Provider } from "@ethersproject/providers";
import { useQuery } from "@apollo/react-hooks";

import { Body, Button, Header, Image } from "./components";
import useWeb3Modal from "./hooks/useWeb3Modal";
import GET_TRANSFERS from "./graphql/subgraph";
import IpfsApi from 'ipfs-api'

import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';

import { useFilePicker } from 'use-file-picker';
import Buffer from 'buffer';

function WalletButton({ provider, loadWeb3Modal, logoutOfWeb3Modal }) {
  return (
    <Button
      onClick={() => {
        if (!provider) {
          loadWeb3Modal();
        } else {
          logoutOfWeb3Modal();
        }
      }}
    >
      {!provider ? "Connect Wallet" : "Disconnect Wallet"}
    </Button>
  );
}

function App() {
  console.log("New App run");

  async function mintNFT() {
    console.log("Minting NFT");

    let ipfsId;
    const buffer = Buffer.Buffer.from(filesContent[0].content)
    await ipfs.add(buffer)
    .then((response) => {
      ipfsId = response[0].hash
      console.log("IPFS ID: ", ipfsId);
    });

    if(ipfsId !== undefined) {
      // address or 0x3311258F4c01C7B1015cA801BdB954a5D89108AD
      const addressToUse = address;
      console.log("Sending Smart contract");
      console.log("Current address: ", addressToUse);
      const metadata = {
        name: "Test 1",
        author: "Aman G.",
        qHash: ipfsId
      }
      
      await transactContract.mintAsset(addressToUse, ipfsId, JSON.stringify(metadata))
      .catch((err) => {
          console.log(err);
      })
    }
  }

  async function readOnChainData() {
    const mapping = await nftContract.getMapping().catch((err) => console.log(err));
    if(mapping === undefined) {
      return;
    }
    
    var img_objects = await Promise.all(mapping.map(async (obj, index) => {
      if(obj.length === 0) return;
      const json_obj = await JSON.parse(obj);
      const url = "https://ipfs.io/ipfs/" + json_obj.qHash;
      return (
      <Grid key={json_obj.qHash} item xs={12} sm={4} style={{ display: "flex", justifyContent: "center", alignItems: "center" }}> 
        <Card style={{ width: 345, maxWidth: 345 }}>
          <CardActionArea href={url} target="_blank">
            <CardMedia
              style={{ height: 250 }}
              image={url}
              component="img"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="h5">
                {json_obj.name}
              </Typography>
              <Typography gutterBottom>
               {json_obj.author}
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      </Grid>
      )}));

    setImageLoading(false);
    setImages(img_objects);
  }

  // const { loading, error, data } = useQuery(GET_TRANSFERS);
  const [provider, loadWeb3Modal, logoutOfWeb3Modal] = useWeb3Modal();
  const [imageLoading, setImageLoading] = useState(true);
  const [images, setImages] = useState([]);
  const [
    openFileSelector,
    { filesContent, loading, errors, plainFiles }
  ] = useFilePicker({
    multiple: false,
    readAs: "ArrayBuffer", // "Text" | "BinaryString" | "ArrayBuffer" | "DataURL"
    accept: [".jpg", ".png"],
  });

  React.useEffect(() => {
    async function startMint() {
      if(!loading && filesContent.length > 0) {
        await mintNFT();
      }
    }
    startMint();
  }, [loading, filesContent]);

  const infura = { host: "ipfs.infura.io", port: "5001", protocol: "https" };
  const ipfs = IpfsApi(infura);

  const[address, setAddress] = useState("");
  const ethereum = window.ethereum;
  ethereum.enable();
  if(ethereum) {
    if(address === "") {
      console.log("Address: ", ethereum.selectedAddress);
      setAddress(ethereum.selectedAddress);
    }
    ethereum.on('accountsChanged', function(address) {
      console.log("New Address: ", address[0]);
      setAddress(address[0]);
    })
  }

  const abi = [
    "event newAssetMinted(uint256 tokenID)",
    "function getSize() public view returns (uint256)",
    "function getMapping() public view returns (string[] memory)",
    "function mintAsset(address recipient, string memory hash, string memory metadata) public returns (uint256)"
  ];

  // Rinkeby
  const defaultProvider = getDefaultProvider("rinkeby");
  const contractAddress = "0x52C9289cA3da8C4369AcA4A75aA5088db5f9182E";
  const nftContract = new Contract(contractAddress, abi, defaultProvider);
  const signer = new Web3Provider(ethereum).getSigner();
  const transactContract = new Contract(contractAddress, abi, signer);
  transactContract.on("newAssetMinted", (tokenID, event) => {
    readOnChainData();
  });

  // Localhost
  // const defaultProvider = new JsonRpcProvider("http://127.0.0.1:8545");
  // const contractAddress = "0x7d44cF57aAC4D110b9351d8901Fd399715D6E31E";
  // const nftContract = new Contract(contractAddress, abi, defaultProvider);
  // const signer = defaultProvider.getSigner();
  // const transactContract = new Contract(contractAddress, abi, signer);
  // transactContract.on("newAssetMinted", (tokenID, event) => {
  //   readOnChainData();
  // });

  return (
    <div>
      <Header>
        <Button onClick={() => readOnChainData()}>
          Read On-Chain NFT Data
        </Button>
        <Button onClick={() => openFileSelector()}>
          Create NFT
        </Button>
        <WalletButton provider={provider} loadWeb3Modal={loadWeb3Modal} logoutOfWeb3Modal={logoutOfWeb3Modal} />
      </Header>
      <Body>
        <Grid container spacing={10} style={{ maxWidth: "80%" }}>
          {!imageLoading && images}
        </Grid>
        {imageLoading && <p>Image Loading!</p>}
      </Body>
    </div>
  );
}

export default App;
