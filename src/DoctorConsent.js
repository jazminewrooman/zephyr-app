import React, { useState } from 'react';

const DoctorConsent = ({ record, onClose, onConsentGranted }) => {
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDuration, setSelectedDuration] = useState('24h');
  const [selectedScope, setSelectedScope] = useState('ALL');
  const [granting, setGranting] = useState(false);
  const [grantComplete, setGrantComplete] = useState(false);

  const doctors = [
    {
      id: 1,
      name: 'Dr. Carlos Lopez',
      specialty: 'Internal Medicine',
      hospital: 'HMG Medical Center',
      address: '0x742d35Cc6634C0532925a3b8D4C0d8fB2C4D4d4d',
      verified: true
    },
    {
      id: 2,
      name: 'Dr. Ana Martinez',
      specialty: 'Radiology',
      hospital: 'HMG Hospital Imaging',
      address: '0x8ba1f109551bD432803012645Hac136c0143d160',
      verified: true
    },
    {
      id: 3,
      name: 'Dr. Roberto Silva',
      specialty: 'Emergency Medicine',
      hospital: 'Emergency Care Center',
      address: '0x9f2d4c8e7b1a5f3e6d9c8b7a6f5e4d3c2b1a0987',
      verified: false
    }
  ];

  const durations = [
    { value: '1h', label: '1 Hour', timestamp: Math.floor(Date.now() / 1000) + 3600 },
    { value: '24h', label: '24 Hours', timestamp: Math.floor(Date.now() / 1000) + 86400 },
    { value: '7d', label: '7 Days', timestamp: Math.floor(Date.now() / 1000) + 604800 },
    { value: '30d', label: '30 Days', timestamp: Math.floor(Date.now() / 1000) + 2592000 }
  ];

  const scopes = [
    { value: 'ALL', label: 'Full Access', description: 'Complete medical record access' },
    { value: 'BASIC', label: 'Basic Info', description: 'Name, age, allergies only' },
    { value: 'EMERGENCY', label: 'Emergency Only', description: 'Critical medical information' }
  ];

  const grantConsent = async () => {
    if (!selectedDoctor) {
      alert('Please select a doctor first.');
      return;
    }

    setGranting(true);

    try {
      const duration = durations.find(d => d.value === selectedDuration);
      
      // Prepare API payload
      const payload = {
        doctor: selectedDoctor.address,
        scope: selectedScope,
        expiry: duration.timestamp
      };

      // Mock API call (replace with real API when ready)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockResponse = {
        success: true
      };

      console.log('Consent API Payload:', payload);
      console.log('Consent API Response:', mockResponse);

      setGranting(false);
      setGrantComplete(true);

      // Call parent callback
      if (onConsentGranted) {
        onConsentGranted({
          doctor: selectedDoctor,
          duration: duration,
          scope: selectedScope,
          response: mockResponse
        });
      }

      // Auto-close after success
      setTimeout(() => {
        onClose();
      }, 2000);

    } catch (error) {
      console.error('Consent grant error:', error);
      alert(`Error granting consent: ${error.message}`);
      setGranting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-auto max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Share with Doctor</h2>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-xl"
          >
            ×
          </button>
        </div>

        {grantComplete ? (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">✅</span>
            </div>
            <div>
              <h3 className="font-medium text-green-600 mb-2">Access Granted!</h3>
              <p className="text-sm text-slate-600">
                {selectedDoctor?.name} now has {selectedScope.toLowerCase()} access to your record for {durations.find(d => d.value === selectedDuration)?.label.toLowerCase()}.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Record Info */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <p className="text-xs text-slate-500">Sharing Record</p>
              <p className="text-sm font-medium">{record.title}</p>
              <p className="text-xs text-slate-500">{record.date}</p>
            </div>

            {/* Doctor Selection */}
            <div>
              <label className="block text-sm font-medium mb-2">Select Doctor</label>
              <div className="space-y-2">
                {doctors.map((doctor) => (
                  <div 
                    key={doctor.id}
                    onClick={() => setSelectedDoctor(doctor)}
                    className={`p-3 border rounded-xl cursor-pointer transition ${
                      selectedDoctor?.id === doctor.id 
                        ? 'border-emerald-500 bg-emerald-50' 
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{doctor.name}</p>
                        <p className="text-xs text-slate-500">{doctor.specialty}</p>
                        <p className="text-xs text-slate-400">{doctor.hospital}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {doctor.verified && (
                          <span className="text-xs px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full">
                            ✓ Verified
                          </span>
                        )}
                        <div className={`w-4 h-4 rounded-full border-2 ${
                          selectedDoctor?.id === doctor.id 
                            ? 'border-emerald-500 bg-emerald-500' 
                            : 'border-slate-300'
                        }`}>
                          {selectedDoctor?.id === doctor.id && (
                            <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Access Scope */}
            <div>
              <label className="block text-sm font-medium mb-2">Access Level</label>
              <div className="space-y-2">
                {scopes.map((scope) => (
                  <div 
                    key={scope.value}
                    onClick={() => setSelectedScope(scope.value)}
                    className={`p-3 border rounded-xl cursor-pointer transition ${
                      selectedScope === scope.value 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{scope.label}</p>
                        <p className="text-xs text-slate-500">{scope.description}</p>
                      </div>
                      <div className={`w-4 h-4 rounded-full border-2 ${
                        selectedScope === scope.value 
                          ? 'border-blue-500 bg-blue-500' 
                          : 'border-slate-300'
                      }`}>
                        {selectedScope === scope.value && (
                          <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-medium mb-2">Access Duration</label>
              <div className="grid grid-cols-2 gap-2">
                {durations.map((duration) => (
                  <button
                    key={duration.value}
                    onClick={() => setSelectedDuration(duration.value)}
                    className={`p-3 rounded-xl border text-sm transition ${
                      selectedDuration === duration.value
                        ? 'border-purple-500 bg-purple-50 text-purple-700'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {duration.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Summary */}
            {selectedDoctor && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                <p className="text-xs text-emerald-600 font-medium mb-1">Access Summary</p>
                <p className="text-sm">
                  <strong>{selectedDoctor.name}</strong> at {selectedDoctor.hospital} will have{' '}
                  <strong>{scopes.find(s => s.value === selectedScope)?.label.toLowerCase()}</strong> for{' '}
                  <strong>{durations.find(d => d.value === selectedDuration)?.label.toLowerCase()}</strong>
                </p>
              </div>
            )}

            {/* Grant Button */}
            <button
              onClick={grantConsent}
              disabled={!selectedDoctor || granting}
              className={`w-full py-3 rounded-xl font-medium transition ${
                !selectedDoctor || granting
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-emerald-600 text-white hover:bg-emerald-700'
              }`}
            >
              {granting ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Granting Access...
                </div>
              ) : (
                'Grant Access'
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorConsent;
