
import React from 'react';
import { Calendar, Sun, Snowflake, Leaf } from 'lucide-react';

interface SeasonalEvent {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  startDate: Date;
  endDate: Date;
  reward: string;
}

export const SeasonalEvents = () => {
  const currentDate = new Date();
  
  const events: SeasonalEvent[] = [
    {
      id: 'summer_sprint',
      name: 'Summer Sprint',
      description: 'Handle 50% more calls than your daily average',
      icon: <Sun className="w-6 h-6" />,
      startDate: new Date(currentDate.getFullYear(), 5, 1),
      endDate: new Date(currentDate.getFullYear(), 7, 31),
      reward: 'Summer Sprint Champion Badge + 500 XP'
    },
    {
      id: 'winter_warmup',
      name: 'Winter Warm-Up',
      description: 'Maintain a 90% customer satisfaction rate',
      icon: <Snowflake className="w-6 h-6" />,
      startDate: new Date(currentDate.getFullYear(), 11, 1),
      endDate: new Date(currentDate.getFullYear(), 11, 31),
      reward: 'Winter Master Badge + Premium Feature Access'
    }
  ];

  const activeEvents = events.filter(
    event => currentDate >= event.startDate && currentDate <= event.endDate
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Seasonal Events</h3>
        <Calendar className="w-5 h-5 text-purple-400" />
      </div>
      <div className="space-y-4">
        {activeEvents.length > 0 ? (
          activeEvents.map(event => (
            <div
              key={event.id}
              className="p-4 glass-panel rounded-xl border border-purple-500/20"
            >
              <div className="flex items-start space-x-4">
                <div className="p-2 bg-purple-600/20 rounded-lg text-purple-400">
                  {event.icon}
                </div>
                <div>
                  <h4 className="font-medium">{event.name}</h4>
                  <p className="text-sm text-zinc-400 mb-2">{event.description}</p>
                  <div className="text-xs text-purple-400">
                    Reward: {event.reward}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-zinc-400 py-4">
            No active seasonal events at the moment
          </div>
        )}
      </div>
    </div>
  );
};
