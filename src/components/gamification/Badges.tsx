
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { motion } from 'framer-motion';
import { Trophy, Star, Shield, Award } from 'lucide-react';

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
      default: return <Award className="w-6 h-6" />;
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Professional Achievements</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {badges.map((badge) => (
          <motion.div
            key={badge.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-lg ${
              unlockedBadges.includes(badge.id)
                ? 'bg-purple-600/20 text-purple-100'
                : 'bg-gray-800/50 text-gray-400'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${
                unlockedBadges.includes(badge.id)
                  ? 'bg-purple-500/20 text-purple-300'
                  : 'bg-gray-700/20 text-gray-500'
              }`}>
                {getIcon(badge.icon_name)}
              </div>
              <div>
                <h3 className="font-medium">{badge.name}</h3>
                <p className="text-sm opacity-75">{badge.description}</p>
              </div>
            </div>
            <div className="mt-3 text-sm">
              {unlockedBadges.includes(badge.id) 
                ? 'Achieved!'
                : `${userXP}/${badge.xp_required} XP`}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
