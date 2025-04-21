
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { motion } from 'framer-motion';
import { Trophy, Star, Shield, Award, Zap } from 'lucide-react';

interface Badge {
  id: string;
  name: string;
  description: string;
  type: 'achievement' | 'milestone' | 'special';
  xp_required: number;
  icon_name: string;
}

export function Badges({ userXP }: { userXP: number }) {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [unlockedBadges, setUnlockedBadges] = useState<string[]>([]);

  useEffect(() => {
    loadBadges();
    checkUnlockedBadges();
  }, [userXP]);

  const loadBadges = async () => {
    const { data, error } = await supabase
      .from('badges')
      .select('*')
      .order('xp_required', { ascending: true });
    
    if (error) {
      console.error('Error loading badges:', error);
      return;
    }
    
    setBadges(data || []);
  };

  const checkUnlockedBadges = async () => {
    const unlocked = badges.filter(badge => userXP >= badge.xp_required).map(b => b.id);
    setUnlockedBadges(unlocked);
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'trophy': return <Trophy className="w-6 h-6" />;
      case 'star': return <Star className="w-6 h-6" />;
      case 'shield': return <Shield className="w-6 h-6" />;
      case 'zap': return <Zap className="w-6 h-6" />;
      default: return <Award className="w-6 h-6" />;
    }
  };

  const getBadgeColor = (type: string) => {
    switch (type) {
      case 'achievement': return 'purple';
      case 'milestone': return 'blue';
      case 'special': return 'amber';
      default: return 'gray';
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Professional Milestones</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {badges.map((badge) => {
          const color = getBadgeColor(badge.type);
          const isUnlocked = unlockedBadges.includes(badge.id);
          
          return (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-lg transition-all duration-300 ${
                isUnlocked
                  ? `bg-${color}-600/20 hover:bg-${color}-600/30`
                  : 'bg-gray-800/50 hover:bg-gray-800/60'
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg ${
                  isUnlocked
                    ? `bg-${color}-500/20 text-${color}-300`
                    : 'bg-gray-700/20 text-gray-500'
                }`}>
                  {getIcon(badge.icon_name)}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{badge.name}</h3>
                  <p className="text-sm opacity-75 mt-1">{badge.description}</p>
                  <div className="mt-3">
                    <div className="w-full h-1.5 bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${isUnlocked ? `bg-${color}-500` : `bg-${color}-800`}`}
                        style={{ width: `${Math.min((userXP / badge.xp_required) * 100, 100)}%` }}
                      />
                    </div>
                    <p className="text-xs mt-1 text-gray-400">
                      {isUnlocked ? 'Achieved!' : `${userXP}/${badge.xp_required} XP`}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
