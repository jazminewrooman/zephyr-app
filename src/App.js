import React, { useState, useRef, useEffect } from 'react';
import QRCode from 'qrcode';
import RecordDetail from './RecordDetail';
import WalletConnect from './WalletConnect';

function App() {
  const [activeTab, setActiveTab] = useState('Home');
  const [showEmergencyQR, setShowEmergencyQR] = useState(false);
  const [shareSettings, setShareSettings] = useState({
    clinicalSummary: true,
    medications: true,
    labs: false,
    imaging: false
  });
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showWalletConnect, setShowWalletConnect] = useState(false);
  const [medicalRecords, setMedicalRecords] = useState([
    { 
      date: '12 AUG 2025', 
      title: 'Complete blood count', 
      meta: 'PDF • 2 pages • Lab ABC', 
      tag: 'Lab',
      id: 1
    },
    { 
      date: '03 AUG 2025', 
      title: 'Appointment Dr. Lopez', 
      meta: 'Diagnosis: allergic rhinitis', 
      tag: 'Note',
      id: 2
    },
    { 
      date: '20 JUL 2025', 
      title: 'Chest X-ray', 
      meta: 'DICOM attached • HMG Hospital', 
      tag: 'Imaging',
      id: 3
    },
  ]);
  const canvasRef = useRef(null);

  // Generate QR code for sharing
  const generateQR = async () => {
    const shareData = {
      patient: 'Jazmine VB',
      curp: 'JAVB750101MDFRZN09',
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      permissions: shareSettings,
      token: Math.random().toString(36).substring(2, 15)
    };
    
    try {
      const qrString = await QRCode.toDataURL(JSON.stringify(shareData), {
        width: 200,
        margin: 2,
        color: {
          dark: '#0f172a',
          light: '#ffffff'
        }
      });
      setQrDataUrl(qrString);
    } catch (err) {
      console.error('Error generating QR code:', err);
    }
  };

  const copyShareLink = () => {
    const shareLink = `https://myhealth.app/share/${Math.random().toString(36).substring(2, 15)}`;
    navigator.clipboard.writeText(shareLink);
    alert('Link copied to clipboard!');
  };

  const handleShareSettingChange = (setting) => {
    setShareSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const openRecord = (record) => {
    setSelectedRecord(record);
  };

  const closeRecord = () => {
    setSelectedRecord(null);
  };

  const handleWalletAction = () => {
    setShowWalletConnect(true);
  };

  const handleFileUploaded = (uploadResult) => {
    console.log('File uploaded successfully:', uploadResult);
    
    // Add new record to timeline
    if (uploadResult.newRecord) {
      setMedicalRecords(prev => [uploadResult.newRecord, ...prev]);
    }
    
    alert(`File uploaded successfully! Record ID: ${uploadResult.backendResponse.recordId.slice(0, 8)}...`);
  };

  const closeWalletConnect = () => {
    setShowWalletConnect(false);
  };

  const quickActions = [
    { label: 'Scan', icon: '📄', action: handleWalletAction },
    { label: 'Add', icon: '➕', action: handleWalletAction },
    { label: 'Share', icon: '🔗', action: () => generateQR() },
  ];

  const tabs = [
    { label: 'Home', icon: '🏠' },
    { label: 'Records', icon: '📁' },
    { label: 'Share', icon: '🔒' },
    { label: 'Profile', icon: '👤' },
  ];

  // Show record detail view if a record is selected
  if (selectedRecord) {
    return <RecordDetail record={selectedRecord} onBack={closeRecord} />;
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-white to-slate-50 text-slate-800">
      <div className="relative w-full min-h-screen bg-white">
        {/* Status bar */}
        <div className="flex items-center justify-between px-5 pt-5 text-xs text-slate-500">
          <span>{new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}</span>
          <div className="flex gap-2 items-center">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <div className="h-3 w-5 rounded-sm bg-slate-200 relative overflow-hidden">
              <div className="absolute bottom-0 left-0 w-4/5 h-full bg-slate-700" />
            </div>
          </div>
        </div>

        {/* Header */}
        <header className="px-5 pt-3 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <img src="zephyrlogo.png" alt="Logo" className="w-6 h-6" />
              <h1 className="text-lg font-semibold tracking-tight">Zephyr</h1>
              <p className="text-[11px] text-slate-500">Where Health Meets Innovation</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 text-[11px] rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition">
                Synced
              </button>
              <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-emerald-500 to-lime-400 text-black grid place-items-center text-xs font-bold">
                JV
              </div>
            </div>
          </div>
        </header>

        {/* Scroll area */}
        <main className="px-5 space-y-4 pb-28 overflow-y-auto">
          {/* Emergency Card */}
          <section className="rounded-2xl p-4 bg-red-50 border border-red-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold">Emergency card</h2>
                <p className="text-[11px] text-red-600/80">Allergies: Penicillin • Blood type: O+</p>
              </div>
              <button 
                onClick={() => setShowEmergencyQR(!showEmergencyQR)}
                className="px-3 py-1.5 text-[11px] rounded-full bg-red-100 border border-red-200 hover:bg-red-200/60 transition"
              >
                {showEmergencyQR ? 'Hide QR' : 'Show QR'}
              </button>
            </div>
            {showEmergencyQR && (
              <div className="mt-3 p-3 bg-white rounded-xl border border-red-200">
                <div className="text-center">
                  <div className="inline-block p-2 bg-white border border-slate-200 rounded-lg">
                    <svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                      <rect width="100" height="100" fill="#fff"/>
                      <rect x="10" y="10" width="25" height="25" fill="#dc2626"/>
                      <rect x="65" y="10" width="25" height="25" fill="#dc2626"/>
                      <rect x="10" y="65" width="25" height="25" fill="#dc2626"/>
                      <rect x="40" y="40" width="10" height="10" fill="#dc2626"/>
                      <rect x="50" y="40" width="10" height="10" fill="#dc2626"/>
                      <rect x="40" y="50" width="10" height="10" fill="#dc2626"/>
                      <rect x="50" y="50" width="10" height="10" fill="#dc2626"/>
                    </svg>
                  </div>
                  <p className="text-[10px] text-red-600 mt-2">Emergency Medical Info</p>
                </div>
              </div>
            )}
          </section>

          {/* Profile summary */}
          <section className="rounded-2xl p-4 bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-slate-100 grid place-items-center">🩺</div>
              <div>
                <p className="text-xs text-slate-500">Patient</p>
                <p className="text-sm font-medium">Jazmine VB</p>
                <p className="text-[11px] text-slate-500">CURP: JAVB750101MDFRZN09</p>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2 text-[11px]">
              <span className="px-2 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700">Clinical summary</span>
              <span className="px-2 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700">Medications</span>
              <span className="px-2 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-700">Labs</span>
            </div>
          </section>

          {/* Timeline */}
          <section className="rounded-2xl p-4 bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-semibold">Timeline</h2>
              <button className="text-[11px] underline decoration-dotted">View all</button>
            </div>
            <ul className="space-y-3">
              {medicalRecords.map((item) => (
                <li key={item.id} className="flex gap-3">
                  <div className="mt-1.5 h-2 w-2 rounded-full bg-emerald-500" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-[11px] text-slate-500">{item.date}</p>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-600">
                        {item.tag}
                      </span>
                    </div>
                    <p className="text-sm font-medium">{item.title}</p>
                    <p className="text-[11px] text-slate-500">{item.meta}</p>
                  </div>
                  <button 
                    onClick={() => openRecord(item)}
                    className="self-center text-[11px] px-2 py-1 rounded-md bg-slate-100 border border-slate-200 hover:bg-slate-200"
                  >
                    Open
                  </button>
                </li>
              ))}
            </ul>
          </section>

          {/* Quick actions */}
          <section className="grid grid-cols-3 gap-2">
            {quickActions.map((action, i) => (
              <button 
                key={i} 
                onClick={action.action}
                className="rounded-2xl py-3 bg-slate-50 border border-slate-200 hover:bg-slate-100 transition"
              >
                <div className="text-xl">{action.icon}</div>
                <div className="text-[11px] mt-1">{action.label}</div>
              </button>
            ))}
          </section>

          {/* Share preview card */}
          <section className="rounded-2xl p-4 bg-emerald-50 border border-emerald-200">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold">Share with a doctor</h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-white border border-emerald-200 text-emerald-700">
                Full control
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <label className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  checked={shareSettings.clinicalSummary}
                  onChange={() => handleShareSettingChange('clinicalSummary')}
                  className="accent-emerald-600" 
                /> 
                Clinical summary
              </label>
              <label className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  checked={shareSettings.medications}
                  onChange={() => handleShareSettingChange('medications')}
                  className="accent-emerald-600" 
                /> 
                Medications
              </label>
              <label className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  checked={shareSettings.labs}
                  onChange={() => handleShareSettingChange('labs')}
                  className="accent-emerald-600" 
                /> 
                Labs (PDF)
              </label>
              <label className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  checked={shareSettings.imaging}
                  onChange={() => handleShareSettingChange('imaging')}
                  className="accent-emerald-600" 
                /> 
                Imaging (DICOM)
              </label>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-[11px]">
              <div className="rounded-xl bg-white border border-slate-200 p-2">
                <p className="text-slate-500">Expires in</p>
                <p className="text-sm font-semibold">24 hours</p>
              </div>
              <div className="rounded-xl bg-white border border-slate-200 p-2">
                <p className="text-slate-500">Recipient</p>
                <p className="text-sm font-semibold">Dr. Lopez (HMG)</p>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-3">
              <div className="p-2 bg-white border border-slate-200 rounded-lg">
                {qrDataUrl ? (
                  <img src={qrDataUrl} alt="QR Code" className="w-16 h-16" />
                ) : (
                  <svg width="66" height="66" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
                    <rect width="66" height="66" fill="#fff"/>
                    <rect x="4" y="4" width="18" height="18" fill="#0f172a"/>
                    <rect x="44" y="4" width="18" height="18" fill="#0f172a"/>
                    <rect x="4" y="44" width="18" height="18" fill="#0f172a"/>
                    <rect x="26" y="26" width="6" height="6" fill="#0f172a"/>
                    <rect x="36" y="26" width="6" height="6" fill="#0f172a"/>
                    <rect x="26" y="36" width="6" height="6" fill="#0f172a"/>
                    <rect x="36" y="36" width="6" height="6" fill="#0f172a"/>
                    <rect x="30" y="10" width="6" height="6" fill="#0f172a"/>
                    <rect x="50" y="30" width="6" height="6" fill="#0f172a"/>
                    <rect x="10" y="30" width="6" height="6" fill="#0f172a"/>
                  </svg>
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold">Dynamic QR (one‑time token)</p>
                <p className="text-[11px] text-slate-500">
                  Scan at reception to grant temporary, granular access. Everything is audited.
                </p>
              </div>
            </div>
            <div className="mt-3 flex gap-2">
              <button 
                onClick={generateQR}
                className="flex-1 rounded-xl py-2 bg-emerald-600 text-white font-medium hover:bg-emerald-500 transition"
              >
                Generate link
              </button>
              <button 
                onClick={copyShareLink}
                className="flex-1 rounded-xl py-2 bg-white border border-slate-200 hover:bg-slate-100 transition"
              >
                Copy link
              </button>
            </div>
          </section>
        </main>

        {/* Bottom Nav */}
        <nav className="fixed bottom-0 left-0 right-0 h-20 bg-white backdrop-blur border-t border-slate-200 z-10">
          <div className="grid grid-cols-4 h-full">
            {tabs.map((tab) => (
              <button 
                key={tab.label}
                onClick={() => setActiveTab(tab.label)}
                className={`text-xs flex flex-col items-center justify-center gap-1 transition ${
                  activeTab === tab.label ? 'text-emerald-600' : 'text-slate-400'
                }`}
              >
                <span className="text-xl">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </nav>

        {/* Wallet Connect Modal */}
        {showWalletConnect && (
          <WalletConnect 
            onFileSelected={handleFileUploaded}
            onClose={closeWalletConnect}
          />
        )}
      </div>
    </div>
  );
}

export default App;
