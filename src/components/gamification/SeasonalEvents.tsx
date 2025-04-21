
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { Calendar, Clock, Award, Star } from 'lucide-react';

interface SeasonalEvent {
  id: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  reward_description: string;
  xp_reward: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export function SeasonalEvents() {
  const [events, setEvents] = useState<SeasonalEvent[]>([]);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    const { data, error } = await supabase
      .from('seasonal_events')
      .select('*')
      .gte('end_date', new Date().toISOString())
      .order('start_date', { ascending: true });
    
    if (error) {
      console.error('Error loading events:', error);
      return;
    }
    
    setEvents(data || []);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
    });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-400';
      case 'intermediate': return 'text-yellow-400';
      case 'advanced': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Performance Challenges</h2>
          <p className="text-sm text-gray-400 mt-1">Special events to boost your skills</p>
        </div>
      </div>

      <div className="space-y-4">
        {events.map((event) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-6 rounded-lg bg-indigo-900/20 border border-indigo-500/20 hover:bg-indigo-900/30 transition-all duration-300"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <h3 className="text-lg font-medium text-indigo-300">{event.title}</h3>
                  <span className={`text-sm ${getDifficultyColor(event.difficulty)}`}>
                    • {event.difficulty}
                  </span>
                </div>
                <p className="text-gray-400">{event.description}</p>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {formatDate(event.start_date)} - {formatDate(event.end_date)}
                  </div>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 mr-1" />
                    {event.xp_reward} XP
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-indigo-400">
                <Clock className="w-5 h-5" />
                <span>Active</span>
              </div>
            </div>
            
            <div className="mt-4 p-3 rounded bg-indigo-800/20">
              <div className="flex items-start space-x-2">
                <Award className="w-5 h-5 text-indigo-300 mt-1" />
                <div>
                  <h4 className="font-medium text-indigo-300">Reward:</h4>
                  <p className="text-sm text-indigo-200/80 mt-1">{event.reward_description}</p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
