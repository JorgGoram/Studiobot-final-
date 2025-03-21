import { useState } from 'react';
import { Calendar } from 'lucide-react';
import { PasswordProtection } from './PasswordProtection';
import type { FormData } from '../../types/FormData';
import { connectGoogleCalendar } from '../../lib/calendar';
import { connectSquareCalendar } from '../../lib/squareCalendar';
import { attachAction, createSynthflowAction } from '../../lib/synthflow';
import { getSession, supabase } from '../../lib/supabase';

interface CalendarSettingsProps {
  formData: FormData;
  onChange: (field: keyof FormData, value: any) => void;
}

export function CalendarSettings({ formData, onChange }: CalendarSettingsProps) {
  const [isUnlocked, setIsUnlocked] = useState(false);

  const handleCalendarConnect = async (type: string) => {
    if (!isUnlocked) return;

    if (type === 'google') {
      try {
        console.log('Connecting to Google Calendar...');
        await connectGoogleCalendar();
        onChange('calendarIntegration', 'google');
        console.log('Google Calendar connected successfully');
        const accessToken = localStorage.getItem('googleAccessToken');
        if (accessToken) {
          const res = await createSynthflowAction(accessToken);
          const session = await getSession();
          const { data, error } = await supabase
            .from('profiles')
            .select('model_id')
            .eq('user_id', session?.user?.id)
            .single();
          const attachActionResult = await attachAction(data.model_id, [
            res?.response?.action_id,
          ]);
          return attachActionResult;
        }
      } catch (error) {
        console.error('Failed to connect Google Calendar:', error);
      }
    } else if (type === 'square') {
      try {
        console.log('Connecting to Square Calendar...');
        await connectSquareCalendar();
        onChange('calendarIntegration', 'square');
        console.log('Square Calendar connected successfully');
      } catch (error) {
        console.error('Failed to connect Square Calendar:', error);
      }
    }
  };

  if (!isUnlocked) {
    return (
      <div className="w-full flex justify-center">
        <div className="w-full max-w-3xl">
          <div className="bg-zinc-900/80 backdrop-blur-sm rounded-xl p-6 border border-zinc-800/80">
            <PasswordProtection
              title="Calendar Integration"
              description="Connect your calendar to automatically manage appointments and availability."
              onUnlock={() => setIsUnlocked(true)}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-3xl">
        <div className="bg-zinc-900/80 backdrop-blur-sm rounded-xl p-6 border border-zinc-800/80">
          <h2 className="text-xl font-semibold mb-6 flex items-center justify-center">
            <Calendar className="w-5 h-5 mr-2 text-[#904AF2]" />
            Calendar Integration
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { value: 'google', label: 'Google Calendar' },
              { value: 'square', label: 'Square Calendar' },
              { value: 'apple', label: 'Apple Calendar' },
            ].map((calendar) => (
              <button
                key={calendar.value}
                type="button"
                onClick={() => handleCalendarConnect(calendar.value)}
                className={`p-4 rounded-lg border transition-all flex flex-col items-center justify-center gap-2 ${
                  formData.calendarIntegration === calendar.value
                    ? 'border-purple-600 bg-purple-600/10 text-white'
                    : 'border-zinc-800/80 text-zinc-400 hover:border-purple-600/50 hover:text-white'
                }`}
              >
                <span className="text-sm">{calendar.label}</span>
                {formData.calendarIntegration === calendar.value && (
                  <span className="text-xs text-green-400">Connected</span>
                )}
              </button>
            ))}
          </div>
          <p className="text-xs text-zinc-400 mt-4 text-center">
            Connect your calendar to automatically manage appointments and
            availability.
          </p>
        </div>
      </div>
    </div>
  );
}