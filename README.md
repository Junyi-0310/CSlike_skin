# CS2 Skin Hybrid Tokenisation Platform (Blockchain-Native Asset Model, PoC)

> Academic proof-of-concept only.  
> This project **does not** connect to Steam/Valve/real inventories.  
> It demonstrates how game-skin-like assets can be represented using a blockchain-native tokenisation framework.

---

## 1. Overview

This project implements a **hybrid tokenisation platform prototype**, where digital assets are:

> **Classified → Tokenised → Managed via smart contracts**

The system is designed to reflect the economic differences between:

- **Standardised assets (fungible)**
- **Unique premium assets (non-fungible)**

---

## 2. Core Architecture

The platform is composed of three smart contracts:

### 🔹 SkinFT (ERC-20)
Represents **pooled/common skins** as interchangeable units.

- Fungible representation
- `decimals = 0` (whole units)
- Supports mint / burn / transfer

---

### 🔹 SkinNFT (ERC-721)
Represents **premium individual skins** with unique attributes.

- Non-fungible tokens
- Metadata includes:
  - skin name
  - rarity
  - wear level
  - pattern
- Supports mint / burn / ownership tracking

---

### 🔹 PlatformManager (Core Logic Layer)
Acts as the **platform coordination layer**, responsible for:

- Asset classification
- Routing minting logic (FT vs NFT)
- Maintaining platform-level consistency

Key functions:
- `classifyAsset(...)`
- `mintPoolUnits(...)`
- `mintPremiumSkin(...)`

---

## 3. Why Hybrid Tokenisation?

This project demonstrates that:

- **ERC-20** is suitable for:
  - pooled exposure
  - standardised assets
  - fractional-like representation

- **ERC-721** is suitable for:
  - unique items
  - attribute-rich assets
  - ownership-specific value

- **PlatformManager enforces the logic**, ensuring that tokenisation reflects **economic characteristics**, not just technical choice.

---

## 4. Project Structure

```bash
.
├── contracts
│   ├── SkinFT.sol
│   ├── SkinNFT.sol
│   └── PlatformManager.sol
├── scripts
│   ├── deploy-ft.js
│   ├── deploy-nft.js
│   └── deploy-platform.js
├── test
│   ├── SkinFT.test.js
│   ├── SkinNFT.test.js
│   └── PlatformManager.test.js
├── hardhat.config.js
├── package.json
├── .env.example
└── README.md
