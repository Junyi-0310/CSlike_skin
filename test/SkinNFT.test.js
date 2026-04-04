const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SkinNFT", function () {
  async function deploySkinNFT() {
    const [owner, user] = await ethers.getSigners();
    const SkinNFT = await ethers.getContractFactory("SkinNFT");
    const skinNFT = await SkinNFT.deploy("CS Rare Skin NFT", "CSRN");
    await skinNFT.waitForDeployment();
    return { skinNFT, owner, user };
  }

  it("should mint NFT and set owner correctly", async function () {
    const { skinNFT, user } = await deploySkinNFT();

    await expect(
      skinNFT.mintSkin(
        user.address,
        "AWP | Asiimov",
        "Rare",
        "Factory New",
        "Pattern-123",
        "ipfs://example-awp-asiimov"
      )
    )
      .to.emit(skinNFT, "SkinNFTMinted")
      .withArgs(user.address, 0, "AWP | Asiimov");

    expect(await skinNFT.ownerOf(0)).to.equal(user.address);
  });

  it("should return stored metadata fields", async function () {
    const { skinNFT, user } = await deploySkinNFT();

    await skinNFT.mintSkin(
      user.address,
      "AK-47 | Redline",
      "Epic",
      "Minimal Wear",
      "Pattern-999",
      "ipfs://example-ak-redline"
    );

    const details = await skinNFT.getSkinDetails(0);

    expect(details.skinName).to.equal("AK-47 | Redline");
    expect(details.rarity).to.equal("Epic");
    expect(details.wearLevel).to.equal("Minimal Wear");
    expect(details.pattern).to.equal("Pattern-999");
    expect(details.metadataURI).to.equal("ipfs://example-ak-redline");
  });

  it("should burn NFT", async function () {
    const { skinNFT, user } = await deploySkinNFT();

    await skinNFT.mintSkin(
      user.address,
      "M4A4 | Howl",
      "Legendary",
      "Field-Tested",
      "Pattern-007",
      "ipfs://example-m4a4-howl"
    );

    await expect(skinNFT.burn(0)).to.emit(skinNFT, "SkinNFTBurned").withArgs(0);

    await expect(skinNFT.ownerOf(0)).to.be.reverted;
  });
});
