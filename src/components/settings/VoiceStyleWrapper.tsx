import { Suspense, lazy } from 'react';
import { Loader } from 'lucide-react';

// Lazy load the settings page
const SettingsVoiceStylePage = lazy(() => import('./SettingsVoiceStylePage').then(module => ({ 
  default: module.SettingsVoiceStylePage 
})));

export function VoiceStyleWrapper() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <SettingsVoiceStylePage />
    </Suspense>
  );
}

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <Loader className="w-10 h-10 text-[#904af2] animate-spin mx-auto mb-4" />
        <p className="text-gray-400">Loading voice settings...</p>
      </div>
    </div>
  );
}