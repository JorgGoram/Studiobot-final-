
import React from 'react';
import { Shield, Star, Award, Crown } from 'lucide-react';

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  unlocked: boolean;
}

export const Badges = ({ userXP = 0 }) => {
  const badges: Badge[] = [
    {
      id: 'efficiency_initiate',
      name: 'Efficiency Initiate',
      description: 'Complete your first 25 calls',
      icon: <Shield className="w-6 h-6" />,
      unlocked: userXP >= 250
    },
    {
      id: 'no_show_ninja',
      name: 'No-Show Ninja',
      description: 'Reduce 20 no-shows in a month',
      icon: <Star className="w-6 h-6" />,
      unlocked: userXP >= 500
    },
    {
      id: 'seasonal_master',
      name: 'Season Master',
      description: 'Complete a seasonal event',
      icon: <Award className="w-6 h-6" />,
      unlocked: userXP >= 1000
    }
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold mb-4">Achievement Badges</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {badges.map((badge) => (
          <div
            key={badge.id}
            className={`p-4 rounded-xl ${
              badge.unlocked
                ? 'bg-purple-600/20 border-purple-500/30'
                : 'bg-gray-800/20 border-gray-700/30'
            } border transition-all hover:scale-105`}
          >
            <div className="flex items-center space-x-3">
              <div
                className={`${
                  badge.unlocked ? 'text-purple-400' : 'text-gray-500'
                }`}
              >
                {badge.icon}
              </div>
              <div>
                <h4 className="font-medium">{badge.name}</h4>
                <p className="text-sm text-zinc-400">{badge.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
