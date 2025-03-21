import { lazy, Suspense } from 'react';
import { motion } from 'framer-motion';

// Lazy load the SettingsLayout component
const SettingsLayout = lazy(() => import('../components/settings/SettingsLayout'));

export default function SettingsPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <SettingsLayout />
    </Suspense>
  );
}

// Loading fallback component
function LoadingFallback() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center"
      >
        <div className="w-16 h-16 border-t-2 border-b-2 border-[#904af2] rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-lg font-medium">Loading settings...</p>
        <p className="text-sm text-zinc-400 mt-2">This may take a moment</p>
      </motion.div>
    </div>
  );
}