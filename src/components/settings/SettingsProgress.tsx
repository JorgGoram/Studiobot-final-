import { motion } from 'framer-motion';
import { ChevronsRight } from 'lucide-react';

interface SettingsProgressProps {
  completionPercentage: number;
  nextItem: string;
}

export function SettingsProgress({ completionPercentage, nextItem }: SettingsProgressProps) {
  // Define color gradient based on percentage
  const getGradientColor = () => {
    if (completionPercentage < 30) return 'from-red-500 to-orange-500';
    if (completionPercentage < 70) return 'from-orange-500 to-yellow-500';
    return 'from-emerald-500 to-green-500';
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-1">
        <div className="text-sm font-medium">Setup Completion</div>
        <div className="text-sm font-medium">{completionPercentage}%</div>
      </div>
      
      <div className="w-full h-2 bg-gray-800/50 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${completionPercentage}%` }}
          transition={{ duration: 1 }}
          className={`h-full bg-gradient-to-r ${getGradientColor()}`}
        />
      </div>
      
      <div className="flex items-center justify-between text-sm text-gray-400">
        <div>
          {completionPercentage < 100 ? 'Next step:' : 'All done!'}
        </div>
        {completionPercentage < 100 && (
          <div className="flex items-center text-[#904af2]">
            <span>{nextItem}</span>
            <ChevronsRight className="w-4 h-4 ml-1" />
          </div>
        )}
      </div>
    </div>
  );
}