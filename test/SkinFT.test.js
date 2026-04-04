const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SkinFT", function () {
  async function deploySkinFT() {
    const [owner, user] = await ethers.getSigners();
    const SkinFT = await ethers.getContractFactory("SkinFT");
    const skinFT = await SkinFT.deploy(
      "CS Common Skin Unit",
      "CSCU",
      "Common skin basket (academic simulation)"
    );
    await skinFT.waitForDeployment();
    return { skinFT, owner, user };
  }

  it("should mint tokens (owner only)", async function () {
    const { skinFT, user } = await deploySkinFT();

    await expect(skinFT.mint(user.address, 10))
      .to.emit(skinFT, "SkinFTMinted")
      .withArgs(user.address, 10);

    expect(await skinFT.balanceOf(user.address)).to.equal(10);
  });

  it("should burn tokens from owner balance", async function () {
    const { skinFT, owner } = await deploySkinFT();

    await skinFT.mint(owner.address, 8);

    await expect(skinFT.burn(3))
      .to.emit(skinFT, "SkinFTBurned")
      .withArgs(owner.address, 3);

    expect(await skinFT.balanceOf(owner.address)).to.equal(5);
  });

  it("should transfer tokens between users", async function () {
    const { skinFT, owner, user } = await deploySkinFT();

    await skinFT.mint(owner.address, 20);
    await skinFT.transfer(user.address, 7);

    expect(await skinFT.balanceOf(owner.address)).to.equal(13);
    expect(await skinFT.balanceOf(user.address)).to.equal(7);
  });
});
