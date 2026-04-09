// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

interface ISkinFT {
    function mint(address to, uint256 amount) external;
}

interface ISkinNFT {
    function mintSkin(
        address to,
        string calldata skinName,
        string calldata rarity,
        string calldata wearLevel,
        string calldata pattern,
        string calldata tokenMetadataURI
    ) external returns (uint256);
}

/**
 * @title PlatformManager
 * @notice Lightweight coordination layer for hybrid FT + NFT tokenisation workflow.
 * @dev This contract does not implement a marketplace. It only classifies assets and routes minting.
 */
contract PlatformManager is Ownable {
    enum AssetCategory {
        Unset,
        FT_POOL,
        NFT_PREMIUM
    }

    ISkinFT public skinFT;
    ISkinNFT public skinNFT;

    mapping(uint256 => AssetCategory) public assetCategory;
    mapping(uint256 => uint256) public premiumAssetToTokenId;

    event AssetClassified(uint256 indexed assetId, AssetCategory category, string note);
    event PoolMinted(uint256 indexed assetId, address indexed to, uint256 amount);
    event PremiumSkinMinted(uint256 indexed assetId, uint256 indexed tokenId, string skinName, address indexed to);

    constructor(address skinFTAddress, address skinNFTAddress) Ownable(msg.sender) {
        require(skinFTAddress != address(0), "Invalid FT address");
        require(skinNFTAddress != address(0), "Invalid NFT address");

        skinFT = ISkinFT(skinFTAddress);
        skinNFT = ISkinNFT(skinNFTAddress);
    }

    /// @notice Classify an asset into FT pool logic or NFT premium logic.
    function classifyAsset(uint256 assetId, AssetCategory category, string calldata note) external onlyOwner {
        require(assetId > 0, "assetId must be > 0");
        require(category != AssetCategory.Unset, "Invalid category");

        assetCategory[assetId] = category;
        emit AssetClassified(assetId, category, note);
    }

    /// @notice Mint FT units for assets classified as FT_POOL.
    function mintPoolUnits(uint256 assetId, address to, uint256 amount) external onlyOwner {
        require(assetCategory[assetId] == AssetCategory.FT_POOL, "Asset not FT category");
        require(amount > 0, "Amount must be > 0");

        skinFT.mint(to, amount);
        emit PoolMinted(assetId, to, amount);
    }

    /// @notice Mint premium NFT for assets classified as NFT_PREMIUM.
    function mintPremiumSkin(
        uint256 assetId,
        address to,
        string calldata skinName,
        string calldata rarity,
        string calldata wearLevel,
        string calldata pattern,
        string calldata tokenMetadataURI
    ) external onlyOwner returns (uint256) {
        require(assetCategory[assetId] == AssetCategory.NFT_PREMIUM, "Asset not NFT category");

        uint256 tokenId = skinNFT.mintSkin(
            to,
            skinName,
            rarity,
            wearLevel,
            pattern,
            tokenMetadataURI
        );

        premiumAssetToTokenId[assetId] = tokenId;
        emit PremiumSkinMinted(assetId, tokenId, skinName, to);
        return tokenId;
    }
}
