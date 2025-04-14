import { useState, useEffect } from 'react';
import { Hero } from '../components/Hero';
import { Assistant } from '../components/Assistant';
import { DynamicStats } from '../components/DynamicStats';
import { AboutUs } from '../components/AboutUs';
import { VoiceAgents } from '../components/VoiceAgents';
import { ROICalculator } from '../components/ROICalculator';
import { FAQ } from '../components/FAQ';
import { AuthModal } from '../components/auth/AuthModal';
import { Header } from '../components/Header';
import { AnimatePresence } from 'framer-motion';
import { PricingSection } from '../components/PricingSection';

export function LandingPage() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authType, setAuthType] = useState<'login' | 'signup'>('login');
  const [user, setUser] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const scrollToWidget = () => {
    const widgetSection = document.getElementById('widget-section');
    if (widgetSection) {
      widgetSection.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-poppins">
      <Header
        hasChanges={false}
        onSave={() => {}}
        onOpenAuth={() => setShowAuthModal(true)}
        user={user}
        saving={false}
        onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        isMobileMenuOpen={isMobileMenuOpen}
        activeSection="dashboard"
        onSectionChange={() => {}}
        userProfile={null}
        setAuthType={setAuthType}
      />
      <AnimatePresence>
        {showAuthModal && (
          <AuthModal
            type={authType}
            onClose={() => setShowAuthModal(false)}
            onToggleType={() =>
              setAuthType((prev) => (prev === 'login' ? 'signup' : 'login'))
            }
          />
        )}
      </AnimatePresence>
      <main>
        <div className="section-background hero-background">
          <Hero onStartCall={scrollToWidget} />
        </div>
        <div className="section-background">
          <Assistant onStartCall={scrollToWidget} />
        </div>
        <div className="section-background stats-background">
          <DynamicStats />
        </div>
        <div className="section-background">
          <AboutUs onStartCall={scrollToWidget} />
        </div>
        <div className="section-background voice-agents-background">
          <VoiceAgents onStartCall={scrollToWidget} />
        </div>
        <div className="section-background">
          <ROICalculator />
        </div>
        <div className="section-background">
          <PricingSection onStartCall={scrollToWidget} />
        </div>
        <div className="section-background faq-background">
          <FAQ />
        </div>
      </main>
    </div>
  );
}

export default LandingPage;
