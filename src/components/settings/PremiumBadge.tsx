import { Diamond } from 'lucide-react';

interface PremiumBadgeProps {
  small?: boolean;
}

export function PremiumBadge({ small = false }: PremiumBadgeProps) {
  if (small) {
    return (
      <div className="inline-flex items-center bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded-full text-xs">
        <Diamond className="w-3 h-3 mr-0.5" />
        <span className="text-[10px] font-medium">PRO</span>
      </div>
    );
  }
  
  return (
    <div className="inline-flex items-center bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-xs font-medium">
      <Diamond className="w-3.5 h-3.5 mr-1" />
      <span>PRO</span>
    </div>
  );
}