const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("PlatformManager", function () {
  async function deployAll() {
    const [deployer, user] = await ethers.getSigners();

    const SkinFT = await ethers.getContractFactory("SkinFT");
    const skinFT = await SkinFT.deploy(
      "CS Common Skin Unit",
      "CSCU",
      "Common skin pool units"
    );
    await skinFT.waitForDeployment();

    const SkinNFT = await ethers.getContractFactory("SkinNFT");
    const skinNFT = await SkinNFT.deploy("CS Rare Skin NFT", "CSRN");
    await skinNFT.waitForDeployment();

    const PlatformManager = await ethers.getContractFactory("PlatformManager");
    const manager = await PlatformManager.deploy(
      await skinFT.getAddress(),
      await skinNFT.getAddress()
    );
    await manager.waitForDeployment();

    await skinFT.transferOwnership(await manager.getAddress());
    await skinNFT.transferOwnership(await manager.getAddress());

    return { deployer, user, skinFT, skinNFT, manager };
  }

  it("classifies asset and mints FT pool units", async function () {
    const { user, skinFT, manager } = await deployAll();

    await expect(manager.classifyAsset(1001, 1, "Common skin basket"))
      .to.emit(manager, "AssetClassified");

    await expect(manager.mintPoolUnits(1001, user.address, 12))
      .to.emit(manager, "PoolMinted")
      .withArgs(1001, user.address, 12);

    expect(await skinFT.balanceOf(user.address)).to.equal(12);
  });

  it("classifies asset and mints premium NFT", async function () {
    const { user, skinNFT, manager } = await deployAll();

    await manager.classifyAsset(2001, 2, "Premium unique skin");

    await expect(
      manager.mintPremiumSkin(
        2001,
        user.address,
        "AWP | Dragon Lore",
        "Legendary",
        "Factory New",
        "Pattern-661",
        "ipfs://dragon-lore"
      )
    )
      .to.emit(manager, "PremiumSkinMinted")
      .withArgs(2001, 0, "AWP | Dragon Lore", user.address);

    expect(await skinNFT.ownerOf(0)).to.equal(user.address);
    const details = await skinNFT.getSkinDetails(0);
    expect(details.skinName).to.equal("AWP | Dragon Lore");
  });

  it("reverts if category does not match mint path", async function () {
    const { user, manager } = await deployAll();

    await manager.classifyAsset(3001, 1, "FT only asset");

    await expect(
      manager.mintPremiumSkin(
        3001,
        user.address,
        "AK-47 | Case Hardened",
        "Rare",
        "Minimal Wear",
        "Pattern-387",
        "ipfs://case-hardened"
      )
    ).to.be.revertedWith("Asset not NFT category");
  });
});
