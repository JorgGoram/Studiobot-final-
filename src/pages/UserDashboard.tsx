import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from '../components/Header';
import { Navigation } from '../components/Navigation';
import { NavigationTabs } from '../components/NavigationTabs';
import { MouseTrail } from '../components/MouseTrail';
import { Dashboard } from '../components/Dashboard';
import { AnalyticsSection } from '../components/analytics/AnalyticsSection';
import { CallHistory } from '../components/history/CallHistory';
import { HelpCenter } from '../components/help/HelpCenter';
import { GeneralSettings } from '../components/settings/GeneralSettings';
import { VoiceSettings } from '../components/settings/VoiceSettings';
import { CallSettings } from '../components/settings/CallSettings';
import { CalendarSettings } from '../components/settings/CalendarSettings';
import { FAQSettings } from '../components/settings/FAQSettings';
import { VoiceTrainingSettings } from '../components/settings/VoiceTrainingSettings';
import { CallTransferSettings } from '../components/settings/CallTransferSettings';
import { CreateVoiceAgentForm } from '../components/CreateVoiceAgentForm';
import { PricingPlans } from '../components/PricingPlans';
import toast from 'react-hot-toast';
import {
  supabase,
  loadUserProfile,
  hasCompletedOnboarding,
  getOptionalPreferences,
  updateOptionalPreferences,
  updateUserProfile,
} from '../lib/supabase';
import { getAssistant, updateAssistant } from '../lib/synthflow';
import type { FormData } from '../types/FormData';
import type { UserProfile } from '../types/UserProfile';
import type { AssistantPropsType } from '../types/Synthflow';
import { analysisCalls, generatePrompt } from '../utils';

