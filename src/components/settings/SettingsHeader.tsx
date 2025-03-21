import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Menu, Search, X, Settings, ChevronsLeft, ChevronsRight, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface SettingsHeaderProps {
  completionPercentage: number;
  toggleSidebar: () => void;
  toggleCompactView: () => void;
  showSidebar: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export function SettingsHeader({
  completionPercentage,
  toggleSidebar,
  toggleCompactView,
  showSidebar,
  searchQuery,
  setSearchQuery
}: SettingsHeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isSearching, setIsSearching] = useState(false);

  // Check screen size
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Check scroll position
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <header className={`sticky top-0 z-40 transition-all duration-300 ${scrolled ? 'py-2 bg-black/90 backdrop-blur-lg shadow-md' : 'py-2 sm:py-4 bg-black/75 backdrop-blur-sm'}`}>
      <div className="container mx-auto px-4">
        {isSearching ? (
          // Mobile search view
          <div className="flex items-center">
            <button
              onClick={() => {
                setIsSearching(false);
                setSearchQuery('');
              }}
              className="p-2 rounded-lg"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex-1 mx-2">
              <input
                type="text"
                placeholder="Search settings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#0f0f0f] border border-gray-800 rounded-lg pl-3 pr-8 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#904AF2]"
                autoFocus
              />
            </div>
            {searchQuery && (
              <button 
                className="p-2"
                onClick={() => setSearchQuery('')}
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            )}
          </div>
        ) : (
          // Normal header view
          <div className="flex items-center justify-between">
            {/* Left section */}
            <div className="flex items-center space-x-1 sm:space-x-3">
              {/* Back to dashboard on mobile */}
              {isMobile ? (
                <Link to="/" className="p-2">
                  <ArrowLeft className="w-5 h-5" />
                </Link>
              ) : (
                // Desktop sidebar toggle
                <button 
                  onClick={toggleSidebar}
                  className="p-2 rounded-lg hover:bg-[#1a1a1a] transition-colors"
                >
                  {showSidebar ? <ChevronsLeft className="w-5 h-5" /> : <ChevronsRight className="w-5 h-5" />}
                </button>
              )}
              
              <div className="flex items-center">
                <Settings className="w-5 h-5 sm:w-6 sm:h-6 text-[#904af2]" />
                <h1 className="text-lg sm:text-xl font-semibold ml-2">Settings</h1>
              </div>
              
              {/* Progress indicator on desktop */}
              {!isMobile && (
                <div className="hidden md:flex items-center ml-4">
                  <div className="w-24 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${completionPercentage}%` }}
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                      className="h-full bg-gradient-to-r from-[#904af2] to-[#a060ff]"
                    />
                  </div>
                  <span className="text-xs text-gray-400 ml-2">{completionPercentage}%</span>
                </div>
              )}
            </div>
            
            {/* Right section */}
            <div className="flex items-center space-x-1 sm:space-x-2">
              {/* Search button on mobile */}
              {isMobile && (
                <button 
                  className="p-2 rounded-lg hover:bg-[#1a1a1a] transition-colors"
                  onClick={() => setIsSearching(true)}
                >
                  <Search className="w-5 h-5" />
                </button>
              )}
              
              {/* Search on desktop */}
              {!isMobile && (
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search settings..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-56 bg-[#0f0f0f] border border-gray-800 rounded-lg pl-9 pr-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#904AF2]"
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  {searchQuery && (
                    <button 
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                      onClick={() => setSearchQuery('')}
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              )}
              
              {/* Mobile sidebar toggle */}
              {isMobile && (
                <button 
                  onClick={toggleSidebar}
                  className="p-2 rounded-lg hover:bg-[#1a1a1a] transition-colors"
                >
                  <Menu className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}