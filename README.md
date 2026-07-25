# <img src="public/logo.png" width="32" height="32" style="vertical-align:middle" /> Cozy Cats — On-Chain Idle Merge Game

**Merge cats, earn passive income, climb the leaderboard — all on Celo.**

Cozy Cats is a pixel-art idle merge game built for [MiniPay](https://www.opera.com/products/minipay), Opera's stablecoin wallet with 16M+ users. Drag cats together to merge them into higher levels, earn gold passively over time, and compete across six leagues on a global leaderboard. Speed boosts and offline-reward multipliers are paid in **USDm** through a verified smart contract on Celo mainnet.

No fake demos. Real transactions, real stakes, real players.

---
 
## ✨ What Makes This Different
 
| Feature | How |
| --- | --- |
| **Real on-chain purchases** | Players pay in USDm for boosts and reward multipliers via a verified `MergeCat` contract on Celo mainnet |
| **Built for MiniPay** | Auto-connects inside MiniPay — no connect button, wallet detection via `window.ethereum.isMiniPay` |
| **Secure auth (SIWE)** | Sign-In with Ethereum — nonce-protected message signing, sessions in httpOnly + secure cookies, no passwords, no custody |
| **Idle + merge mechanics** | Passive income that keeps earning while you're away, with satisfying drag-to-merge progression |
| **Fee abstraction** | Gas paid in stablecoins — players never need CELO, everything runs on USDm |
| **Six-league leaderboard** | Ranked competition from Bronze to Amethyst, with live pagination and your position tracked |
| **Pixel-art aesthetic** | Hand-crafted sprites, custom animations, mobile-first single-column layout |
 
---

## 🏗️ Architecture

```
cat-merge/
└── packages/
    └── react-app/              # Next.js 15 + TypeScript + Tailwind
        ├── app/                # App router — main board, layout
        ├── components/         # Board, modals (shop, boost, welcome, top), UI
        ├── hooks/              # usePurchase, useLeaderboard, useProfileEvents
        ├── lib/                # contracts, store (Zustand), api, formatters
        ├── providers/          # wagmi / RainbowKit config
        └── types/              # shared TypeScript types
```

The project spans three repositories:
 
| Repo | What |
| --- | --- |
| [cat-merge](https://github.com/Yaroslavmyronov/cat-merge) | **Frontend** — Next.js game client (this repo) |
| [merge-cat-contract](https://github.com/DmitryDatsko/merge-cat-contract) | **Smart contracts** — Solidity, deployed & verified on Celo mainnet |
| [MergeCat](https://github.com/DmitryDatsko/MergeCat) | **Backend** — game logic, profile/board state, SSE notifications, leaderboard |
 
---

## ✅ Current Status

**Live on Celo Mainnet (chain 42220) with real USDm purchases.** Contract deployed and source-verified.

- **Play now:** [mergecat.duckdns.org](https://mergecat.duckdns.org/) — full game, shop, boosts, leaderboard
- **Contract:** deployed + verified on [Celoscan](https://celoscan.io/address/0x547b75ebf3a93083303225c49441d975f06eabd4)
- **Frontend:** deployed and live (Next.js 15)
- **MiniPay:** auto-connect hook implemented — runs natively inside the wallet
- **Payments:** approve + purchase flow in USDm, with offline rewards and stacking boosts

---

## 🌐 Deployments

**Celo Mainnet (chain 42220) — live + verified**

| Contract | Address |
| --- | --- |
| MergeCat | `0x547B75EBf3a93083303225C49441D975f06eabD4` |
| Payment token (USDm) | `0x765DE816845861e75A25fCA122bb6898B8B1282a` |

---

## 🎮 Game Loop

```
1. Connect wallet          →  Auto-connects inside MiniPay, no button needed
2. Merge cats              →  Drag two same-level cats together to create the next level
3. Earn passive income     →  Cats generate gold over time, even while you're away
4. Come back for rewards   →  Claim offline earnings — free, or pay USDm to double them
5. Buy speed boosts        →  Pay USDm for 2× income (75min / 4h / 24h), boosts stack
6. Climb the leaderboard   →  Compete across six leagues by total earned
```

---
 
## 🔐 Authentication
 
Players authenticate with **Sign-In with Ethereum (SIWE)** — the wallet signs a nonce-protected message to prove ownership, verified server-side. The nonce guards against replay attacks; sessions are stored in **httpOnly, secure** cookies, so they're inaccessible to client-side JavaScript and only sent over HTTPS.
 
No passwords. No seed phrases handled by us. No custody of user funds — the wallet stays in the player's control at all times.
 
---

## 💰 On-Chain Purchases

All purchases go through the `MergeCat` contract, paid in USDm:

| Event | What it does |
| --- | --- |
| `BoostSpeed75m` / `BoostSpeed4h` / `BoostSpeed24h` | Doubles income for the chosen duration; buying more stacks the timer |
| `OfflineReward` | Doubles the gold earned while away |

The contract emits a `Purchased` event; the backend listens and applies the effect in-game. Payments stay verifiable on-chain while game state stays authoritative on the server.

---

## 🔧 Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | Next.js 15, TypeScript, Tailwind CSS, Framer Motion |
| Web3 | wagmi, viem, RainbowKit |
| State | Zustand |
| Wallet | MiniPay (auto-connect), injected connectors |
| Drag & drop | dnd-kit |
| Smart Contract | Solidity, verified on Celo mainnet |
| Real-time | Server-Sent Events (profile & purchase updates) |
| Network | Celo Mainnet (USDm payments, fee abstraction) |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- A Celo wallet (MiniPay on mobile, or any injected wallet)
- USDm for purchases (available in MiniPay)

### Installation

```bash
# Clone the repo
git clone https://github.com/Yaroslavmyronov/cat-merge
cd cat-merge/react-app

# Install dependencies
npm install

# Set up environment
cp .env.example .env.local
# Add your API URL and RPC endpoint

# Run the dev server
npm run dev
```

Open [localhost:3000](http://localhost:3000) to play locally.

### Environment

```
NEXT_PUBLIC_API_URL=your-backend-url
NEXT_PUBLIC_RPC_URL=your-celo-rpc-url
```

---

## 🌐 Roadmap

- [x] Core merge mechanics + passive income
- [x] Shop, cat purchases, board persistence
- [x] USDm boost purchases via verified contract on mainnet
- [x] Offline rewards with paid 2× multiplier
- [x] Six-league leaderboard with pagination
- [x] MiniPay auto-connect
- [ ] Daily rewards & streaks
- [ ] Cat collection / cosmetics
- [ ] MiniPay Discover listing

---

## 👥 Team

- **Frontend** — [@Yaroslavmyronov](https://github.com/Yaroslavmyronov)
- **Smart contracts & backend** — [@DmitryDatsko](https://github.com/DmitryDatsko)

---

## 📄 License

MIT

---

Built for [Celo Proof of Ship](https://talent.app/~/earn/celo-proof-of-ship) Season 2 🐱
