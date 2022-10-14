const { ethers, network } = require("hardhat");
const { developmentChains } = require("../helper-hardhat-config");
const { verify } = require("../utils/verify.js");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deployer } = await getNamedAccounts();
  const { deploy, log } = deployments;

  log("----------------------------------------------------");

  let args = [];
  const nftMarketplace = await deploy("NftMarketplace", {
    from: deployer,
    log: true,
    args: args,
    waitConfirmations: network.config.blockConfirmations || 1,
  });

  if (!developmentChains.includes(network.name)) {
    log("----------------------------------------------------");
    await verify(nftMarketplace.address, args);
    ///
  }
};

module.exports.tags = ["all", "nftMarketplace"];
