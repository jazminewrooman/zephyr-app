import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

const WalletConnect = ({ onFileSelected, onClose }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [provider, setProvider] = useState(null);
  const [networkInfo, setNetworkInfo] = useState(null);

  useEffect(() => {
    checkWalletConnection();
    
    // Listen for account changes
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
    }

    return () => {
      if (window.ethereum) {
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
      if (typeof window.ethereum === 'undefined') {
        alert('Please install MetaMask or another Web3 wallet to continue.');
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      
      // Request account access
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const network = await provider.getNetwork();
      
      setProvider(provider);
      setAccount(accounts[0]);
      setNetworkInfo(network);
      setIsConnected(true);
      
    } catch (error) {
      console.error('Error connecting wallet:', error);
      if (error.code === 4001) {
        alert('Please connect your wallet to continue.');
      } else {
        alert('Error connecting wallet. Please try again.');
      }
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
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
      
      // Prepare API payload
      const payload = {
        patient: walletAddress,
        fileContent: fileContent
      };

      // Call real backend API
      const response = await fetch('https://zephyr-backend-1-u74u.onrender.com/records', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      console.log('Backend Response:', result);
      setUploading(false);
      setUploadComplete(true);
      
      return {
        success: true,
        fileName: file.name,
        fileSize: file.size,
        uploadedBy: walletAddress,
        timestamp: new Date().toISOString(),
        backendResponse: result
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
            <div className="w-16 h-16 mx-auto bg-emerald-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">🔗</span>
            </div>
            <div>
              <h3 className="font-medium mb-2">Connect Your Wallet</h3>
              <p className="text-sm text-slate-600 mb-4">
                Connect your wallet to securely upload and manage your medical records on the blockchain.
              </p>
            </div>
            <button
              onClick={connectWallet}
              className="w-full bg-emerald-600 text-white py-3 rounded-xl font-medium hover:bg-emerald-700 transition"
            >
              Connect Wallet
            </button>
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
