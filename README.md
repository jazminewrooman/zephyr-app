# Zephyr

A mobile-first React application for managing personal medical records with secure sharing capabilities.

## Features

- **Emergency Card**: Quick access to critical medical information with QR code
- **Medical Timeline**: Chronological view of medical records, appointments, and test results
- **Secure Sharing**: Generate temporary QR codes and links to share specific medical data with healthcare providers
- **Mobile-First Design**: Optimized for mobile devices with responsive design
- **Interactive UI**: Real-time updates and interactive elements

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
- QRCode library for generating QR codes
- Mobile-first responsive design

## Key Components

- **Emergency Card**: Toggle QR code display for emergency medical information
- **Medical Timeline**: Interactive list of medical records with open functionality
- **Share Controls**: Granular permission settings for sharing medical data
- **QR Code Generation**: Dynamic QR codes with temporary access tokens
- **Bottom Navigation**: Tab-based navigation system

## Usage

- Tap "Show QR" on the emergency card to display emergency medical information
- Use quick actions to scan documents, add records, or generate share links
- Configure sharing permissions and generate secure QR codes for healthcare providers
- Navigate between different sections using the bottom tab bar
