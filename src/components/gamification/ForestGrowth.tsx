
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { Leaf, Tree } from 'lucide-react';

interface Tree {
  id: string;
  growth_stage: number;
  xp_threshold: number;
  name: string;
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
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Professional Growth Forest</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {trees.map((tree) => (
          <motion.div
            key={tree.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative"
          >
            <div className="p-4 rounded-lg bg-gradient-to-b from-green-900/20 to-green-600/10">
              <div className="flex flex-col items-center">
                {calculateGrowth(tree.xp_threshold) >= 100 ? (
                  <Tree className="w-12 h-12 text-green-400" />
                ) : (
                  <Leaf className="w-12 h-12 text-green-600/60" />
                )}
                <h3 className="mt-2 font-medium text-center">{tree.name}</h3>
                <div className="w-full h-2 bg-gray-700 rounded-full mt-3">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${calculateGrowth(tree.xp_threshold)}%` }}
                    className="h-full bg-green-500 rounded-full"
                  />
                </div>
                <p className="mt-2 text-sm text-gray-400">
                  {calculateGrowth(tree.xp_threshold)}% Growth
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
