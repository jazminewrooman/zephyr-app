# Zephyr

A mobile-first React application for managing personal medical records with secure sharing capabilities. Created for the Aleph Hackathon, Aug 31, 2025.

## Features

- **Mobile-First Design**: Optimized for mobile devices with responsive design

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Tech Stack

- React 18
- Tailwind CSS (via CDN)
- ethers.js for wallet connection
- Reown AppKit (WalletConnect) for crypto wallet connection
- QRCode library for generating QR codes
- Mobile-first responsive design
- Backend deployed at: https://github.com/RuthChisom/zephyr-backend
- Backend uses Filecoin blockchain for storage, Lisk for wallet connection, smart contracts for access control
- App deployed at: https://zephyrapp.netlify.app/

## Built For — Hackathon Tracks

| Track               | Integration Highlights                                                                 |
|---------------------|----------------------------------------------------------------------------------------|
| ✅ Consumer apps          | Empowering patients to manage their own medical data                                   |
| ✅ Privacy    | Medical data is highly sensitive information, and this app handles it with the utmost confidentiality (encrypted). |

## Usage

- Tap "Show QR" on the emergency card to display emergency medical information
- Use quick actions to scan documents, add records, or generate share links
- Configure sharing permissions and generate secure QR codes for healthcare providers
- Navigate between different sections using the bottom tab bar
