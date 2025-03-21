import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mic,
  Star,
  Settings,
  Activity,
  Clock,
  Phone,
  Calendar,
  MessageSquare,
  Zap,
  PhoneForwarded,
  Menu,
  X,
} from 'lucide-react';
import { convertSecondsToHHMMSS, isExpired } from '../utils';
import { loadUserProfile } from '../lib/supabase';
import { useUserProfile } from '../hooks/useUserProfile';

interface NavigationTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  totalMinutes?: number;
  phoneNumber?: string;
}

export function NavigationTabs({
  activeTab,
  onTabChange,
  totalMinutes = 0,
  phoneNumber = '+1 (888) 123-4567',
}: NavigationTabsProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [agentState, setAgentState] = useState(true);
  const user = useUserProfile();
  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'voice', label: 'Voice', icon: Mic },
    { id: 'calls', label: 'Calls', icon: Activity },
    { id: 'calendar', label: 'Calendar', icon: Calendar, isPro: true },
    { id: 'faq', label: 'FAQ', icon: MessageSquare },
    { id: 'training', label: 'Agent Training', icon: Zap, isPro: true },
    {
      id: 'transfer',
      label: 'Call Transfer',
      icon: PhoneForwarded,
      isPro: true,
    },
  ];

  const handleTabChange = (tabId: string) => {
    onTabChange(tabId);
    setIsDrawerOpen(false);
  };
  return (
    <div className="space-y-8">
      {/* Mobile Menu Button */}
      <div className="lg:hidden flex justify-between items-center">
        <button
          onClick={() => setIsDrawerOpen(true)}
          className="p-2 rounded-lg bg-zinc-900/80 hover:bg-zinc-800 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="text-sm font-medium">
          {tabs.find((tab) => tab.id === activeTab)?.label}
        </div>
        <div className="w-9 h-9" /> {/* Spacer for alignment */}
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setIsDrawerOpen(false)}
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed left-0 top-0 bottom-0 w-[85%] max-w-[320px] bg-zinc-900/95 border-r border-zinc-800/50 z-50 lg:hidden overflow-y-auto"
            >
              <div className="p-4">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold">Settings</h3>
                  <button
                    onClick={() => setIsDrawerOpen(false)}
                    className="p-2 rounded-lg hover:bg-zinc-800/50"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => handleTabChange(tab.id)}
                      className={`w-full flex items-center justify-between p-3 rounded-lg transition-all ${
                        activeTab === tab.id
                          ? 'bg-[#904AF2] text-white'
                          : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <tab.icon className="w-5 h-5" />
                        <span>{tab.label}</span>
                      </div>
                      {tab.isPro && (
                        <span className="text-[10px] bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded-full">
                          PRO
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Navigation */}
      <div className="hidden lg:flex justify-center space-x-2">
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`flex items-center px-4 py-2 rounded-xl transition-all ${
              activeTab === tab.id
                ? 'bg-[#904AF2] text-white shadow-lg shadow-[#904AF2]/20'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50 backdrop-blur-sm'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <tab.icon className="w-5 h-5 mr-2" />
            <div className="text-left flex items-center gap-2">
              <div className="font-medium">{tab.label}</div>
              {tab.isPro && (
                <span className="text-[10px] bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded-full">
                  PRO
                </span>
              )}
            </div>
          </motion.button>
        ))}
      </div>

      {/* Status Bar */}
      <div className="p-4 bg-zinc-900/30 backdrop-blur-sm rounded-lg border border-zinc-800/50">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          {/* Status */}
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 ${
                isExpired(user) ? 'bg-green-500' : 'bg-red-500'
              } rounded-full animate-pulse`}
            ></div>
            <span className="font-medium">Agent Status</span>
            <span className="text-zinc-400 text-sm">
              {isExpired(user)
                ? 'Active - Ready to take calls'
                : 'Passive - Disable to take calls'}
            </span>
          </div>

          {/* Phone */}
          <div className="flex items-center gap-2 w-full lg:w-auto">
            <Phone className="w-4 h-4 text-[#904AF2] flex-shrink-0" />
            <span className="text-zinc-400 text-sm">Phone</span>
            <span className="text-[#904AF2] font-medium truncate">
              {phoneNumber}
            </span>
          </div>

          {/* Total Time */}
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#904AF2]" />
            <span className="text-zinc-400 text-sm">Total Time</span>
            <span className="text-[#904AF2] font-medium">
              {convertSecondsToHHMMSS(totalMinutes)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
