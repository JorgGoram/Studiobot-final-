
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { Calendar, Clock, Award } from 'lucide-react';

interface SeasonalEvent {
  id: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  reward_description: string;
  xp_reward: number;
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

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Professional Development Events</h2>
      <div className="grid grid-cols-1 gap-4">
        {events.map((event) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-6 rounded-lg bg-indigo-900/20 border border-indigo-500/20"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <h3 className="text-lg font-medium text-indigo-300">{event.title}</h3>
                <p className="text-gray-400">{event.description}</p>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {formatDate(event.start_date)} - {formatDate(event.end_date)}
                  </div>
                  <div className="flex items-center">
                    <Award className="w-4 h-4 mr-1" />
                    {event.xp_reward} XP
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-indigo-400">
                <Clock className="w-5 h-5" />
                <span>Active</span>
              </div>
            </div>
            <div className="mt-4 p-3 rounded bg-indigo-800/20 text-indigo-300">
              <h4 className="font-medium mb-1">Reward:</h4>
              <p className="text-sm">{event.reward_description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
