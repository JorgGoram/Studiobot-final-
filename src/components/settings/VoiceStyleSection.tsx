import { useState, useEffect } from 'react';
import { Mic, X, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { VoiceSettings } from './VoiceSettings';
import type { FormData } from '../../types/FormData';

interface VoiceStyleSectionProps {
  formData: FormData;
  onChange: (field: keyof FormData, value: any) => void;
}

export function VoiceStyleSection({ formData, onChange }: VoiceStyleSectionProps) {
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(true);
  const [showTips, setShowTips] = useState(false);

  // Simulate loading the form data
  useEffect(() => {
    // This would typically fetch data from an API
    // For now, we'll just use the formData prop
  }, [formData]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Mic className="w-6 h-6 text-[#904af2]" />
          <h1 className="text-2xl font-bold">Voice Style</h1>
        </div>
        <button 
          className="bg-[#904af2] text-white px-4 py-2 rounded-lg"
          onClick={() => {/* Save functionality */}}
        >
          Mark Done <span className="ml-1">✓</span>
        </button>
      </div>

      {/* Welcome Message */}
      <AnimatePresence>
        {showWelcomeMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-[#1a1a1f] border border-[#904af2]/20 rounded-xl p-4 relative"
          >
            <div className="flex items-start gap-4">
              <div className="bg-[#904af2]/20 rounded-full p-2 mt-1">
                <Mic className="w-5 h-5 text-[#904af2]" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-1">Welcome to Settings</h3>
                <p className="text-gray-300">Customize your AI voice assistant for your studio's needs.</p>
              </div>
            </div>
            <button 
              className="absolute top-3 right-3 text-gray-400 hover:text-white"
              onClick={() => setShowWelcomeMessage(false)}
            >
              <X className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content - Voice Settings */}
      <div className="bg-[#0f0f0f] rounded-xl overflow-hidden">
        <VoiceSettings formData={formData} onChange={onChange} />
      </div>

      {/* Tips Section */}
      <div className="bg-[#1a1a1f] border border-[#904af2]/20 rounded-xl overflow-hidden">
        <button 
          className="w-full p-4 flex items-center justify-between"
          onClick={() => setShowTips(!showTips)}
        >
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-[#904af2]" />
            <span className="font-medium">Tips for Voice Style</span>
          </div>
          <motion.div
            animate={{ rotate: showTips ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.div>
        </button>
        
        <AnimatePresence>
          {showTips && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="p-4 pt-0 space-y-3">
                <div className="flex gap-2">
                  <div className="w-5 h-5 rounded-full bg-[#904af2]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs text-[#904af2] font-semibold">1</span>
                  </div>
                  <p className="text-sm text-gray-300">
                    Lower stability settings create more expressive voices but may sound less consistent.
                  </p>
                </div>
                <div className="flex gap-2">
                  <div className="w-5 h-5 rounded-full bg-[#904af2]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs text-[#904af2] font-semibold">2</span>
                  </div>
                  <p className="text-sm text-gray-300">
                    Higher similarity values make the voice sound more like the original recording.
                  </p>
                </div>
                <div className="flex gap-2">
                  <div className="w-5 h-5 rounded-full bg-[#904af2]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs text-[#904af2] font-semibold">3</span>
                  </div>
                  <p className="text-sm text-gray-300">
                    For busy environments, set patience level to "low" for quicker responses.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}