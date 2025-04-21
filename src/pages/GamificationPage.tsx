
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';
import { Badges } from '../components/gamification/Badges';
import { SeasonalEvents } from '../components/gamification/SeasonalEvents';

interface GamificationPageProps {
  userXP?: number;
}

export function GamificationPage({ userXP = 0 }: GamificationPageProps) {
  return (
    <div className="space-y-8 p-8">
      {/* Achievement Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between p-6 glass-panel rounded-xl"
      >
        <div className="flex items-center space-x-6">
          <div className="flex items-center justify-center w-12 h-12 bg-purple-600/10 rounded-xl">
            <Trophy className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <div className="mb-2">
              <h2 className="text-lg font-medium">Progress Tracker</h2>
              <div className="w-full bg-gray-700 rounded-full h-2.5 mt-2">
                <div 
                  className="bg-purple-600 h-2.5 rounded-full" 
                  style={{ width: `${Math.min((userXP) / 10, 100)}%` }}
                />
              </div>
            </div>
            <p className="text-sm text-zinc-400">
              {userXP} XP earned - Next reward at {Math.ceil(userXP / 10) * 10} XP
            </p>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-2xl font-bold text-purple-400">{Math.floor(userXP / 100)}</span>
          <span className="text-sm text-zinc-400">Current Level</span>
        </div>
      </motion.div>

      {/* Gamification Features */}
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Performance & Achievements</h2>
            <p className="text-zinc-400">Track your progress and unlock rewards as you excel</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel p-6 rounded-xl"
          >
            <Badges userXP={userXP} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-panel p-6 rounded-xl"
          >
            <SeasonalEvents />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
