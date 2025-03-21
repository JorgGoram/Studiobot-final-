import { useState, useEffect } from 'react';
import { VoiceStyleSection } from './VoiceStyleSection';
import type { FormData } from '../../types/FormData';
import { loadUserProfile, getOptionalPreferences } from '../../lib/supabase';
import { getAssistant } from '../../lib/synthflow';

export function SettingsVoiceStylePage() {
  const [formData, setFormData] = useState<FormData>({
    assistantName: 'My Voice Assistant',
    voiceEngine: 'v2',
    aiModel: 'gpt4',
    voice_id: '',
    timezone: 'UTC',
    customVocab: [],
    filterWords: [],
    patienceLevel: 'medium',
    stability: 0.5,
    styleExaggeration: 0,
    similarity: 0.75,
    latencyOptimization: 0,
    pauseBeforeSpeaking: 0,
    ringDuration: 1,
    idleRemindersEnabled: false,
    idleReminderTime: 6,
    reminderMessage: "I'm still here. Do you have any questions?",
    speakerBoost: false,
    operatingHours: [],
    appointmentType: 'appointments',
    hourlyRate: '',
    supportEmail: '',
    primaryLanguage: 'en-US',
    welcomeMessage: '',
    specificInstructions: '',
    piercingServices: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        setLoading(true);

        // Get user profile
        const profile = await loadUserProfile();
        setUserProfile(profile);

        if (profile?.model_id) {
          // Get optional preferences
          const optionalPreference = await getOptionalPreferences();

          // Get assistant details
          const assistant = await getAssistant();

          if (assistant && assistant.agent) {
            setFormData((prev) => ({
              ...prev,
              assistantName: profile.assistantName || prev.assistantName,
              welcomeMessage: profile.welcomeMessage || prev.welcomeMessage,
              appointmentType: optionalPreference?.appointment_type || prev.appointmentType,
              hourlyRate: optionalPreference?.hourly_rate?.toString() || prev.hourlyRate,
              specificInstructions: optionalPreference?.specific_instructions || prev.specificInstructions,
              patienceLevel: assistant.agent.patience_level || prev.patienceLevel,
              stability: assistant.agent.voice_stability || prev.stability,
              similarity: assistant.agent.voice_similarity_boost || prev.similarity,
              ringDuration: assistant.agent.ring_pause_seconds || prev.ringDuration,
              speakerBoost: assistant.agent.voice_use_speaker_boost || prev.speakerBoost,
              operatingHours: optionalPreference?.operating_hours || prev.operatingHours,
              voice_id: assistant.agent.voice_id || prev.voice_id,
              latencyOptimization: assistant.agent.voice_optimise_streaming_latency || prev.latencyOptimization,
              styleExaggeration: assistant.agent.voice_style || prev.styleExaggeration,
              pauseBeforeSpeaking: assistant.agent.initial_pause_seconds || prev.pauseBeforeSpeaking,
            }));
          }
        }
      } catch (err) {
        console.error('Error loading settings:', err);
        setError('Failed to load settings. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  const handleChange = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#904af2]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-500 rounded-lg bg-red-500/10">
        {error}
      </div>
    );
  }

  return <VoiceStyleSection formData={formData} onChange={handleChange} />;
}