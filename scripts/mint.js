const { ethers } = require("hardhat");
const mint = async () => {
  const basicNft = await ethers.getContract("BasicNft");
  console.log(`Minting Nft at ${basicNft.address}...`);
  const tx = await basicNft.mintNft();
  const txReceipt = await tx.wait(1);
  console.log("Finished Minting...");
  const tokenId = await txReceipt.events[0].args.tokenId;
  console.log("Getting Token Uri...");
  const string = await basicNft.tokenURI(tokenId);
  console.log(string);
  console.log("Gotten TOken Uri...");
};

mint()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
