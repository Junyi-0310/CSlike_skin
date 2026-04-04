const hre = require("hardhat");

async function main() {
  // You can edit these constructor arguments directly for your coursework report.
  const name = "CS Common Skin Unit";
  const symbol = "CSCU";
  const assetDescription =
    "Fungible units representing standardised/common digital game skins in an academic simulation.";

  const SkinFT = await hre.ethers.getContractFactory("SkinFT");
  const skinFT = await SkinFT.deploy(name, symbol, assetDescription);
  await skinFT.waitForDeployment();

  const address = await skinFT.getAddress();
  console.log("SkinFT deployed to:", address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
