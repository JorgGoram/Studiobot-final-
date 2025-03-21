import { motion, AnimatePresence } from 'framer-motion';
import { SettingsItem } from './SettingsLayout';
import { CheckCircle2, ChevronDown, ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface SettingsSidebarProps {
  settingsCategories: Array<{
    id: string;
    label: string;
    items: SettingsItem[];
  }>;
  activeItem: string;
  completed: string[];
  searchQuery: string;
  onNavigation: (itemId: string) => void;
  compactView: boolean;
}

export function SettingsSidebar({
  settingsCategories,
  activeItem,
  completed,
  searchQuery,
  onNavigation,
  compactView
}: SettingsSidebarProps) {
  // Store expanded sections
  const [expandedSections, setExpandedSections] = useState<string[]>(
    settingsCategories.map(category => category.id)
  );

  // Toggle section expansion
  const toggleSection = (sectionId: string) => {
    if (expandedSections.includes(sectionId)) {
      setExpandedSections(expandedSections.filter(id => id !== sectionId));
    } else {
      setExpandedSections([...expandedSections, sectionId]);
    }
  };

  // Filter items by search query
  const filteredCategories = searchQuery
    ? settingsCategories.map(category => ({
        ...category,
        items: category.items.filter(item =>
          item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase())
        ),
      })).filter(category => category.items.length > 0)
    : settingsCategories;

  // Calculate completion for categories
  const getCategoryCompletion = (categoryId: string) => {
    const categoryItems = settingsCategories
      .find(cat => cat.id === categoryId)?.items || [];
    
    const totalItems = categoryItems.length;
    const completedItems = categoryItems.filter(item => completed.includes(item.id)).length;
    
    return {
      count: completedItems,
      total: totalItems,
      percentage: totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0
    };
  };

  return (
    <aside className="glass-panel rounded-xl overflow-hidden p-2">
      <div className="p-2 mb-2">
        <h2 className="text-lg font-semibold">Configuration</h2>
        <p className="text-sm text-gray-400">All voice assistant settings</p>
      </div>
      
      <div className="overflow-auto max-h-[calc(100vh-200px)] pb-2">
        {searchQuery && filteredCategories.length === 0 ? (
          <div className="p-4 text-center text-gray-400">
            <p>No settings match your search</p>
          </div>
        ) : (
          filteredCategories.map(category => (
            <div key={category.id} className="mb-2 rounded-lg overflow-hidden">
              {/* Category Header */}
              <button 
                onClick={() => toggleSection(category.id)}
                className="w-full flex items-center justify-between p-3 text-left rounded-lg bg-gray-900/50 hover:bg-[#0f0f0f] transition-colors"
              >
                <div className="flex flex-col">
                  <span className="font-medium">{category.label}</span>
                  {!compactView && (
                    <div className="flex items-center mt-1">
                      <div className="w-16 h-1 bg-gray-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-[#904af2] to-[#a060ff]"
                          style={{ width: `${getCategoryCompletion(category.id).percentage}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-500 ml-2">
                        {getCategoryCompletion(category.id).count}/{getCategoryCompletion(category.id).total}
                      </span>
                    </div>
                  )}
                </div>
                <div>
                  {expandedSections.includes(category.id) ? (
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  )}
                </div>
              </button>
              
              {/* Category Items */}
              <AnimatePresence>
                {expandedSections.includes(category.id) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="pl-2 py-2">
                      {category.items.map(item => (
                        <motion.button
                          key={item.id}
                          onClick={() => onNavigation(item.id)}
                          className={`w-full flex items-center justify-between p-2.5 mb-1 rounded-lg text-left transition-all
                            ${activeItem === item.id ? 
                              'bg-[#904af2]/20 text-white relative overflow-hidden' : 
                              'text-gray-300 hover:text-white hover:bg-[#1a1a1a]'
                            }`}
                          whileHover={{ x: 2 }}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`${activeItem === item.id ? 'text-[#904af2]' : 'text-gray-400'}`}>
                              {item.icon}
                            </div>
                            <div className="flex flex-col">
                              <div className="flex items-center">
                                <span className={`text-sm ${activeItem === item.id ? 'font-medium' : ''}`}>
                                  {item.label}
                                </span>
                                {item.isPremium && (
                                  <div className="ml-2 text-amber-400 text-[10px] bg-amber-500/10 px-1 py-0.5 rounded">PRO</div>
                                )}
                              </div>
                              {!compactView && (
                                <span className="text-xs text-gray-500 truncate max-w-[180px]">
                                  {item.description}
                                </span>
                              )}
                            </div>
                          </div>
                          
                          {completed.includes(item.id) && (
                            <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                          )}
                          
                          {activeItem === item.id && (
                            <div className="absolute inset-0 bg-gradient-to-r from-[#904af2]/10 to-transparent -z-10"></div>
                          )}
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))
        )}
      </div>
      
      {/* Setup progress */}
      <div className="p-3 mt-2 border-t border-gray-800/50">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">Setup Progress</span>
          <span className="text-xs bg-[#904af2]/10 text-[#904af2] px-2 py-1 rounded-full">
            {completed.length}/{settingsCategories.flatMap(c => c.items).length}
          </span>
        </div>
        <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ 
              width: `${Math.round((completed.length / settingsCategories.flatMap(c => c.items).length) * 100)}%` 
            }}
            transition={{ duration: 0.5 }}
            className="h-full bg-gradient-to-r from-[#904af2] via-[#9d5ff5] to-[#a060ff]"
          />
        </div>
      </div>
    </aside>
  );
}