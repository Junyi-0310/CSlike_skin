// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title SkinNFT
 * @notice Academic PoC NFT for rare/unique game skins with structured metadata.
 */
contract SkinNFT is ERC721URIStorage, Ownable {
    struct SkinDetails {
        string skinName;
        string rarity;
        string wearLevel;
        string pattern;
    }

    mapping(uint256 => SkinDetails) private _skinDetails;
    uint256 private _nextTokenId;

    event SkinNFTMinted(address indexed to, uint256 indexed tokenId, string skinName);
    event SkinNFTBurned(uint256 indexed tokenId);

    constructor(string memory name_, string memory symbol_) ERC721(name_, symbol_) Ownable(msg.sender) {}

    /**
     * @notice Owner mints a unique skin NFT to the recipient.
     */
    function mintSkin(
        address to,
        string memory skinName,
        string memory rarity,
        string memory wearLevel,
        string memory pattern,
        string memory tokenMetadataURI
    ) external onlyOwner returns (uint256) {
        require(to != address(0), "Invalid recipient");

        uint256 tokenId = _nextTokenId;
        _nextTokenId += 1;

        _safeMint(to, tokenId);
        _setTokenURI(tokenId, tokenMetadataURI);

        _skinDetails[tokenId] = SkinDetails({
            skinName: skinName,
            rarity: rarity,
            wearLevel: wearLevel,
            pattern: pattern
        });

        emit SkinNFTMinted(to, tokenId, skinName);
        return tokenId;
    }

    /**
     * @notice Returns all stored fields for a token.
     */
    function getSkinDetails(uint256 tokenId)
        external
        view
        returns (
            string memory skinName,
            string memory rarity,
            string memory wearLevel,
            string memory pattern,
            string memory metadataURI
        )
    {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");

        SkinDetails memory details = _skinDetails[tokenId];
        return (
            details.skinName,
            details.rarity,
            details.wearLevel,
            details.pattern,
            tokenURI(tokenId)
        );
    }

    /**
     * @notice Owner burns any token (coursework governance assumption).
     */
    function burn(uint256 tokenId) external onlyOwner {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");

        _burn(tokenId);
        delete _skinDetails[tokenId];

        emit SkinNFTBurned(tokenId);
    }
}
