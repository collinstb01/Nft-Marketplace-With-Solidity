// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

error Nft__PriceMustBeAboveZero();
error Nft__NotApprovedForMarket();
error Nft_AlreadyListed(address nftAddress, uint256 tokenId);
error Nft__NotOwner(address owner);
error Nft__NotListed(address nftAddress, uint256 tokenId);
error Nft__NotOwnerEth();
error Nft__YouAreBroke();
error Nft__TransferFailed();

contract NftMarketplace is ReentrancyGuard {
    constructor() {}

    struct Listing {
        uint256 price;
        address seller;
    }

    event ItemListed(
        address indexed seller,
        address indexed nftAddress,
        uint256 indexed price,
        uint256 tokenId
    );

    event ItemBought(
        address indexed buyer,
        address indexed nftAddress,
        uint256 indexed tokenId,
        uint256 price
    );

    event ItemCanceled(
        address indexed seller,
        address indexed nftAddress,
        uint256 tokenId
    );
    modifier NotListed(
        address nftAddress,
        uint256 tokenId,
        address owner
    ) {
        Listing memory listing = s_listings[nftAddress][tokenId];
        if (listing.price > 0) {
            revert Nft_AlreadyListed(nftAddress, tokenId);
        }
        _;
    }

    modifier IsOwner(
        address nftAddress,
        uint256 tokenId,
        address sender
    ) {
        IERC721 nft = IERC721(nftAddress);
        address owner = nft.ownerOf(tokenId);

        if (owner == sender) {
            revert Nft__NotOwner(sender);
        }
        _;
    }

    modifier IsListed(address nftAddress, uint256 tokenId) {
        Listing memory listing = s_listings[nftAddress][tokenId];

        if (listing.price <= 0) {
            revert Nft__NotListed(nftAddress, tokenId);
        }

        _;
    }

    mapping(address => mapping(uint256 => Listing)) private s_listings;
    mapping(address => uint256) private s_procceeds;

    function list_item(
        address nftAddress,
        uint256 tokenId,
        uint256 price
    )
        external
        NotListed(nftAddress, tokenId, msg.sender)
        IsOwner(nftAddress, tokenId, msg.sender)
    {
        if (price <= 0) {
            revert Nft__PriceMustBeAboveZero();
        }

        IERC721 nft = IERC721(nftAddress);
        if (nft.getApproved(tokenId) != address(this)) {
            revert Nft__NotApprovedForMarket();
        }
        s_listings[nftAddress][tokenId] = Listing(price, msg.sender);
        emit ItemListed(msg.sender, nftAddress, price, tokenId);
    }

    function buy_item(address nftAddress, uint256 tokenId)
        external
        payable
        IsListed(nftAddress, tokenId)
        nonReentrant
    {
        Listing memory listing = s_listings[nftAddress][tokenId];

        if (msg.value < listing.price) {
            revert Nft__NotOwnerEth();
        }

        s_procceeds[listing.seller] = s_procceeds[listing.seller] + msg.value;
        delete (s_listings[nftAddress][tokenId]);
        IERC721(nftAddress).safeTransferFrom(
            listing.seller,
            msg.sender,
            tokenId
        );
        emit ItemBought(msg.sender, nftAddress, tokenId, listing.price);
    }

    function cancel_listing(address nftAddress, uint256 tokenId)
        external
        IsOwner(nftAddress, tokenId, msg.sender)
        IsListed(nftAddress, tokenId)
    {
        delete (s_listings[nftAddress][tokenId]);
        emit ItemCanceled(msg.sender, nftAddress, tokenId);
    }

    function update_listing(
        uint256 price,
        address nftAddress,
        uint256 tokenId
    )
        public
        IsListed(nftAddress, tokenId)
        IsOwner(nftAddress, tokenId, msg.sender)
    {
        Listing memory listing = s_listings[nftAddress][tokenId];
        listing.price = price;
        emit ItemListed(msg.sender, nftAddress, price, tokenId);
    }

    function withdraw_proceeds() external {
        uint256 proceeds = s_procceeds[msg.sender];
        if (proceeds <= 0) {
            revert Nft__YouAreBroke();
        }
        s_procceeds[msg.sender] = 0;
        (bool success, ) = payable(msg.sender).call{value: proceeds}("");
        if (!success) {
            revert Nft__TransferFailed();
        }
    }

    /////////////////////
    // Getter Functions //
    /////////////////////

    function getListing(address nftAddress, uint256 tokenId)
        external
        view
        returns (Listing memory)
    {
        return s_listings[nftAddress][tokenId];
    }

    function getProceeds(address seller) external view returns (uint256) {
        return s_procceeds[seller];
    }
}
