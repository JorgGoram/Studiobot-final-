import { useState } from 'react';
import { Clock, Plus } from 'lucide-react';

interface OperatingHour {
  day: string;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
}

export default function BusinessHoursSettings() {
  const [operatingHours, setOperatingHours] = useState<OperatingHour[]>([
    { day: 'Monday', isOpen: true, openTime: '09:00', closeTime: '17:00' },
    { day: 'Tuesday', isOpen: true, openTime: '09:00', closeTime: '17:00' },
    { day: 'Wednesday', isOpen: true, openTime: '09:00', closeTime: '17:00' },
    { day: 'Thursday', isOpen: true, openTime: '09:00', closeTime: '17:00' },
    { day: 'Friday', isOpen: true, openTime: '09:00', closeTime: '17:00' },
    { day: 'Saturday', isOpen: true, openTime: '10:00', closeTime: '16:00' },
    { day: 'Sunday', isOpen: false, openTime: '09:00', closeTime: '17:00' },
  ]);

  const [timezone, setTimezone] = useState('America/New_York');

  const handleOperatingHoursChange = (index: number, field: keyof OperatingHour, value: any) => {
    const newHours = [...operatingHours];
    newHours[index] = { ...newHours[index], [field]: value };
    setOperatingHours(newHours);
  };

  return (
    <div className="space-y-6 text-white">
      <div className="space-y-3">
        {operatingHours.map((hours, index) => (
          <div key={hours.day} className="flex flex-col sm:flex-row sm:items-center gap-2 p-3 bg-[#1a1a1a]/60 border border-[#1a1a1a] rounded-lg">
            <div className="w-full sm:w-28 flex justify-between sm:block">
              <span className="font-medium">{hours.day}</span>
              <div className="sm:hidden">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hours.isOpen}
                    onChange={(e) => handleOperatingHoursChange(index, 'isOpen', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#904af2]/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#904af2]"></div>
                </label>
              </div>
            </div>
            
            <div className="hidden sm:block">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={hours.isOpen}
                  onChange={(e) => handleOperatingHoursChange(index, 'isOpen', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#904af2]/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#904af2]"></div>
              </label>
            </div>

            {hours.isOpen && (
              <div className="flex items-center space-x-2 flex-1">
                <input
                  type="time"
                  value={hours.openTime}
                  onChange={(e) => handleOperatingHoursChange(index, 'openTime', e.target.value)}
                  className="bg-[#1a1a1a] border border-gray-700 text-white text-sm rounded-lg focus:ring-[#904af2] focus:border-[#904af2] p-2 flex-1 min-w-0"
                />
                <span className="text-sm text-gray-400">to</span>
                <input
                  type="time"
                  value={hours.closeTime}
                  onChange={(e) => handleOperatingHoursChange(index, 'closeTime', e.target.value)}
                  className="bg-[#1a1a1a] border border-gray-700 text-white text-sm rounded-lg focus:ring-[#904af2] focus:border-[#904af2] p-2 flex-1 min-w-0"
                />
              </div>
            )}
          </div>
        ))}
      </div>

      <div>
        <h3 className="text-base font-medium mb-2">Timezone</h3>
        <select
          value={timezone}
          onChange={(e) => setTimezone(e.target.value)}
          className="bg-[#1a1a1a] border border-gray-700 text-white text-sm rounded-lg focus:ring-[#904af2] focus:border-[#904af2] block w-full p-2.5"
        >
          <option value="America/New_York">Eastern Time (ET)</option>
          <option value="America/Chicago">Central Time (CT)</option>
          <option value="America/Denver">Mountain Time (MT)</option>
          <option value="America/Los_Angeles">Pacific Time (PT)</option>
          <option value="Europe/London">London (GMT)</option>
          <option value="Europe/Paris">Paris (CET)</option>
          <option value="Asia/Tokyo">Tokyo (JST)</option>
        </select>
        <p className="mt-2 text-xs text-gray-400">
          Your business hours will be displayed to clients in their local timezone.
        </p>
      </div>

      <div className="flex justify-end space-x-3">
        <button className="px-4 py-2 bg-[#904af2] text-white rounded-lg hover:bg-[#9d5ff5] transition-colors">
          Save Changes
        </button>
      </div>
    </div>
  );
}