export function UserDashboard() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [activeTab, setActiveTab] = useState('general');
  const [hasChanges, setHasChanges] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authType, setAuthType] = useState<'login' | 'signup'>('login');
  const [user, setUser] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showVoiceAgentForm, setShowVoiceAgentForm] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [showPricingPlans, setShowPricingPlans] = useState(false);
  const [onboardingCompleted, setOnboardingCompleted] = useState<
    boolean | null
  >(null);
  const [analysisData, setAnalysisData] = useState<{
    total_records: number;
    total_mins: number;
    avg_min: number;
    total_complete: number;
    active_users: number;
  }>({
    total_mins: 0,
    total_records: 0,
    avg_min: 0,
    total_complete: 0,
    active_users: 0,
  });
  const [formData, setFormData] = useState<FormData>({
    assistantName: userProfile?.assistantName || 'My Voice Assistant',
    voiceEngine: 'v2',
    aiModel: 'gpt4',
    voice_id: '',
    timezone: userProfile?.timezone || 'UTC',
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

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log(event);
      const isAuthenticated = !!session;
      setUser(isAuthenticated);
      setError(null);
      setTimeout(async () => {
        if (isAuthenticated) {
          try {
            const profile: UserProfile | null = await loadUserProfile();
            setUserProfile(profile);
            if (profile) {
              setFormData((prev) => ({
                ...prev,
                assistantName: profile.assistantName || prev.assistantName,
                timezone: profile.timezone || prev.timezone,
              }));

              if (profile.planEnd) {
                const now = new Date();
                const planEndDate = new Date(profile.planEnd);

                if (planEndDate < now) {
                  toast.error(
                    'Your plan has expired. You have been moved to the trial plan.'
                  );
                }

                if (
                  profile.plan === 'TRIAL' &&
                  profile.totalUsageMinutes >= 15 * 60
                ) {
                  toast.error(
                    'You have reached your trial usage limit. Please upgrade your plan to continue.'
                  );
                }
              }
            }
            if (profile?.model_id) {
              try {
                const d = await analysisCalls(profile.model_id);
                setAnalysisData(d);
              } catch (err) {
                console.error('Error analyzing calls:', err);
                setAnalysisData({
                  total_mins: 0,
                  total_records: 0,
                  avg_min: 0,
                  total_complete: 0,
                  active_users: 0,
                });
              }
            }
            const completed = await hasCompletedOnboarding();
            setOnboardingCompleted(completed);
            setShowVoiceAgentForm(!completed);
          } catch (error) {
            console.error('Error loading user data:', error);
            setError('Failed to load user data. Please try again later.');
          }
        } else {
          setUserProfile(null);
          setOnboardingCompleted(null);
          setShowVoiceAgentForm(false);
          setFormData((prev) => ({
            ...prev,
            assistantName: 'My Voice Assistant',
            voiceEngine: 'v2',
            aiModel: 'gpt4',
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
          }));
          setHasChanges(false);
        }
      });
    });
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSetSetting = async () => {
    if (userProfile?.model_id) {
      const optional_preference = await getOptionalPreferences();
      const assistant = await getAssistant();
      if (assistant && assistant.agent) {
        setFormData((prev) => ({
          ...prev,
          assistantName: userProfile.assistantName || prev.assistantName,
          welcomeMessage: userProfile.welcomeMessage || prev.welcomeMessage,
          appointmentType:
            optional_preference?.appointment_type || prev.appointmentType,
          hourlyRate:
            optional_preference?.hourly_rate?.toString() || prev.hourlyRate,
          specificInstructions:
            optional_preference?.specific_instructions ||
            prev.specificInstructions,
          patienceLevel: assistant.agent.patience_level || prev.patienceLevel,
          stability: assistant.agent.voice_stability || prev.stability,
          similarity: assistant.agent.voice_similarity_boost || prev.similarity,
          ringDuration: assistant.agent.ring_pause_seconds || prev.ringDuration,
          speakerBoost:
            assistant.agent.voice_use_speaker_boost || prev.speakerBoost,
          operatingHours:
            optional_preference?.operating_hours || prev.operatingHours,
          voice_id: assistant.agent.voice_id || prev.voice_id,
          latencyOptimization:
            assistant.agent.voice_optimise_streaming_latency ||
            prev.latencyOptimization,
          styleExaggeration:
            assistant.agent.voice_style || prev.styleExaggeration,
          pauseBeforeSpeaking:
            assistant.agent.initial_pause_seconds || prev.pauseBeforeSpeaking,
          phoneNumber: assistant.phone_number,
        }));
      }
    }
  };

  useEffect(() => {
    if (activeSection === 'settings') {
      handleSetSetting();
    }
  }, [activeSection]);

  const handleChange = async (field: keyof FormData, value: any) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    setFormData((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);
    setError(null);

    if (field === 'assistantName' && userProfile) {
      try {
        await updateUserProfile({
          ...userProfile,
          assistantName: value,
        });
      } catch (error) {
        console.error('Error saving assistant name:', error);
        setError('Failed to save assistant name. Please try again later.');
      }
    }
  };

  const handleSave = async () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    setSaving(true);
    setError(null);
    try {
      if (userProfile) {
        await updateUserProfile({
          ...userProfile,
          assistantName: formData.assistantName,
          welcomeMessage: formData.welcomeMessage,
          timezone: formData.timezone,
          completedOnboarding: true,
        });

        const updatedData: AssistantPropsType = {
          type: 'inbound',
          name: formData.assistantName,
          agent: {
            greeting_message: formData.welcomeMessage,
            prompt: generatePrompt(
              formData.operatingHours,
              formData.hourlyRate,
              formData?.specificInstructions
            ),
            language: formData.primaryLanguage || 'en-US',
            patience_level: formData.patienceLevel,
            voice_stability: formData.stability,
            voice_style: formData.styleExaggeration,
            voice_similarity_boost: formData.similarity,
            voice_optimise_streaming_latency: formData.latencyOptimization,
            voice_use_speaker_boost: formData.speakerBoost,
            ring_pause_seconds: formData.ringDuration,
            voice_id: formData.voice_id,
            initial_pause_seconds: formData.pauseBeforeSpeaking,
          },
        };
        await updateAssistant(updatedData);
        await updateOptionalPreferences({
          appointment_type: formData.appointmentType || 'walkins',
          operating_hours: formData.operatingHours,
          piercing_service: formData.piercingServices,
          hourly_rate: parseFloat(formData.hourlyRate) || 0,
          specific_instructions: formData.specificInstructions,
        });
        setHasChanges(false);
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      setError('Failed to save settings. Please try again later.');
    } finally {
      setSaving(false);
    }
  };

  const handleVoiceAgentFormSubmit = async (formData: Partial<UserProfile>) => {
    console.log(formData);
    try {
      await updateUserProfile({
        ...formData,
        completedOnboarding: true,
      });

      setUserProfile({
        ownerName: formData.ownerName || '',
        shopName: formData.shopName || '',
        timezone: formData.timezone || 'UTC',
        assistantName: formData.assistantName || 'My Voice Assistant',
        completedOnboarding: true,
        phoneNumber: '',
        dailycallLimit: 0,
        automaticReminders: false,
        waitlistManagement: false,
        plan: 'TRIAL',
        planStart: new Date(),
        planEnd: new Date(new Date().setDate(new Date().getDate() + 15)), // 15-day trial
        totalUsageMinutes: 0,
        voiceAgentActive: true,
      });
      setOnboardingCompleted(true);
      setShowVoiceAgentForm(false);
    } catch (error) {
      console.error('Error saving profile:', error);
      setError('Failed to save profile. Please try again.');
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  if (showVoiceAgentForm) {
    return (
      <div className="min-h-screen p-8 text-white bg-transparent">
        <CreateVoiceAgentForm onSubmit={handleVoiceAgentFormSubmit} />
      </div>
    );
  }

  if (showPricingPlans) {
    return <PricingPlans />;
  }

  return (
    <>
      <MouseTrail />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="relative z-20 min-h-screen text-white bg-transparent"
      >
        <Header
          hasChanges={hasChanges}
          onSave={handleSave}
          onOpenAuth={() => setShowAuthModal(true)}
          user={user}
          saving={saving}
          onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          isMobileMenuOpen={isMobileMenuOpen}
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          userProfile={userProfile}
          setAuthType={setAuthType}
        />

        <Navigation
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          onLogout={handleLogout}
          onSubscribe={() => setShowPricingPlans(true)}
        />

        <main className={`lg:ml-64 flex-1 pt-24 px-4 lg:px-8 pb-20 lg:pb-8`}>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-4 mb-6 text-red-500 rounded-lg bg-red-500/10"
            >
              {error}
            </motion.div>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              {activeSection === 'dashboard' && (
                <Dashboard data={analysisData} userProfile={userProfile} />
              )}
              {activeSection === 'analytics' && (
                <AnalyticsSection data={analysisData} />
              )}
              {activeSection === 'history' && (
                <CallHistory modelId={userProfile?.model_id} />
              )}
              {activeSection === 'help' && <HelpCenter />}
              {activeSection === 'settings' && (
                <div className="space-y-8">
                  <NavigationTabs
                    activeTab={activeTab}
                    totalMinutes={analysisData.total_mins}
                    phoneNumber={formData.phoneNumber}
                    onTabChange={setActiveTab}
                  />
                  {activeTab === 'voice' && (
                    <VoiceSettings
                      formData={formData}
                      onChange={handleChange}
                    />
                  )}
                  {activeTab === 'general' && (
                    <GeneralSettings
                      formData={formData}
                      onChange={handleChange}
                    />
                  )}
                  {activeTab === 'calls' && (
                    <CallSettings formData={formData} onChange={handleChange} />
                  )}
                  {activeTab === 'calendar' && (
                    <CalendarSettings
                      formData={formData}
                      onChange={handleChange}
                    />
                  )}
                  {activeTab === 'faq' && (
                    <FAQSettings formData={formData} onChange={handleChange} />
                  )}
                  {activeTab === 'training' && <VoiceTrainingSettings />}
                  {activeTab === 'transfer' && <CallTransferSettings />}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </motion.div>
    </>
  );
}

export default UserDashboard;
