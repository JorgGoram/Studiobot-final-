import { useState } from 'react';
import { MessageSquareDashed, Mail, Bell, Clock } from 'lucide-react';

export default function VoicemailSettings() {
  const [voicemailEnabled, setVoicemailEnabled] = useState(true);
  const [maxDuration, setMaxDuration] = useState(120);
  const [transcriptionEnabled, setTranscriptionEnabled] = useState(true);
  const [notificationMethod, setNotificationMethod] = useState('email');
  const [notificationEmail, setNotificationEmail] = useState('studio@example.com');
  const [customGreeting, setCustomGreeting] = useState(
    "I'm sorry I couldn't answer your call. Please leave your name, number, and a brief message, and I'll get back to you as soon as possible."
  );

  return (
    <div className="space-y-6 text-white">
      <div>
        <h3 className="text-lg font-medium mb-4 flex items-center">
          <MessageSquareDashed className="w-5 h-5 mr-2 text-[#904af2]" />
          Voicemail Configuration
        </h3>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-[#1a1a1a]/60 border border-[#904af2]/20 rounded-lg">
            <div>
              <h4 className="font-medium">Voicemail</h4>
              <p className="text-sm text-gray-400">Enable callers to leave voicemail messages</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={voicemailEnabled}
                onChange={(e) => setVoicemailEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#904af2]/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#904af2]"></div>
            </label>
          </div>
          
          {voicemailEnabled && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Custom Voicemail Greeting
                </label>
                <textarea
                  value={customGreeting}
                  onChange={(e) => setCustomGreeting(e.target.value)}
                  rows={3}
                  className="bg-[#1a1a1a] border border-gray-700 text-white text-sm rounded-lg focus:ring-[#904af2] focus:border-[#904af2] block w-full p-2.5"
                  placeholder="Enter your custom voicemail greeting..."
                />
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Maximum Message Duration
                  </label>
                  <span className="text-sm text-gray-400">{maxDuration} seconds</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="300"
                  step="30"
                  value={maxDuration}
                  onChange={(e) => setMaxDuration(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>30s</span>
                  <span>1m</span>
                  <span>2m</span>
                  <span>3m</span>
                  <span>4m</span>
                  <span>5m</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-[#1a1a1a]/60 border border-[#904af2]/20 rounded-lg">
                <div>
                  <h4 className="font-medium">Message Transcription</h4>
                  <p className="text-sm text-gray-400">Convert voice messages to text</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={transcriptionEnabled}
                    onChange={(e) => setTranscriptionEnabled(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#904af2]/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#904af2]"></div>
                </label>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Notification Method</h4>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <input
                      id="email-notification"
                      type="radio"
                      value="email"
                      checked={notificationMethod === 'email'}
                      onChange={(e) => setNotificationMethod(e.target.value)}
                      className="w-4 h-4 text-[#904af2] bg-gray-700 border-gray-600 focus:ring-[#904af2]/30 focus:ring-2"
                    />
                    <label htmlFor="email-notification" className="ml-2 flex items-center text-sm font-medium text-gray-300">
                      <Mail className="w-4 h-4 mr-1.5 text-gray-500" />
                      Email
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      id="push-notification"
                      type="radio"
                      value="push"
                      checked={notificationMethod === 'push'}
                      onChange={(e) => setNotificationMethod(e.target.value)}
                      className="w-4 h-4 text-[#904af2] bg-gray-700 border-gray-600 focus:ring-[#904af2]/30 focus:ring-2"
                    />
                    <label htmlFor="push-notification" className="ml-2 flex items-center text-sm font-medium text-gray-300">
                      <Bell className="w-4 h-4 mr-1.5 text-gray-500" />
                      Push Notification
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      id="both-notification"
                      type="radio"
                      value="both"
                      checked={notificationMethod === 'both'}
                      onChange={(e) => setNotificationMethod(e.target.value)}
                      className="w-4 h-4 text-[#904af2] bg-gray-700 border-gray-600 focus:ring-[#904af2]/30 focus:ring-2"
                    />
                    <label htmlFor="both-notification" className="ml-2 text-sm font-medium text-gray-300">
                      Both
                    </label>
                  </div>
                </div>
              </div>
              
              {(notificationMethod === 'email' || notificationMethod === 'both') && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Notification Email
                  </label>
                  <input
                    type="email"
                    value={notificationEmail}
                    onChange={(e) => setNotificationEmail(e.target.value)}
                    className="bg-[#1a1a1a] border border-gray-700 text-white text-sm rounded-lg focus:ring-[#904af2] focus:border-[#904af2] block w-full p-2.5"
                    placeholder="Enter email address"
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <div className="pt-6 border-t border-gray-800 flex justify-end space-x-3">
        <button className="px-4 py-2 border border-gray-700 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors">
          Reset to Default
        </button>
        <button className="px-4 py-2 bg-[#904af2] text-white rounded-lg hover:bg-[#9d5ff5] transition-colors">
          Save Changes
        </button>
      </div>
    </div>
  );
}