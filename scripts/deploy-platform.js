const hre = require("hardhat");

async function main() {
  const ftName = "CS Common Skin Unit";
  const ftSymbol = "CSCU";
  const ftDescription =
    "Fungible units for common digital skins in an academic simulation.";

  const nftName = "CS Rare Skin NFT";
  const nftSymbol = "CSRN";

  const SkinFT = await hre.ethers.getContractFactory("SkinFT");
  const skinFT = await SkinFT.deploy(ftName, ftSymbol, ftDescription);
  await skinFT.waitForDeployment();

  const SkinNFT = await hre.ethers.getContractFactory("SkinNFT");
  const skinNFT = await SkinNFT.deploy(nftName, nftSymbol);
  await skinNFT.waitForDeployment();

  const PlatformManager = await hre.ethers.getContractFactory("PlatformManager");
  const manager = await PlatformManager.deploy(
    await skinFT.getAddress(),
    await skinNFT.getAddress()
  );
  await manager.waitForDeployment();

  // Important: manager must become owner of both token contracts to route minting.
  await (await skinFT.transferOwnership(await manager.getAddress())).wait();
  await (await skinNFT.transferOwnership(await manager.getAddress())).wait();

  console.log("SkinFT deployed to:", await skinFT.getAddress());
  console.log("SkinNFT deployed to:", await skinNFT.getAddress());
  console.log("PlatformManager deployed to:", await manager.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
