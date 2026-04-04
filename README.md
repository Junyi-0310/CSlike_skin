# Hybrid Tokenisation Prototype for Digital Game Skins (Academic PoC)

This project is a **university coursework proof-of-concept** showing how digital game skin economies (inspired by CS/CS2-like markets) can be tokenised on blockchain.

> Important: This repository does **not** connect to Steam, Valve, CS2 inventory APIs, or any real user assets. It is a pure simulation for academic analysis.

---

## Why this project uses two contracts

This coursework demonstrates a **hybrid tokenisation design**:

1. **ERC-20 (`SkinFT`)** for common/standardised skins
   - Best when assets are economically similar and traded like interchangeable units.
2. **ERC-721 (`SkinNFT`)** for rare/unique skins
   - Best when each asset has unique attributes (name/rarity/wear/pattern) and should be priced individually.

This maps to the financial logic: **asset heterogeneity -> token choice -> market behavior**.

---

## Project structure

```bash
.
├── contracts
│   ├── SkinFT.sol
│   └── SkinNFT.sol
├── scripts
│   ├── deploy-ft.js
│   └── deploy-nft.js
├── test
│   ├── SkinFT.test.js
│   └── SkinNFT.test.js
├── .env.example
├── .gitignore
├── hardhat.config.js
├── package.json
└── README.md
```

---

## Prerequisites

- **Node.js 18+** (recommended LTS)
- **npm**
- A wallet private key with test ETH (Sepolia recommended)
- An RPC endpoint (e.g., Infura/Alchemy)

---

## Installation

```bash
npm install
```

If install succeeds, copy environment template:

```bash
cp .env.example .env
```

Then open `.env` and set values:

```env
RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY
PRIVATE_KEY=your_wallet_private_key_without_0x
ETHERSCAN_API_KEY=optional_for_verification
```

---

## Compile

```bash
npm run compile
```

---

## Run tests

```bash
npm test
```

Tests include:
- FT mint
- FT burn
- FT transfer
- NFT mint
- NFT ownerOf
- NFT metadata retrieval via `getSkinDetails`
- NFT burn

---

## Deploy to Sepolia testnet

### Deploy FT contract

```bash
npm run deploy:ft:sepolia
```

Expected output example:

```bash
SkinFT deployed to: 0x...
```

### Deploy NFT contract

```bash
npm run deploy:nft:sepolia
```

Expected output example:

```bash
SkinNFT deployed to: 0x...
```

---

## How to verify deployment succeeded

1. Copy the printed address from terminal output.
2. Open [https://sepolia.etherscan.io](https://sepolia.etherscan.io).
3. Paste contract address.
4. Confirm the address has contract bytecode and transactions.

(Optional) If you configure `ETHERSCAN_API_KEY`, you can add Hardhat verification later.

---

## Where to find your contract addresses (CA)

For this minimal project, addresses are printed directly by deployment scripts:
- `scripts/deploy-ft.js`
- `scripts/deploy-nft.js`

For coursework reporting, copy terminal output and include:
- Network name (e.g., Sepolia)
- FT contract address
- NFT contract address
- Deployment transaction hash (from explorer)

---

## Example interactions after deployment

You can use Etherscan "Write Contract" (after connecting wallet) or Hardhat console.

### SkinFT examples
- `mint(<address>, 100)` -> owner mints 100 whole units
- `transfer(<address>, 5)` -> transfer 5 units
- `burn(2)` -> owner burns 2 units from owner balance

### SkinNFT examples
- `mintSkin(to, skinName, rarity, wearLevel, pattern, tokenURI)`
- `ownerOf(tokenId)`
- `getSkinDetails(tokenId)`
- `burn(tokenId)`

---

## Contract design summary

### `SkinFT.sol` (ERC-20)
- Owner-controlled mint and burn
- `decimals()` returns `0` for whole-unit behavior
- Stores an `assetDescription`
- Emits clear mint/burn events

### `SkinNFT.sol` (ERC-721)
- Owner-controlled mint and burn
- Stores structured on-chain metadata:
  - `skinName`
  - `rarity`
  - `wearLevel`
  - `pattern`
- Also stores `tokenURI`
- Provides `getSkinDetails(tokenId)` getter
- Emits clear mint/burn events

---

## Academic explanation: why ERC-20 for common and ERC-721 for rare

- **Common skins** are modeled as economically similar units where exact identity is less important for pricing and transfer. ERC-20 provides lower-friction transfer and easier aggregation.
- **Rare skins** are modeled as unique items with distinct value drivers (rarity, pattern, wear). ERC-721 preserves identity and supports individualized valuation.

This hybrid model reflects a finance-oriented tokenisation principle: use token standards according to **economic properties of the underlying asset**, not technical preference alone.

---

## Notes for coursework submission

- Do **not** claim real game integration.
- Include testnet contract addresses in your report.
- Include screenshots of deployment logs and explorer pages as evidence.
