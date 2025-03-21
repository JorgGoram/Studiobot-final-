import { ReactNode, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface InlineHelpCardProps {
  title: string;
  icon: ReactNode;
  tips: string[];
}

export default function InlineHelpCard({ title, icon, tips }: InlineHelpCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <div className="bg-zinc-900/50 rounded-xl overflow-hidden border border-slate-700/20">
      <div 
        className="p-3 flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center">
          <div className="mr-2 text-[#904af2]">
            {icon}
          </div>
          <h3 className="font-medium text-sm">{title}</h3>
        </div>
        <button className="text-gray-400 hover:text-white transition-colors">
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="p-3 pt-0 text-sm">
              <ul className="space-y-2 text-gray-300">
                {tips.map((tip, index) => (
                  <li key={index} className="flex items-start">
                    <div className="w-5 h-5 mr-2 rounded-full bg-[#904af2]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs text-[#904af2] font-semibold">{index + 1}</span>
                    </div>
                    <span className="text-sm">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}