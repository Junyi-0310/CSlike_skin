const hre = require("hardhat");

async function main() {
  // You can edit these constructor arguments directly for your coursework report.
  const name = "CS Rare Skin NFT";
  const symbol = "CSRN";

  const SkinNFT = await hre.ethers.getContractFactory("SkinNFT");
  const skinNFT = await SkinNFT.deploy(name, symbol);
  await skinNFT.waitForDeployment();

  const address = await skinNFT.getAddress();
  console.log("SkinNFT deployed to:", address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
