
import React from 'react';
import { motion } from 'framer-motion';

interface Tree {
  id: number;
  height: number;
  color: string;
}

export const ForestGrowth = ({ xp = 0 }) => {
  const generateTrees = (xpAmount: number): Tree[] => {
    const treeCount = Math.min(Math.floor(xpAmount / 100), 10);
    return Array.from({ length: treeCount }, (_, i) => ({
      id: i,
      height: 40 + Math.min(xpAmount - i * 100, 100) * 0.4,
      color: `rgb(${100 + i * 10}, ${150 + i * 5}, ${100 + i * 8})`
    }));
  };

  const trees = generateTrees(xp);

  return (
    <div className="p-6 glass-panel rounded-xl">
      <h3 className="text-xl font-semibold mb-4">Your Efficiency Forest</h3>
      <div className="h-60 flex items-end justify-center gap-4">
        {trees.map((tree) => (
          <motion.div
            key={tree.id}
            initial={{ height: 0 }}
            animate={{ height: tree.height }}
            transition={{ duration: 1, type: 'spring' }}
            style={{ backgroundColor: tree.color }}
            className="w-8 rounded-t-lg"
          />
        ))}
      </div>
      <div className="mt-4 text-center text-sm text-zinc-400">
        {trees.length} trees grown • {xp} XP earned
      </div>
    </div>
  );
};
