# CS2 Skin Hybrid Platform (Blockchain-Native Asset Model, PoC)

> Academic proof-of-concept only.  
> This project **does not** connect to Steam/Valve/real inventories.  
> It simulates how game-skin-like assets can be represented as blockchain-native financial primitives.

---

## 1) What this project is

这是一个课程作业用的最小可运行原型，核心目标是展示：

`Asset -> Classification -> Token Form -> Market Logic`

本项目通过三个合约完成这个逻辑链：

1. **SkinFT (ERC-20)**：用于“普通/标准化”皮肤池份额（可互换）
2. **SkinNFT (ERC-721)**：用于“稀有/个体化”皮肤（不可互换）
3. **PlatformManager (协调层)**：先分类，再路由到 FT 或 NFT 铸造路径

这使它不是“两个并排 demo”，而是一个统一的平台 workflow。

---

## 2) Why there are two token contracts + one manager

- **ERC-20** 适合同质化程度高、交易像“单位份额”的资产。
- **ERC-721** 适合有显著个体差异（名称/稀有度/磨损/图案）的资产。
- **PlatformManager** 负责分类和调度，体现平台逻辑：
  - `classifyAsset(assetId, category, note)`
  - `mintPoolUnits(...)` -> 走 FT
  - `mintPremiumSkin(...)` -> 走 NFT

---

## 3) Project structure

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
```

---

## 4) Prerequisites

- Node.js 18+
- npm
- Sepolia test ETH
- RPC URL (Infura/Alchemy 等)

---

## 5) Installation

```bash
npm install
cp .env.example .env
```

在 `.env` 填写：

```env
RPC_URL=
PRIVATE_KEY=
ETHERSCAN_API_KEY=
```

- `PRIVATE_KEY` 不要带 `0x`
- 钱包地址要有 Sepolia 测试币

---

## 6) Compile

```bash
npm run compile
```

---

## 7) Run tests

```bash
npm test
```

测试覆盖：
- FT: mint / burn / transfer
- NFT: mint / ownerOf / metadata getter / burn
- PlatformManager: 分类、FT 路由铸造、NFT 路由铸造、错误分类回滚

---

## 8) Deploy to Sepolia

### Option A: Deploy each token contract separately

```bash
npm run deploy:ft:sepolia
npm run deploy:nft:sepolia
```

### Option B (recommended): One-shot platform deployment

```bash
npm run deploy:platform:sepolia
```

该脚本会：
1. 部署 SkinFT
2. 部署 SkinNFT
3. 部署 PlatformManager
4. 将 SkinFT / SkinNFT 的 owner 转移给 PlatformManager

控制台会打印 3 个地址：
- SkinFT deployed to: `0x...`
- SkinNFT deployed to: `0x...`
- PlatformManager deployed to: `0x...`

---

## 9) Verify deployment success

1. 复制终端输出地址
2. 打开 <https://sepolia.etherscan.io>
3. 搜索地址，确认存在 bytecode 和部署交易

---

## 10) Where to find contract addresses for your report

最直接来源：部署脚本终端输出。  
报告中建议记录：
- Network: Sepolia
- SkinFT CA
- SkinNFT CA
- PlatformManager CA
- 三笔部署交易哈希

---

## 11) Example post-deployment workflow (platform logic)

假设你要模拟两类资产：

### Common asset (FT path)
1. `classifyAsset(1001, 1, "Common pool")`
2. `mintPoolUnits(1001, studentWallet, 50)`

### Premium asset (NFT path)
1. `classifyAsset(2001, 2, "Premium unique skin")`
2. `mintPremiumSkin(2001, studentWallet, "AWP | Asiimov", "Rare", "Factory New", "Pattern-123", "ipfs://...")`

---

## 12) Academic note (for report text)

This platform demonstrates a **blockchain-native asset model** where token standards are chosen by economic heterogeneity, not by technology preference alone.

- Common, pooled claims -> ERC-20
- Unique, attribute-rich claims -> ERC-721
- Classification + routing is enforced by PlatformManager to maintain coherent platform behavior.

---

## 13) Important limitations (state in report)

- No real game asset integration
- No marketplace/auction pricing engine
- Centralized governance via contract owner (academic simplification)
- Designed for concept validation, not production
