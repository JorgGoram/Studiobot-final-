import { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Store,
  Mic, 
  MessageSquare,
  MessageSquareDashed,
  Calendar,
  PhoneForwarded,
  ShieldAlert,
  HelpCircle,
  FolderArchive,
  Sparkles,
  Diamond,
  Star,
  ChevronsRight,
  ArrowLeft,
  Menu,
  X,
  CheckCircle,
  User,
  Loader
} from 'lucide-react';
import { Link } from 'react-router-dom';

// Lazy load component sections
const BusinessHoursSettings = lazy(() => import('./example-sections/BusinessHoursSettings'));
const GreetingMessageSettings = lazy(() => import('./example-sections/GreetingMessageSettings'));
const VoicemailSettings = lazy(() => import('./example-sections/VoicemailSettings'));
const InlineHelpCard = lazy(() => import('./InlineHelpCard'));
const UpgradePrompt = lazy(() => import('./UpgradePrompt'));

export interface SettingsItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  description: string;
  isPremium?: boolean;
  component: React.ReactNode;
  category: string;
  completionScore?: number;
}

// Component loader for lazy-loaded components
const ComponentLoader = () => (
  <div className="flex items-center justify-center p-8">
    <Loader className="w-8 h-8 text-[#904af2] animate-spin" />
  </div>
);

