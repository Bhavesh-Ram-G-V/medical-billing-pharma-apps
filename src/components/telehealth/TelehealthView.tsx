import React, { useState } from 'react';
import { Patient } from '../../types/clinical';
import { DOCTOR_PROFILE } from '../../data/mockClinicalData';
import { 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  PhoneOff, 
  Share2, 
  MessageSquare, 
  Activity, 
  Heart, 
  FileText, 
  Send,
  Pill,
  ShieldCheck
} from 'lucide-react';

interface TelehealthViewProps {
  patient: Patient;
  onEndCall: () => void;
  onOpenChart: () => void;
}

export const TelehealthView: React.FC<TelehealthViewProps> = ({
  patient,
  onEndCall,
  onOpenChart
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [activeSidePanel, setActiveSidePanel] = useState<'notes' | 'chat'>('notes');
  const [telehealthNotes, setTelehealthNotes] = useState(
    `Virtual consultation initiated via Trinity Telehealth HD. Patient connected from home.\n\nChief Complaint: Follow-up on recent fatigue and review of lab results.\nPatient reports taking medications as prescribed. Denies dizziness or chest pain.`
  );
  const [chatMessages, setChatMessages] = useState<Array<{ sender: string; text: string; time: string }>>([
    { sender: 'System', text: 'Encrypted clinical video session initiated. HIPAA compliance active.', time: '10:30 AM' },
    { sender: patient.firstName, text: 'Hello Dr. Jenkins! I can hear and see you clearly.', time: '10:31 AM' },
    { sender: 'Dr. Sarah Jenkins', text: 'Good morning Eleanor! How have you been feeling since our last check-in?', time: '10:31 AM' }
  ]);
  const [chatInput, setChatInput] = useState('');

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    setChatMessages(prev => [
      ...prev,
      {
        sender: 'Dr. Sarah Jenkins',
        text: chatInput,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    setChatInput('');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-4">
      {/* Session Header */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
          <div>
            <div className="text-sm font-bold text-white flex items-center gap-2">
              <span>Telehealth Virtual Room 2 · Live Encounter</span>
              <span className="text-[10px] bg-purple-950 text-purple-300 border border-purple-800/80 px-2 py-0.5 rounded font-mono">
                HD 1080p WebRTC
              </span>
            </div>
            <div className="text-xs text-slate-400">
              Provider: <strong>{DOCTOR_PROFILE.name}</strong> · Patient: <strong>{patient.firstName} {patient.lastName}</strong> ({patient.mrn})
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenChart}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-colors border border-slate-700"
          >
            <FileText className="w-3.5 h-3.5 text-teal-400" />
            <span>Open Patient Full EMR</span>
          </button>
        </div>
      </div>

      {/* Main Video & Panel Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Video Stage (2 Cols) */}
        <div className="lg:col-span-2 space-y-3">
          <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 aspect-[16/10] flex items-center justify-center shadow-2xl">
            {/* Patient Remote Video Feed */}
            {patient.avatar ? (
              <img
                src={patient.avatar}
                alt={patient.firstName}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="text-center p-8 text-slate-400">
                <Video className="w-12 h-12 mx-auto mb-2 text-slate-600" />
                <span>Patient Video Feed Connected</span>
              </div>
            )}

            {/* Patient Overlay HUD */}
            <div className="absolute top-4 left-4 bg-slate-950/80 backdrop-blur-md border border-slate-700/60 px-3 py-1.5 rounded-lg text-xs text-white flex items-center gap-2">
              <span className="font-semibold">{patient.firstName} {patient.lastName}</span>
              <span className="text-slate-400 text-[11px]">({patient.age}y {patient.gender})</span>
              <span className="text-emerald-400 text-[10px] ml-1">● Audio Active</span>
            </div>

            {/* Patient Remote Vitals HUD */}
            <div className="absolute top-4 right-4 bg-slate-950/80 backdrop-blur-md border border-slate-700/60 px-3 py-1.5 rounded-lg text-xs font-mono text-slate-200 flex items-center gap-3">
              <div className="flex items-center gap-1 text-red-400">
                <Heart className="w-3.5 h-3.5" />
                <span>{patient.vitalsHistory[0]?.heartRate || 72} bpm</span>
              </div>
              <div className="flex items-center gap-1 text-teal-400">
                <Activity className="w-3.5 h-3.5" />
                <span>SpO2 {patient.vitalsHistory[0]?.oxygenSaturation || 99}%</span>
              </div>
            </div>

            {/* Doctor Picture-in-Picture Feed */}
            <div className="absolute bottom-4 right-4 w-40 sm:w-48 aspect-video rounded-xl overflow-hidden border-2 border-teal-500/80 bg-slate-900 shadow-2xl group">
              {isVideoOn ? (
                <img
                  src={DOCTOR_PROFILE.avatarUrl}
                  alt="Dr. Sarah Jenkins"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-slate-950 text-slate-500 text-xs">
                  Camera Off
                </div>
              )}
              <div className="absolute bottom-1 left-2 text-[10px] text-white bg-slate-950/70 px-1.5 py-0.5 rounded font-medium">
                You (Dr. Jenkins)
              </div>
            </div>
          </div>

          {/* Media Control Bar */}
          <div className="bg-slate-900 rounded-xl border border-slate-800 p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className={`p-3 rounded-full transition-colors ${
                  isMuted ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                }`}
                title={isMuted ? 'Unmute Microphone' : 'Mute Microphone'}
              >
                {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>

              <button
                onClick={() => setIsVideoOn(!isVideoOn)}
                className={`p-3 rounded-full transition-colors ${
                  !isVideoOn ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                }`}
                title={isVideoOn ? 'Turn Camera Off' : 'Turn Camera On'}
              >
                {isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
              </button>

              <button
                onClick={() => alert('Screen sharing enabled: Transmitting ECG Diagnostics to patient view.')}
                className="p-3 rounded-full bg-slate-800 text-slate-200 hover:bg-slate-700 transition-colors"
                title="Share Screen / Diagnostics"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>

            <button
              onClick={onEndCall}
              className="px-5 py-2.5 rounded-full bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg transition-colors"
            >
              <PhoneOff className="w-4 h-4" />
              <span>Complete Encounter</span>
            </button>
          </div>
        </div>

        {/* In-Call Notes & Chat Sidebar */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 flex flex-col h-[520px]">
          {/* Header tabs */}
          <div className="flex border-b border-slate-800 p-2 gap-2 text-xs">
            <button
              onClick={() => setActiveSidePanel('notes')}
              className={`flex-1 py-1.5 rounded-md font-semibold transition-colors flex items-center justify-center gap-1.5 ${
                activeSidePanel === 'notes' ? 'bg-teal-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Consult Notes</span>
            </button>
            <button
              onClick={() => setActiveSidePanel('chat')}
              className={`flex-1 py-1.5 rounded-md font-semibold transition-colors flex items-center justify-center gap-1.5 ${
                activeSidePanel === 'chat' ? 'bg-teal-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>In-Call Chat</span>
            </button>
          </div>

          {/* Panel Content */}
          {activeSidePanel === 'notes' ? (
            <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
              <div className="space-y-2 flex-1 flex flex-col">
                <label className="text-xs font-semibold text-slate-300">
                  Live Telehealth Clinical Scratchpad:
                </label>
                <textarea
                  value={telehealthNotes}
                  onChange={(e) => setTelehealthNotes(e.target.value)}
                  className="w-full flex-1 bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-200 leading-relaxed focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400 text-[11px]">Syncs directly into encounter chart</span>
                <button
                  onClick={() => alert('Consultation notes saved to patient record.')}
                  className="px-3 py-1.5 rounded bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs"
                >
                  Save Notes
                </button>
              </div>
            </div>
          ) : (
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div className="space-y-3 overflow-y-auto flex-1 pr-1 text-xs">
                {chatMessages.map((msg, i) => (
                  <div
                    key={i}
                    className={`p-2.5 rounded-lg max-w-[85%] ${
                      msg.sender === 'Dr. Sarah Jenkins'
                        ? 'ml-auto bg-teal-600 text-white'
                        : msg.sender === 'System'
                        ? 'mx-auto bg-slate-950 text-slate-400 text-[10px] text-center border border-slate-800'
                        : 'mr-auto bg-slate-800 text-slate-200'
                    }`}
                  >
                    <div className="text-[10px] opacity-75 font-semibold mb-0.5">{msg.sender} · {msg.time}</div>
                    <div>{msg.text}</div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendChat} className="mt-3 flex gap-2">
                <input
                  type="text"
                  placeholder="Send secure message to patient..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
                />
                <button
                  type="submit"
                  className="p-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
