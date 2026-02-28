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

1. **Clone the repository:**
   ```bash
   git clone <your-repository-url>
   cd carbon_credit
   ```

2. **Start the local ICP replica:**
   Run the local replica in the background:
   ```bash
   dfx start --background
   ```

3. **Deploy ICP Canisters:**
   Deploy the smart contracts (canisters) to the local replica. You can use the setup script to install dependencies and deploy the backend:
   ```bash
   npm run setup
   ```
   Or deploy manually:
   ```bash
   dfx deploy
   ```

4. **Start the Frontend Development Server:**
   ```bash
   npm start
   ```
   This will start the Vite local development server proxying API requests to the ICP replica. The frontend will be available at `http://localhost:3000`.

5. **Start the Backend Server:**
   ```bash
   node src/carbon_credit_backend/server.js
   ```

## 📚 Documentation
To learn more about the underlying technologies used in this project:
- [Internet Computer Quick Start](https://internetcomputer.org/docs/current/developer-docs/setup/deploy-locally)
- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://reactjs.org/)

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

## 📜 License
This project is licensed under the MIT License.
