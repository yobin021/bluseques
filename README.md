# Carbon Credit Marketplace

Welcome to the **Carbon Credit Marketplace**, a secure, transparent, and decentralized platform built on the Internet Computer (ICP) blockchain. This platform revolutionizes the trading of carbon credits while empowering government bodies with real-time monitoring and oversight capabilities. Furthermore, the platform equips industries with comprehensive tracking tools to monitor their carbon emissions, manage their existing carbon credit portfolios, and precisely track their blue carbon levels.

## 🌟 Overview

The Carbon Credit Marketplace serves as a bridge for industries to trade their carbon credits securely. By leveraging the power of blockchain technology (Internet Computer Protocol - ICP), we ensure that every transaction is immutable, transparent, and highly secure. The platform also offers a dedicated dashboard specifically designed for government officials to oversee and monitor these trades, ensuring full compliance with environmental regulations.

### 🎥 Prototype Demonstration
**Check out our working prototype:** [Google Drive - Prototype Demos & Screenshots](https://drive.google.com/drive/folders/1ZGEWoyUR1qZJQk5tQbguGVV5BKdlfSo4)

## ✨ Key Features

- **Decentralized Trading:** Industries can buy and sell carbon credits directly through an open marketplace without intermediaries.
- **Government Dashboard:** A dedicated, secure dashboard for government officials to monitor marketplace transactions in real-time, ensuring transparency and regulatory oversight.
- **Blockchain Security (ICP):** Built natively on the Internet Computer (ICP), ensuring that all transaction data is completely secure, tamper-proof, and highly scalable.
- **Interactive UI:** A highly responsive and intuitive frontend built with React, Vite, Chart.js, and D3.js to visualize trading trends.
- **Robust Backend APIs:** Powered by Node.js, Express, and PostgreSQL to handle robust user management, working alongside the trusted ICP smart contracts (canisters).

## 🛠️ Technology Stack

- **Frontend:** React.js, Vite, TypeScript, Chart.js, D3.js, Lucide Icons
- **Backend:** Node.js, Express.js, PostgreSQL (via `pg`), bcrypt
- **Blockchain Layer:** Internet Computer (ICP) - Motoko/Rust Canisters, DFINITY Agent

## 🚀 Getting Started

### Prerequisites
- Node.js (v16.0.0 or higher)
- npm (v7.0.0 or higher)
- [DFX SDK](https://internetcomputer.org/docs/current/developer-docs/setup/install) (for Internet Computer deployment)
- PostgreSQL

### Local Development Setup

To run the complete project locally, you need to start three different parts of the system. We recommend opening **three separate terminal windows/tabs** inside your `carbon_credit` folder:

1. **Start the Blockchain (Internet Computer)**
   In your **first terminal**, start the local blockchain network and deploy your smart contracts:
   ```bash
   dfx start --background
   dfx deploy
   ```

2. **Start the Database/Backend API**
   In your **second terminal**, start the Express.js and PostgreSQL backend server:
   ```bash
   node src/carbon_credit_backend/server.js
   ```
   *(This should output `Server is running on http://localhost:5000` and confirm your DB connection)*

3. **Start the Frontend Website**
   In your **third terminal**, start the Vite/React development server:
   ```bash
   npm start
   ```
   *(This will start the frontend, usually accessible at `http://localhost:3000`)*

## 📚 Documentation
To learn more about the underlying technologies used in this project:
- [Internet Computer Quick Start](https://internetcomputer.org/docs/current/developer-docs/setup/deploy-locally)
- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://reactjs.org/)

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

## 📜 License
This project is licensed under the MIT License.
