// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title SkinFT
 * @notice Academic PoC token for common/standardised game skins.
 * @dev decimals is overridden to 0 so balances behave like whole skin units.
 */
contract SkinFT is ERC20, Ownable {
    string public assetDescription;

    event SkinFTMinted(address indexed to, uint256 amount);
    event SkinFTBurned(address indexed from, uint256 amount);

    constructor(
        string memory name_,
        string memory symbol_,
        string memory assetDescription_
    ) ERC20(name_, symbol_) Ownable(msg.sender) {
        assetDescription = assetDescription_;
    }

    /// @notice Returns 0 so users interact in whole units instead of decimals.
    function decimals() public pure override returns (uint8) {
        return 0;
    }

    /// @notice Owner mints common-skin units to any address.
    function mint(address to, uint256 amount) external onlyOwner {
        require(to != address(0), "Invalid recipient");
        require(amount > 0, "Amount must be > 0");

        _mint(to, amount);
        emit SkinFTMinted(to, amount);
    }

    /// @notice Owner burns common-skin units from owner wallet.
    function burn(uint256 amount) external onlyOwner {
        require(amount > 0, "Amount must be > 0");

        _burn(msg.sender, amount);
        emit SkinFTBurned(msg.sender, amount);
    }
}
