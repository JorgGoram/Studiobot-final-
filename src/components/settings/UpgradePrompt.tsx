import { Crown, Zap, Shield, Star } from 'lucide-react';

interface UpgradePromptProps {
  feature: string;
  description: string;
}

export default function UpgradePrompt({ feature, description }: UpgradePromptProps) {
  // Benefits of upgrading
  const benefits = [
    { icon: <Zap className="w-4 h-4" />, text: "Unlimited features" },
    { icon: <Shield className="w-4 h-4" />, text: "Priority support" }
  ];

  return (
    <div className="mt-4 p-4 bg-gradient-to-br from-amber-500/10 to-transparent border border-amber-500/20 rounded-xl">
      <div className="flex flex-col sm:flex-row items-start gap-4">
        <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0">
          <Crown className="w-6 h-6 text-amber-400" />
        </div>
        
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-2 text-amber-300">
            Upgrade Required
          </h3>
          <p className="text-sm text-gray-300 mb-3">
            {description}
          </p>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {benefits.map((benefit, index) => (
              <div 
                key={index} 
                className="flex items-center p-2 bg-black/30 rounded-lg"
              >
                <div className="w-5 h-5 rounded-full bg-amber-500/10 flex items-center justify-center mr-2">
                  {benefit.icon}
                </div>
                <span className="text-xs">{benefit.text}</span>
              </div>
            ))}
          </div>
          
          <button className="w-full px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-400 transition-colors text-sm font-medium">
            Upgrade Now
          </button>
        </div>
      </div>
    </div>
  );
}