const fs = require("fs");
const { network, ethers } = require("hardhat");
require("dotenv").config();

module.exports = async () => {
  if (process.env.updateFrontend) {
    console.log("Updating Frontend");
    console.log("Updating Contract Addresses");
    await updateContractAddress();
    console.log("Updating Abi");
    await updateAbi();
    console.log("Updated");
  }
};

let nftAddressLocation = "./client/constants/ConttractAddresses.json";
let basicAbiLocation = "./client/constants/BasicNft.json";
let nftMarketplaceAbiLocation = "./client/constants/NftMarketplace.json";

const updateAbi = async () => {
  const nftMarketPlace = await ethers.getContract("NftMarketplace");
  const basicNft = await ethers.getContract("BasicNft");

  fs.writeFileSync(
    nftMarketplaceAbiLocation,
    nftMarketPlace.interface.format(ethers.utils.FormatTypes.json)
  );

  fs.writeFileSync(
    basicAbiLocation,
    basicNft.interface.format(ethers.utils.FormatTypes.json)
  );
  // get the abi
  // write to the file the abi
};

const updateContractAddress = async () => {
  // get the files you want to put the address and the chainid
  //check if the chainid already exist ... if it does put
  // if not push
  const chainId = network.config.chainId.toString();
  const nftMarketPlace = await ethers.getContract("NftMarketplace");
  console.log("Writing to files");
  const files = JSON.parse(fs.readFileSync(nftAddressLocation, "utf8"));

  if (chainId in files) {
    if (!files[chainId]["NftMarketplace"].includes(nftMarketPlace.address)) {
      files[chainId]["NftMarketplace"].push(nftMarketPlace.address);
    } else {
      console.log("Creating new ChainId");
      files[chainId] = {
        NftMarketplace: [nftMarketPlace.address],
      };
    }
  }
  console.log(JSON.stringify(files));
  fs.writeFileSync(nftAddressLocation, JSON.stringify(files));
};

module.exports.tags = ["all", "update"];
