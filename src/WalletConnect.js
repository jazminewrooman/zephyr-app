import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import QRCode from 'qrcode';

const WalletConnect = ({ onFileSelected, onClose }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [provider, setProvider] = useState(null);
  const [networkInfo, setNetworkInfo] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [walletConnectQR, setWalletConnectQR] = useState('');

  useEffect(() => {
    // Detect if mobile device
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || window.opera;
      return /android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase());
    };
    
    setIsMobile(checkMobile());
    checkWalletConnection();
    
    // Listen for account changes (desktop only)
    if (window.ethereum && !checkMobile()) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
    }

    return () => {
      if (window.ethereum && !isMobile) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, []);

  const handleAccountsChanged = (accounts) => {
    if (accounts.length === 0) {
      setIsConnected(false);
      setAccount(null);
      setProvider(null);
    } else {
      setAccount(accounts[0]);
    }
  };

  const handleChainChanged = (chainId) => {
    window.location.reload();
  };

  const checkWalletConnection = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        
        if (accounts.length > 0) {
          const network = await provider.getNetwork();
          setIsConnected(true);
          setAccount(accounts[0]);
          setProvider(provider);
          setNetworkInfo(network);
        }
      } catch (error) {
        console.error('Error checking wallet connection:', error);
      }
    }
  };

  const connectWallet = async () => {
    try {
      if (isMobile || typeof window.ethereum === 'undefined') {
        // Use WalletConnect for mobile or when no injected wallet
        await connectWithWalletConnect();
      } else {
        // Use MetaMask for desktop
        await connectWithMetaMask();
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      alert('Error connecting wallet. Please try again.');
    }
  };

  const connectWithMetaMask = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    
    // Request account access
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const network = await provider.getNetwork();
    
    setProvider(provider);
    setAccount(accounts[0]);
    setNetworkInfo(network);
    setIsConnected(true);
  };

  const connectWithWalletConnect = async () => {
    // Generate WalletConnect URI for mobile wallets
    const wcUri = `wc:${Math.random().toString(36).substring(2, 15)}@1?bridge=https%3A%2F%2Fbridge.walletconnect.org&key=${Math.random().toString(36).substring(2, 15)}`;
    
    // Generate QR code
    const qrCodeDataUrl = await QRCode.toDataURL(wcUri, {
      width: 200,
      margin: 2,
      color: {
        dark: '#0f172a',
        light: '#ffffff'
      }
    });
    
    setWalletConnectQR(qrCodeDataUrl);
    
    // Simulate connection after QR scan (for demo purposes)
    setTimeout(() => {
      const mockAddress = '0x' + Math.random().toString(16).substring(2, 42);
      setAccount(mockAddress);
      setIsConnected(true);
      setWalletConnectQR('');
    }, 5000); // Simulate 5 second connection delay
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
    } else {
      alert('Please select a PDF file only.');
    }
  };

  const readFileAsBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result.split(',')[1]); // Remove data:application/pdf;base64, prefix
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const uploadToBackend = async (file, walletAddress) => {
    setUploading(true);
    
    try {
      // Read file content as base64
      const fileContent = await readFileAsBase64(file);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock backend response
      const mockResult = {
        recordId: "720e47271a481fdb710783aee984eb55",
        filePath: "/opt/render/project/src/uploads/720e47271a481fdb710783aee984eb55.enc",
        hash: "99b915d1f7f2311d55c635ae9e59169a0a96ad20a78110508781a37376fe6bea"
      };
      
      console.log('Mock Backend Response:', mockResult);
      setUploading(false);
      setUploadComplete(true);
      
      return {
        success: true,
        fileName: file.name,
        fileSize: file.size,
        uploadedBy: walletAddress,
        timestamp: new Date().toISOString(),
        backendResponse: mockResult,
        // Create new record for timeline
        newRecord: {
          date: new Date().toLocaleDateString('en-US', { 
            day: '2-digit', 
            month: 'short', 
            year: 'numeric' 
          }).toUpperCase(),
          title: file.name.replace('.txt', '').replace('.pdf', ''),
          meta: `${file.type.includes('pdf') ? 'PDF' : 'TXT'} • ${(file.size / 1024).toFixed(1)} KB • Blockchain`,
          tag: 'Upload',
          id: Date.now(),
          recordId: mockResult.recordId,
          hash: mockResult.hash
        }
      };
      
    } catch (error) {
      console.error('Backend upload error:', error);
      setUploading(false);
      throw new Error(`Upload failed: ${error.message}`);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !account) return;
    
    try {
      const result = await uploadToBackend(selectedFile, account);
      
      // Call parent callback if provided
      if (onFileSelected) {
        onFileSelected(result);
      }
      
      // Auto-close after successful upload
      setTimeout(() => {
        onClose();
      }, 2000);
      
    } catch (error) {
      console.error('Upload error:', error);
      alert(`Upload failed: ${error.message}`);
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Upload Medical Record</h2>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-xl"
          >
            ×
          </button>
        </div>

        {!isConnected ? (
          <div className="text-center space-y-4">
            {walletConnectQR ? (
              <div>
                <div className="w-16 h-16 mx-auto bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl">📱</span>
                </div>
                <h3 className="font-medium mb-2">Scan with Mobile Wallet</h3>
                <div className="bg-white border border-slate-200 rounded-xl p-4 mb-4">
                  <img src={walletConnectQR} alt="WalletConnect QR" className="w-48 h-48 mx-auto" />
                </div>
                <p className="text-xs text-slate-500">
                  Open MetaMask, Trust Wallet, or any WalletConnect compatible wallet and scan this QR code
                </p>
                <div className="flex items-center justify-center mt-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                  </div>
                  <span className="ml-2 text-xs text-slate-500">Waiting for connection...</span>
                </div>
              </div>
            ) : (
              <div>
                <div className="w-16 h-16 mx-auto bg-emerald-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🔗</span>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Connect Your Wallet</h3>
                  <p className="text-sm text-slate-600 mb-4">
                    {isMobile 
                      ? "Generate QR code to connect with your mobile wallet (MetaMask, Trust Wallet, etc.)"
                      : "Connect your wallet to securely upload and manage your medical records on the blockchain."
                    }
                  </p>
                </div>
                <button
                  onClick={connectWallet}
                  className="w-full bg-emerald-600 text-white py-3 rounded-xl font-medium hover:bg-emerald-700 transition"
                >
                  {isMobile ? "Generate QR Code" : "Connect Wallet"}
                </button>
              </div>
            )}
          </div>
        ) : uploadComplete ? (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">✅</span>
            </div>
            <div>
              <h3 className="font-medium text-green-600 mb-2">Upload Successful!</h3>
              <p className="text-sm text-slate-600">
                Your medical record has been securely uploaded to the blockchain.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-3 bg-green-50 border border-green-200 rounded-xl">
              <div className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                <span className="text-sm text-green-700">
                  Wallet Connected: {account?.slice(0, 6)}...{account?.slice(-4)}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Select PDF File
              </label>
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileSelect}
                className="w-full border border-slate-300 rounded-lg p-2 text-sm"
              />
              {selectedFile && (
                <div className="mt-2 p-2 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-600">
                    Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
                  </p>
                </div>
              )}
            </div>

            <button
              onClick={handleUpload}
              disabled={!selectedFile || uploading}
              className={`w-full py-3 rounded-xl font-medium transition ${
                !selectedFile || uploading
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-emerald-600 text-white hover:bg-emerald-700'
              }`}
            >
              {uploading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Uploading to Blockchain...
                </div>
              ) : (
                'Upload to Blockchain'
              )}
            </button>

            {uploading && (
              <div className="text-center">
                <p className="text-xs text-slate-500">
                  Securing your data with blockchain technology...
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default WalletConnect;
