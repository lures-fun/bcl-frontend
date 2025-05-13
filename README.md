# 🐟 BCL Frontend (Next.js)

<p align="center">
  <img src="src/assets/BCL_logo.png" alt="BCL Logo" width="200" />
</p>

## 🔥 Project Overview

BCL Frontend is the Next.js-based web client for the Black Bass Club ecosystem. It offers anglers and enthusiasts an immersive experience to track their catches, explore community rankings, purchase gear, and engage with the Web3-enabled fishing world on Solana.

## 🚀 Key Features

- 🎣 **Catch Tracker**: Log your fishing results and visualize performance over time.
- 🏆 **Hall of Fame & Leaderboards**: View top anglers, trophy galleries, and seasonal rankings.
- 🔒 **Web3 Authentication**: Connect your Solana wallet and manage tokens using NokeyWallet adapter.
- ⚡ **Fast & SEO-Friendly**: Built with Next.js, optimized for performance and search engines.

## 🛠️ Tech Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Blockchain**: Solana Web3.js & SPL Token
- **Wallet Adapter**: @nokey-wallet/adapter
- **Deployment**: Vercel

## 📦 Installation & Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-org/bcl-frontend.git
   cd bcl-frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start development server**

   ```bash
   npm run dev
   ```

## 🌍 Project Structure

```
public/          # Static assets and locales
src/             # Source code
├─ app/          # Next.js app directory (pages, layouts, providers)
├─ components/   # Reusable UI components
├─ hooks/        # Custom React hooks
├─ services/     # API clients & blockchain utilities
├─ utils/        # Helper functions and validation rules
├─ styles/       # Global styles and Tailwind config
└─ types/        # Shared TypeScript types
```
