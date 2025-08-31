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

## Technologies Used

- React 18
- Tailwind CSS (via CDN)
- ethers.js for wallet connection
- Reown AppKit (WalletConnect) for crypto wallet connection
- QRCode library for generating QR codes
- Mobile-first responsive design

## Usage

- Tap "Show QR" on the emergency card to display emergency medical information
- Use quick actions to scan documents, add records, or generate share links
- Configure sharing permissions and generate secure QR codes for healthcare providers
- Navigate between different sections using the bottom tab bar
