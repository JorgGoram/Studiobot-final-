
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { Leaf, Tree, Sun, Cloud } from 'lucide-react';

interface Tree {
  id: string;
  growth_stage: number;
  xp_threshold: number;
  name: string;
  description: string;
}

export function ForestGrowth({ xp }: { xp: number }) {
  const [trees, setTrees] = useState<Tree[]>([]);

  useEffect(() => {
    loadTrees();
  }, [xp]);

  const loadTrees = async () => {
    const { data, error } = await supabase
      .from('forest_trees')
      .select('*')
      .order('xp_threshold', { ascending: true });
    
    if (error) {
      console.error('Error loading forest:', error);
      return;
    }
    
    setTrees(data || []);
  };

  const calculateGrowth = (threshold: number) => {
    return Math.min(100, (xp / threshold) * 100);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Growth Garden</h2>
          <p className="text-sm text-gray-400 mt-1">Watch your progress bloom</p>
        </div>
        <div className="flex items-center space-x-2">
          <Sun className="w-5 h-5 text-amber-400" />
          <Cloud className="w-5 h-5 text-blue-400/60" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {trees.map((tree) => {
          const growthPercent = calculateGrowth(tree.xp_threshold);
          const isFullyGrown = growthPercent >= 100;
          
          return (
            <motion.div
              key={tree.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative"
            >
              <div className="p-4 rounded-lg bg-gradient-to-b from-green-900/20 to-green-600/10 hover:from-green-900/30 hover:to-green-600/20 transition-all duration-300">
                <div className="flex flex-col items-center">
                  <div className="relative h-24 w-24 flex items-center justify-center">
                    {isFullyGrown ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="text-green-400"
                      >
                        <Tree className="w-16 h-16" />
                      </motion.div>
                    ) : (
                      <motion.div
                        animate={{ 
                          scale: [1, 1.1, 1],
                          rotate: [0, 5, -5, 0]
                        }}
                        transition={{ 
                          duration: 4,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                        className="text-green-600/60"
                      >
                        <Leaf className="w-12 h-12" />
                      </motion.div>
                    )}
                  </div>
                  
                  <h3 className="mt-2 font-medium text-center">{tree.name}</h3>
                  <p className="text-sm text-gray-400 text-center mt-1">{tree.description}</p>
                  
                  <div className="w-full h-2 bg-gray-700/50 rounded-full mt-4 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${growthPercent}%` }}
                      className="h-full bg-green-500 rounded-full"
                      transition={{ duration: 1, ease: "easeOut" }}
                    />
                  </div>
                  
                  <p className="mt-2 text-sm text-gray-400">
                    {growthPercent.toFixed(0)}% Growth
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
