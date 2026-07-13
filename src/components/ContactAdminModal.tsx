import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, HelpCircle, User, Phone, MessageSquare, AlertCircle, Send } from 'lucide-react';

interface ContactAdminModalProps {
  onClose: () => void;
  onSubmit: (regNo: string, studentName: string, contactInfo: string, message: string) => Promise<void>;
}

export default function ContactAdminModal({ onClose, onSubmit }: ContactAdminModalProps) {
  const [regNo, setRegNo] = useState('');
  const [studentName, setStudentName] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [message, setMessage] = useState('Misplaced or forgotten my unique access PIN. Requesting assistance from the registrar block.');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Normalize registration number to uppercase
    const normalizedRegNo = regNo.toUpperCase().trim();

    // Regex Validation for Reg No: must follow strict CSS/IDO/YYYY/NNN pattern
    const regNoPattern = /^CSS\/IDO\/\d{4}\/\d+$/;
    if (!regNoPattern.test(normalizedRegNo)) {
      setError('Invalid Registration Number format. Must be capitalized and match the pattern CSS/IDO/YYYY/NNN (e.g., CSS/IDO/2026/001).');
      return;
    }

    if (!studentName.trim()) {
      setError('Please provide your full registered name.');
      return;
    }

    if (!contactInfo.trim()) {
      setError('Please provide a parent or guardian phone number.');
      return;
    }

    try {
      setSubmitting(true);
      await onSubmit(normalizedRegNo, studentName, contactInfo, message);
      onClose();
    } catch (err) {
      setError('An error occurred while submitting your ticket. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200 relative"
      >
        {/* Maroon School Theme Top Banner */}
        <div className="h-2 bg-gradient-to-r from-[#5c061c] to-amber-500 shrink-0"></div>

        <div className="p-6 flex justify-between items-center border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-[#5c061c]/10 text-[#5c061c] rounded-lg">
              <HelpCircle size={18} />
            </div>
            <div>
              <h3 className="text-[20px] md:text-[22px] font-semibold text-slate-800 tracking-[-0.02em]">Administration Help Desk</h3>
              <p className="text-[13px] font-normal leading-[1.5] text-slate-400 font-mono">PIN Retrieval & Account Assistance</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-slate-100 rounded-full text-slate-400 cursor-pointer transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden text-xs">
          <div className="p-6 space-y-4 overflow-y-auto flex-1">
            {error && (
              <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-100 flex items-start gap-2">
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                <span className="text-[13px] font-normal leading-[1.5]">{error}</span>
              </div>
            )}

            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 text-[13px] leading-relaxed text-amber-800">
              <strong>Lost your PIN?</strong> Fill out this quick form. The school registrar will review your details against school records and contact your guardian to verify and securely reissue your PIN.
            </div>

            <div>
              <label className="block text-[14px] font-medium leading-[1.5] text-slate-500 mb-1.5 uppercase font-mono tracking-wider">Registration Number</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                  <User size={14} />
                </span>
                <input 
                  type="text" 
                  placeholder="CSS/IDO/2026/001"
                  value={regNo}
                  onChange={(e) => setRegNo(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[16px] font-normal leading-[1.5] focus:outline-none focus:ring-1 focus:ring-[#5c061c] font-mono text-slate-900"
                  required
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1 font-mono">Must match the capitalized format CSS/IDO/YYYY/NNN</p>
            </div>

            <div>
              <label className="block text-[14px] font-medium leading-[1.5] text-slate-500 mb-1.5 uppercase font-mono tracking-wider">Student Full Name</label>
              <input 
                type="text" 
                placeholder="e.g. Adebayo Emmanuel Chinedu"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[16px] font-normal leading-[1.5] focus:outline-none focus:ring-1 focus:ring-[#5c061c] text-slate-900"
                required
              />
            </div>

            <div>
              <label className="block text-[14px] font-medium leading-[1.5] text-slate-500 mb-1.5 uppercase font-mono tracking-wider">Guardian Phone Number</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                  <Phone size={14} />
                </span>
                <input 
                  type="text" 
                  placeholder="e.g. +234 803 123 4567"
                  value={contactInfo}
                  onChange={(e) => setContactInfo(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[16px] font-normal leading-[1.5] focus:outline-none focus:ring-1 focus:ring-[#5c061c] font-mono text-slate-900"
                  required
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">This number will be contacted with the recovered/regenerated PIN</p>
            </div>

            <div>
              <label className="block text-[14px] font-medium leading-[1.5] text-slate-500 mb-1.5 uppercase font-mono tracking-wider">Message Description</label>
              <div className="relative">
                <span className="absolute top-3 left-3 text-slate-400">
                  <MessageSquare size={14} />
                </span>
                <textarea 
                  rows={2}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[14px] font-normal focus:outline-none focus:ring-1 focus:ring-[#5c061c] text-slate-900"
                  required
                />
              </div>
            </div>
          </div>

          <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3 shrink-0">
            <button 
              type="button" 
              onClick={onClose}
              className="px-4 py-2.5 text-slate-500 hover:bg-slate-200 hover:text-slate-700 rounded-xl font-bold transition-colors text-[14px] cursor-pointer"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={submitting}
              className="px-5 py-2.5 bg-[#5c061c] hover:bg-[#720a25] disabled:bg-slate-300 text-white rounded-xl font-bold shadow-md flex items-center gap-2 text-[14px] cursor-pointer transition-colors"
            >
              <Send size={14} />
              <span>{submitting ? 'Submitting...' : 'Submit Assistance Request'}</span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
