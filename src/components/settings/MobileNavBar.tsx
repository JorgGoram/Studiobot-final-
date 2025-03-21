import React from 'react';
import { Mic, PhoneForwarded, Calendar, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface SettingsItem {
  id: string;
  label: string;
}

interface MobileNavBarProps {
  settingsCategories: Array<{
    id: string;
    label: string;
    icon: React.ElementType;
    items: SettingsItem[];
  }>;
  activeItem: string;
  onNavigation: (itemId: string) => void;
}

export function MobileNavBar({ settingsCategories, activeItem, onNavigation }: MobileNavBarProps) {
  // Get the first setting from each major category for quick access
  const getFirstCategoryItem = (categoryId: string) => {
    const category = settingsCategories.find(cat => cat.id === categoryId);
    return category?.items[0]?.id || '';
  };

  // Find which category the active item belongs to
  const getActiveCategory = () => {
    for (const category of settingsCategories) {
      if (category.items.some(item => item.id === activeItem)) {
        return category.id;
      }
    }
    return '';
  };

  const activeCategory = getActiveCategory();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-md border-t border-gray-800 z-30">
      {/* Main bottom navigation */}
      <nav className="grid grid-cols-4 items-center relative">
        {settingsCategories.map((category) => {
          const Icon = category.icon;
          const isActive = category.id === activeCategory;
          
          return (
            <motion.button 
              key={category.id}
              onClick={() => onNavigation(getFirstCategoryItem(category.id))}
              whileTap={{ scale: 0.95 }}
              className={`flex flex-col items-center py-3 px-1 relative ${
                isActive ? 'text-[#904af2]' : 'text-zinc-400 hover:text-white'
              }`}
            >
              {/* Active indicator */}
              {isActive && (
                <motion.div 
                  layoutId="active-indicator"
                  className="absolute top-0 left-0 right-0 h-1 bg-[#904af2]"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
              
              <Icon className="w-5 h-5 mb-1" />
              <span className="text-xs">{category.label}</span>
            </motion.button>
          );
        })}
      </nav>
      
      {/* Secondary navigation - show subcategories of the active section */}
      {activeCategory && (
        <div className="border-t border-zinc-800/50 overflow-x-auto scrollbar-hide">
          <div className="flex whitespace-nowrap px-2 py-2">
            {settingsCategories
              .find(cat => cat.id === activeCategory)
              ?.items.map((item) => (
                <motion.button
                  key={item.id}
                  onClick={() => onNavigation(item.id)}
                  whileTap={{ scale: 0.95 }}
                  className={`px-3 py-1.5 mx-1 rounded-full text-xs font-medium ${
                    activeItem === item.id 
                      ? 'bg-[#904af2]/20 text-[#904af2] border border-[#904af2]/30' 
                      : 'bg-zinc-800/30 text-zinc-400 border border-zinc-800/50'
                  }`}
                >
                  {item.label}
                </motion.button>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}