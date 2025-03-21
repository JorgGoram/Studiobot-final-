import { motion } from 'framer-motion';
import { LogOut, LayoutDashboard, Activity, Settings, HelpCircle, CreditCard, MoreHorizontal, History } from 'lucide-react';
import type { NavigationSection } from '../constants/navigation';
import { NAVIGATION_ITEMS, ADDITIONAL_ITEMS } from '../constants/navigation';
import { useState } from 'react';

interface NavigationProps {
  activeSection: string;
  onSectionChange: (section: NavigationSection) => void;
  onLogout: () => void;
  onSubscribe: () => void;
}

export function Navigation({ activeSection, onSectionChange, onLogout, onSubscribe }: NavigationProps) {
  const [showMoreModal, setShowMoreModal] = useState(false);

  // Mobile navigation items
  const mobileNavItems = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'analytics', label: 'Analytics', icon: Activity },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'more', label: 'More', icon: MoreHorizontal },
  ];

  // More modal items
  const moreItems = [
    { id: 'history', label: 'Call History', icon: History, onClick: () => onSectionChange('history') },
    { id: 'help', label: 'Help Center', icon: HelpCircle, onClick: () => onSectionChange('help') },
    { id: 'subscribe', label: 'Subscribe', icon: CreditCard, onClick: onSubscribe },
    { id: 'logout', label: 'Log Out', icon: LogOut, onClick: onLogout },
  ];

  return (
    <>
      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#080809]/95 backdrop-blur-md border-t border-purple-900/10 lg:hidden z-50">
        <nav className="flex justify-around items-center py-3 px-4">
          {mobileNavItems.map((item) => (
            <button
              key={item.id}
              onClick={() => item.id === 'more' ? setShowMoreModal(true) : onSectionChange(item.id as NavigationSection)}
              className={`flex flex-col items-center space-y-1 ${
                activeSection === item.id ? 'text-purple-400' : 'text-zinc-400'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-xs">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* More Modal */}
      {showMoreModal && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] lg:hidden"
          onClick={() => setShowMoreModal(false)}
        >
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            className="absolute bottom-0 left-0 right-0 bg-[#080809] rounded-t-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4">
              <div className="w-12 h-1 bg-zinc-700 rounded-full mx-auto mb-6" />
              <div className="space-y-2">
                {moreItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setShowMoreModal(false);
                      item.onClick();
                    }}
                    className="w-full flex items-center gap-3 p-4 rounded-lg text-left text-zinc-400 hover:text-white hover:bg-zinc-800/50 transition-all"
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="w-64 h-screen fixed left-0 top-0 pt-24 px-4 bg-[#0a0a0a]/90 backdrop-blur-md border-r border-purple-900/20"
        >
          <nav className="space-y-2">
            {NAVIGATION_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                  activeSection === item.id
                    ? 'bg-purple-600 text-white'
                    : 'text-zinc-400 hover:bg-purple-600/10 hover:text-white'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            ))}

            {/* Additional Items */}
            {ADDITIONAL_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={onSubscribe}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all text-purple-400 hover:bg-purple-600/10 hover:text-white"
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            ))}

            {/* Logout Button */}
            <button
              onClick={onLogout}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all text-zinc-400 hover:bg-purple-600/10 hover:text-zinc-300 mt-8"
            >
              <LogOut className="w-5 h-5" />
              <span>Log Out</span>
            </button>
          </nav>
        </motion.div>
      </div>
    </>
  );
}