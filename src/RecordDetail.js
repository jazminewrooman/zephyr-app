import React from 'react';

function RecordDetail({ record, onBack }) {
  const getRecordContent = (record) => {
    switch (record.tag) {
      case 'Lab':
        return {
          sections: [
            {
              title: 'Test Results',
              content: [
                { label: 'Hemoglobin', value: '14.2 g/dL', range: '12.0-16.0', status: 'normal' },
                { label: 'White Blood Cells', value: '7.8 K/uL', range: '4.0-11.0', status: 'normal' },
                { label: 'Platelets', value: '285 K/uL', range: '150-450', status: 'normal' },
                { label: 'Glucose', value: '95 mg/dL', range: '70-100', status: 'normal' }
              ]
            },
            {
              title: 'Laboratory Information',
              content: [
                { label: 'Lab', value: 'Lab ABC Medical Center' },
                { label: 'Technician', value: 'Maria Rodriguez, MLT' },
                { label: 'Ordered by', value: 'Dr. Lopez' },
                { label: 'Collection Date', value: '12 AUG 2025, 08:30 AM' }
              ]
            }
          ]
        };
      case 'Note':
        return {
          sections: [
            {
              title: 'Consultation Notes',
              content: [
                { label: 'Chief Complaint', value: 'Seasonal allergies, nasal congestion' },
                { label: 'Diagnosis', value: 'Allergic rhinitis (ICD-10: J30.9)' },
                { label: 'Treatment Plan', value: 'Antihistamine therapy, nasal spray' },
                { label: 'Follow-up', value: 'Return in 2 weeks if symptoms persist' }
              ]
            },
            {
              title: 'Vital Signs',
              content: [
                { label: 'Blood Pressure', value: '118/76 mmHg', status: 'normal' },
                { label: 'Heart Rate', value: '72 bpm', status: 'normal' },
                { label: 'Temperature', value: '98.6°F', status: 'normal' },
                { label: 'Weight', value: '65 kg', status: 'normal' }
              ]
            },
            {
              title: 'Provider Information',
              content: [
                { label: 'Doctor', value: 'Dr. Carlos Lopez, MD' },
                { label: 'Specialty', value: 'Internal Medicine' },
                { label: 'Hospital', value: 'HMG Medical Center' },
                { label: 'Date', value: '03 AUG 2025, 10:00 AM' }
              ]
            }
          ]
        };
      case 'Imaging':
        return {
          sections: [
            {
              title: 'Imaging Results',
              content: [
                { label: 'Study Type', value: 'Chest X-ray (PA and Lateral)' },
                { label: 'Findings', value: 'Normal lung fields, no acute abnormalities' },
                { label: 'Impression', value: 'Normal chest radiograph' },
                { label: 'Recommendation', value: 'No further imaging needed at this time' }
              ]
            },
            {
              title: 'Technical Details',
              content: [
                { label: 'Modality', value: 'Digital Radiography' },
                { label: 'Protocol', value: 'Standard chest 2-view' },
                { label: 'Contrast', value: 'None' },
                { label: 'Radiation Dose', value: '0.02 mSv' }
              ]
            },
            {
              title: 'Provider Information',
              content: [
                { label: 'Radiologist', value: 'Dr. Ana Martinez, MD' },
                { label: 'Technologist', value: 'Roberto Silva, RT' },
                { label: 'Facility', value: 'HMG Hospital Imaging' },
                { label: 'Date', value: '20 JUL 2025, 02:30 PM' }
              ]
            }
          ]
        };
      default:
        return { sections: [] };
    }
  };

  const recordData = getRecordContent(record);

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

        {/* Header with back button */}
        <header className="px-5 pt-3 pb-4">
          <div className="flex items-center gap-3">
            <button 
              onClick={onBack}
              className="h-8 w-8 rounded-full bg-slate-100 hover:bg-slate-200 transition grid place-items-center"
            >
              ←
            </button>
            <div className="flex-1">
              <h1 className="text-lg font-semibold tracking-tight">{record.title}</h1>
              <p className="text-[11px] text-slate-500">{record.date} • {record.meta}</p>
            </div>
            <span className={`text-[10px] px-2 py-0.5 rounded-full border text-center ${
              record.tag === 'Lab' ? 'bg-purple-50 border-purple-200 text-purple-700' :
              record.tag === 'Note' ? 'bg-blue-50 border-blue-200 text-blue-700' :
              'bg-orange-50 border-orange-200 text-orange-700'
            }`}>
              {record.tag}
            </span>
          </div>
        </header>

        {/* Content */}
        <main className="px-5 space-y-4 pb-28 overflow-y-auto">
          {recordData.sections.map((section, sectionIndex) => (
            <section key={sectionIndex} className="rounded-2xl p-4 bg-slate-50 border border-slate-200">
              <h2 className="text-sm font-semibold mb-3">{section.title}</h2>
              <div className="space-y-3">
                {section.content.map((item, itemIndex) => (
                  <div key={itemIndex} className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-xs text-slate-500">{item.label}</p>
                      <p className="text-sm font-medium">{item.value}</p>
                      {item.range && (
                        <p className="text-[10px] text-slate-400">Range: {item.range}</p>
                      )}
                    </div>
                    {item.status && (
                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                        item.status === 'normal' ? 'bg-emerald-50 border border-emerald-200 text-emerald-700' :
                        item.status === 'high' ? 'bg-red-50 border border-red-200 text-red-700' :
                        'bg-yellow-50 border border-yellow-200 text-yellow-700'
                      }`}>
                        {item.status}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </section>
          ))}

          {/* Actions */}
          <section className="rounded-2xl p-4 bg-emerald-50 border border-emerald-200">
            <h2 className="text-sm font-semibold mb-3">Actions</h2>
            <div className="grid grid-cols-2 gap-2">
              <button className="rounded-xl py-3 bg-white border border-slate-200 hover:bg-slate-100 transition text-[11px] font-medium">
                📄 Download PDF
              </button>
              <button className="rounded-xl py-3 bg-white border border-slate-200 hover:bg-slate-100 transition text-[11px] font-medium">
                🔗 Share Record
              </button>
              <button className="rounded-xl py-3 bg-white border border-slate-200 hover:bg-slate-100 transition text-[11px] font-medium">
                📧 Email Doctor
              </button>
              <button className="rounded-xl py-3 bg-white border border-slate-200 hover:bg-slate-100 transition text-[11px] font-medium">
                📅 Schedule Follow-up
              </button>
            </div>
          </section>

          {/* Notes section */}
          <section className="rounded-2xl p-4 bg-blue-50 border border-blue-200">
            <h2 className="text-sm font-semibold mb-2">Personal Notes</h2>
            <textarea 
              placeholder="Add your personal notes about this record..."
              className="w-full h-20 p-3 text-[11px] rounded-xl border border-blue-200 bg-white resize-none focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <button className="mt-2 px-3 py-1.5 text-[11px] rounded-full bg-blue-600 text-white hover:bg-blue-500 transition">
              Save Note
            </button>
          </section>
        </main>

        {/* Bottom safe area */}
        <div className="h-20" />
      </div>
    </div>
  );
}

export default RecordDetail;
