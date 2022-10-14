const { assert, expect } = require("chai");
const { network, ethers, getNamedAccounts, deployments } = require("hardhat");
const { developmentChains } = require("../../helper-hardhat-config");

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("NftMarketplace Tests", () => {
      let nftMarketplace, nftMarketplaceContract, basicNft, basicNftContract;
      const PRICE = ethers.utils.parseEther("0.1");
      const TOKEN_ID = 0;

      beforeEach(async () => {
        accounts = await ethers.getSigners(); // could also do with getNamedAccounts
        deployer = accounts[0];
        user = accounts[1];
        await deployments.fixture(["all"]);
        nftMarketplaceContract = await ethers.getContract("NftMarketplace");
        nftMarketplace = nftMarketplaceContract.connect(user);
        basicNftContract = await ethers.getContract("BasicNft");
        basicNft = await basicNftContract.connect(deployer);
        await basicNft.mintNft();
        await basicNft.approve(nftMarketplaceContract.address, TOKEN_ID);
      });

      it("List and can be bought", async () => {
        await nftMarketplaceContract.list_item(
          basicNft.address,
          TOkEN_ID,
          PRICE
        );
        await user.buy_item(basicNft.address, TOkEN_ID, {
          value: PRICE,
        });
        const newOwner = await nftMarketplaceContract.ownerOf(basicNft);
        const proceeds = await playerConnected.getProceeds(playerConnected);
        assert(newOwner.toString() == user.address.toString());
        assert(proceeds.toString() == PRICE.toString());
      });
    });