export default function SettingsLayout() {
  const [activeItem, setActiveItem] = useState('business-hours');
  const [searchQuery, setSearchQuery] = useState('');
  const [completed, setCompleted] = useState<string[]>([]);
  const [showWelcomePrompt, setShowWelcomePrompt] = useState(true);
  const [showSidebar, setShowSidebar] = useState(window.innerWidth >= 1024);
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(window.innerWidth < 1024);
  
  // Settings categories with their items
  const settingsCategories = [
    {
      id: 'voice-configuration',
      label: 'Voice',
      icon: Mic,
      items: [
        { 
          id: 'business-hours', 
          label: 'Business Hours', 
          icon: <Store className="w-5 h-5" />, 
          description: 'Set your studio\'s operating hours',
          component: <Suspense fallback={<ComponentLoader />}><BusinessHoursSettings /></Suspense>,
          category: 'voice-configuration',
          completionScore: 20
        },
        { 
          id: 'voice-settings', 
          label: 'Voice Style', 
          icon: <Mic className="w-5 h-5" />, 
          description: 'Customize your assistant\'s voice',
          component: <div className="text-gray-400">Voice Settings would appear here.</div>,
          category: 'voice-configuration',
          completionScore: 15
        },
        { 
          id: 'greeting-message', 
          label: 'Greeting', 
          icon: <MessageSquare className="w-5 h-5" />, 
          description: 'Set your greeting message',
          component: <Suspense fallback={<ComponentLoader />}><GreetingMessageSettings /></Suspense>,
          category: 'voice-configuration',
          completionScore: 10
        }
      ]
    },
    {
      id: 'call-management',
      label: 'Calls',
      icon: PhoneForwarded,
      items: [
        { 
          id: 'voicemail-settings', 
          label: 'Voicemail', 
          icon: <MessageSquareDashed className="w-5 h-5" />, 
          description: 'Configure voicemail settings',
          component: <Suspense fallback={<ComponentLoader />}><VoicemailSettings /></Suspense>,
          category: 'call-management',
          completionScore: 10
        },
        { 
          id: 'call-transfer-rules', 
          label: 'Call Routing', 
          icon: <PhoneForwarded className="w-5 h-5" />, 
          description: 'Manage call transfers',
          isPremium: true,
          component: <div className="text-gray-400">Call Routing Settings would appear here.</div>,
          category: 'call-management',
          completionScore: 10
        },
        { 
          id: 'spam-filter', 
          label: 'Spam Protection', 
          icon: <ShieldAlert className="w-5 h-5" />, 
          description: 'Block unwanted callers',
          component: <div className="text-gray-400">Spam Protection Settings would appear here.</div>,
          category: 'call-management',
          completionScore: 5
        }
      ]
    },
    {
      id: 'business-tools',
      label: 'Business',
      icon: Calendar,
      items: [
        { 
          id: 'calendar-integration', 
          label: 'Calendar', 
          icon: <Calendar className="w-5 h-5" />, 
          description: 'Connect your calendar',
          isPremium: true,
          component: <div className="text-gray-400">Calendar Settings would appear here.</div>,
          category: 'business-tools',
          completionScore: 15
        },
        { 
          id: 'faq-management', 
          label: 'FAQ', 
          icon: <HelpCircle className="w-5 h-5" />, 
          description: 'Add common responses',
          isPremium: true,
          component: <div className="text-gray-400">FAQ Settings would appear here.</div>,
          category: 'business-tools',
          completionScore: 10
        },
        { 
          id: 'training-materials', 
          label: 'Custom Training', 
          icon: <FolderArchive className="w-5 h-5" />, 
          description: 'Train your assistant',
          isPremium: true,
          component: <div className="text-gray-400">Custom Training Settings would appear here.</div>,
          category: 'business-tools',
          completionScore: 5
        }
      ]
    },
    {
      id: 'account-settings',
      label: 'Account',
      icon: User,
      items: [
        { 
          id: 'profile-settings', 
          label: 'Profile', 
          icon: <User className="w-5 h-5" />, 
          description: 'Edit your profile information',
          component: <div className="text-gray-400">Profile Settings would appear here.</div>,
          category: 'account-settings',
          completionScore: 10
        }
      ]
    }
  ];
  
  // Flatten all items for easier access
  const allSettingsItems = settingsCategories.flatMap(category => category.items);
  
  // Find the active item
  const activeSettingItem = allSettingsItems.find(item => item.id === activeItem);
  
  // Calculate completion percentage
  const totalCompletionScore = allSettingsItems.reduce((acc, item) => acc + (item.completionScore || 0), 0);
  const completedScore = allSettingsItems
    .filter(item => completed.includes(item.id))
    .reduce((acc, item) => acc + (item.completionScore || 0), 0);
  const completionPercentage = Math.round((completedScore / totalCompletionScore) * 100);

  // Mark an item as completed
  const markAsCompleted = (itemId: string) => {
    if (!completed.includes(itemId)) {
      setCompleted([...completed, itemId]);
    }
  };

  // Handle navigation between settings items
  const handleNavigation = (itemId: string) => {
    setActiveItem(itemId);
    if (isMobileOrTablet) {
      setShowSidebar(false); // Auto-close sidebar on mobile/tablet after selection
    }
  };

  // Dismiss the welcome prompt
  const dismissWelcomePrompt = () => {
    setShowWelcomePrompt(false);
  };
  
  useEffect(() => {
    const handleResize = () => {
      const newIsMobileOrTablet = window.innerWidth < 1024;
      setIsMobileOrTablet(newIsMobileOrTablet); 
      setShowSidebar(window.innerWidth >= 1024);
    };
    
    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Get the current category for mobile/tablet view
  const getCurrentCategory = () => {
    for (const category of settingsCategories) {
      if (category.items.some(item => item.id === activeItem)) {
        return category;
      }
    }
    return settingsCategories[0];
  };

  // Toggle sidebar with animation fix
  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  return (
    <div className="min-h-screen bg-black text-white font-poppins">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-black/90 backdrop-blur-sm border-b border-gray-800/50 px-4 py-3">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="p-2 rounded-lg text-gray-400 hover:text-white">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-lg font-semibold">Settings</h1>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Progress indicator for desktop only */}
            <div className="hidden lg:flex items-center bg-zinc-900/80 px-2 py-1 rounded-full text-xs">
              <div className="w-16 h-1.5 bg-zinc-800 rounded-full overflow-hidden mr-2">
                <motion.div 
                  className="h-full bg-gradient-to-r from-[#904af2] to-[#a060ff]"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
              <span>{completionPercentage}%</span>
            </div>
            
            {/* Enhanced mobile/tablet menu button with purple highlight on active */}
            <motion.button 
              onClick={toggleSidebar}
              whileTap={{ scale: 0.9 }}
              className={`p-2.5 rounded-lg ${showSidebar ? 'bg-[#904af2]/20 border border-[#904af2]/30' : 'bg-zinc-900 hover:bg-zinc-800'} text-white relative overflow-hidden`}
              aria-label={showSidebar ? "Close sidebar" : "Open sidebar"}
            >
              <AnimatePresence mode="wait">
                {showSidebar ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="w-5 h-5" />
                  </motion.div>
                )}
              </AnimatePresence>
              
              {/* Menu button highlight pulse effect */}
              {!showSidebar && isMobileOrTablet && (
                <motion.span 
                  className="absolute inset-0 bg-[#904af2]/10"
                  animate={{ opacity: [0.2, 0.5, 0.2] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
              )}
            </motion.button>
          </div>
        </div>
      </header>
      
      <div className="container mx-auto px-4 relative">
        <div className="flex relative">
          {/* Sidebar - Mobile/Tablet overlay */}
          <AnimatePresence>
            {showSidebar && (
              <>
                {/* Mobile/Tablet backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`fixed inset-0 bg-black/80 backdrop-blur-sm z-30 ${!isMobileOrTablet && 'hidden'}`}
                  onClick={() => setShowSidebar(false)}
                />
                
                {/* Sidebar content */}
                <motion.div 
                  initial={isMobileOrTablet ? { x: '-100%' } : { opacity: 0, width: 0 }}
                  animate={isMobileOrTablet ? { x: 0 } : { opacity: 1, width: "auto" }}
                  exit={isMobileOrTablet ? { x: '-100%' } : { opacity: 0, width: 0 }}
                  transition={{ type: "spring", damping: 20, stiffness: 200 }}
                  className={`${
                    isMobileOrTablet 
                      ? 'fixed left-0 top-0 bottom-0 w-[85%] max-w-[320px] z-40 pt-16 pb-4 overflow-y-auto scrollbar-hide' 
                      : 'relative w-64 min-w-64'
                  } bg-black/95 border-r border-gray-800/50 overflow-auto`}
                >
                  {/* Mobile/Tablet close button */}
                  {isMobileOrTablet && (
                    <div className="absolute top-4 right-4">
                      <motion.button 
                        onClick={() => setShowSidebar(false)}
                        whileTap={{ scale: 0.95 }}
                        className="p-2 rounded-full bg-zinc-900 hover:bg-zinc-800"
                      >
                        <X className="w-4 h-4" />
                      </motion.button>
                    </div>
                  )}
                  
                  <div className="p-4">
                    {/* Setup progress */}
                    <div className="mb-4 p-3 bg-zinc-900/70 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Setup Progress</span>
                        <span className="text-xs bg-[#904af2]/20 text-[#904af2] px-2 py-0.5 rounded-full">
                          {completionPercentage}%
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-gradient-to-r from-[#904af2] to-[#a060ff]"
                          style={{ width: `${completionPercentage}%` }}
                          initial={{ width: 0 }}
                          animate={{ width: `${completionPercentage}%` }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                    </div>
                    
                    {/* Settings categories */}
                    <div className="space-y-2">
                      {settingsCategories.map((category) => (
                        <div key={category.id} className="bg-zinc-900/50 rounded-xl overflow-hidden">
                          <div className="p-3 font-medium flex items-center">
                            <div className="w-6 h-6 mr-2 rounded-md bg-[#904af2]/10 flex items-center justify-center">
                              <category.icon className="w-4 h-4 text-[#904af2]" />
                            </div>
                            {category.label}
                          </div>
                          
                          <div className="px-2 pb-2">
                            {category.items.map((item) => (
                              <motion.button
                                key={item.id}
                                onClick={() => handleNavigation(item.id)}
                                whileTap={{ scale: 0.98 }}
                                className={`w-full flex items-center justify-between p-3 rounded-lg text-left text-sm transition-all
                                  ${activeItem === item.id ? 
                                    'bg-[#904af2]/20 text-white' : 
                                    'text-gray-300 hover:text-white hover:bg-zinc-800/50'
                                  }`}
                              >
                                <div className="flex items-center gap-2.5">
                                  <div className={`w-5 h-5 ${activeItem === item.id ? 'text-[#904af2]' : 'text-gray-400'}`}>
                                    {item.icon}
                                  </div>
                                  <span>{item.label}</span>
                                </div>
                                
                                <div className="flex items-center">
                                  {item.isPremium && (
                                    <div className="text-amber-400 text-[10px] bg-amber-500/10 px-1 py-0.5 rounded mr-1">PRO</div>
                                  )}
                                  
                                  {completed.includes(item.id) && (
                                    <CheckCircle className="w-4 h-4 text-green-400" />
                                  )}
                                  
                                  {activeItem === item.id && (
                                    <ChevronsRight className="w-4 h-4 text-[#904af2] ml-1" />
                                  )}
                                </div>
                              </motion.button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
          
          {/* Main Content */}
          <main className={`flex-1 py-4 pb-16 transition-all duration-300 ${showSidebar && !isMobileOrTablet ? 'ml-64' : 'ml-0'} ${isMobileOrTablet ? 'pb-24' : ''}`}>
            {/* Page header with breadcrumbs */}
            <div className="mb-4">
              <div className="flex flex-wrap items-center text-sm text-zinc-400 mb-2">
                <span className="capitalize">{getCurrentCategory().label}</span>
                <span className="mx-2">›</span>
                <span className="text-white">{activeSettingItem?.label}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold flex items-center">
                  <span className="flex-shrink-0 w-8 h-8 mr-2 bg-[#904af2]/10 rounded-lg flex items-center justify-center">
                    {activeSettingItem?.icon}
                  </span>
                  {activeSettingItem?.label}
                  {activeSettingItem?.isPremium && (
                    <span className="ml-2 px-1.5 py-0.5 bg-amber-500/20 text-amber-300 text-xs rounded-full font-normal">
                      PRO
                    </span>
                  )}
                </h2>
                
                {!completed.includes(activeItem) && (
                  <button
                    onClick={() => markAsCompleted(activeItem)}
                    className="flex items-center text-xs bg-[#904af2]/20 px-2 py-1 rounded-lg text-[#904af2]"
                  >
                    <span>Mark Done</span>
                    <CheckCircle className="w-3 h-3 ml-1" />
                  </button>
                )}
              </div>
              
              <p className="text-zinc-400 text-sm mt-1">
                {activeSettingItem?.description}
              </p>
            </div>
            
            {showWelcomePrompt && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-[#904af2]/10 border border-[#904af2]/30 rounded-xl p-4 mb-4"
              >
                <div className="flex justify-between items-start">
                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#904af2]/20 flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-[#904af2]" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-1">Welcome to Settings</h3>
                      <p className="text-sm text-gray-300">
                        Customize your AI voice assistant for your studio's needs.
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={dismissWelcomePrompt}
                    className="text-gray-400 hover:text-white p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}
            
            {/* Main Settings Content */}
            <div className="bg-zinc-900/50 rounded-xl overflow-hidden mb-8">
              <div className="p-6">
                <Suspense fallback={<ComponentLoader />}>
                  {activeSettingItem?.component}
                  
                  {activeSettingItem?.isPremium && (
                    <UpgradePrompt 
                      feature={activeSettingItem.label} 
                      description={`Upgrade to Pro to unlock ${activeSettingItem.label} and other premium features.`}
                    />
                  )}
                </Suspense>
              </div>
            </div>
            
            {/* Help section */}
            {!activeSettingItem?.isPremium && (
              <div className="mt-4 mb-6">
                <Suspense fallback={<ComponentLoader />}>
                  <InlineHelpCard 
                    title={`Tips for ${activeSettingItem?.label || 'Settings'}`}
                    icon={<HelpCircle className="w-5 h-5 text-[#904af2]" />}
                    tips={[
                      "Keep your business hours up to date to avoid missed appointments",
                      "A clear, friendly greeting message sets the right tone for callers"
                    ]}
                  />
                </Suspense>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}