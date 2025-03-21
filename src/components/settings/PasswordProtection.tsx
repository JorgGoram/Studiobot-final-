import { useState } from 'react';
import { Lock, Unlock, Eye, EyeOff } from 'lucide-react';

interface PasswordProtectionProps {
  title: string;
  description?: string;
  onUnlock: () => void;
}

export function PasswordProtection({ title, description, onUnlock }: PasswordProtectionProps) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleUnlock = () => {
    if (password === '1234567') {
      setError('');
      onUnlock();
    } else {
      setError('Incorrect password');
    }
  };

  return (
    <div className="text-center space-y-6">
      <div className="inline-flex items-center justify-center p-3 rounded-full bg-amber-500/10 mb-4">
        <Lock className="w-6 h-6 text-amber-400" />
      </div>
      
      <h2 className="text-xl font-semibold">
        {title} <span className="text-amber-400">(PRO)</span>
      </h2>
      
      {description && (
        <p className="text-zinc-400 max-w-md mx-auto mb-8">
          {description}
        </p>
      )}

      <div className="max-w-sm mx-auto space-y-4">
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-black/50 border border-zinc-800 rounded-lg pl-4 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-[#904AF2]"
            placeholder="Enter password"
          />
          <button
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        </div>

        {error && (
          <p className="text-red-400 text-sm">{error}</p>
        )}

        <button
          onClick={handleUnlock}
          className="w-full px-6 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-400 transition-colors flex items-center justify-center gap-2"
        >
          <Unlock className="w-4 h-4" />
          Unlock Features
        </button>
      </div>
    </div>
  );
}