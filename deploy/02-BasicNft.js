const { getNamedAccounts, network } = require("hardhat");
const { developmentChains } = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deployer } = await getNamedAccounts();
  const { log, deploy } = deployments;

  log("------------------------------------------------");

  let args = [];
  const BasicNftAddress = await deploy("BasicNft", {
    log: true,
    args: args,
    waitConfirmations: network.config.blockConfirmations || 1,
    from: deployer,
  });

  if (!developmentChains.includes(network.name)) {
    log("verifying-------------------------------------------");
    await verify(BasicNftAddress.address, args);
  }
};

module.exports.tags = ["all", "nftMarketplace"];
