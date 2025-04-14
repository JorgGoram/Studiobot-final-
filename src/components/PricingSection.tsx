import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Crown, Star, Zap } from 'lucide-react';
import { HologramButton } from './buttons/ButtonEffects';

interface PricingSectionProps {
  onStartCall: () => void;
}

export function PricingSection({ onStartCall }: PricingSectionProps) {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const plans = [
    {
      name: 'Basic',
      price: billingCycle === 'monthly' ? 49 : 470,
      description: 'Perfect for small tattoo shops',
      features: [
        'AI Voice Assistant',
        'Basic Call Handling',
        'Email Support',
        'Up to 100 Calls/Month',
        'Basic Analytics',
      ],
      highlight: false,
      icon: Zap,
    },
    {
      name: 'Professional',
      price: billingCycle === 'monthly' ? 99 : 950,
      description: 'Most popular for growing studios',
      features: [
        'Everything in Basic, plus:',
        'Advanced Call Management',
        'Priority Support',
        'Up to 500 Calls/Month',
        'Detailed Analytics',
        'Custom Voice Training',
        'Calendar Integration',
      ],
      highlight: true,
      icon: Star,
    },
    {
      name: 'Enterprise',
      price: billingCycle === 'monthly' ? 199 : 1990,
      description: 'For large tattoo businesses',
      features: [
        'Everything in Professional, plus:',
        'Unlimited Calls',
        'Multiple Voice Agents',
        'Dedicated Account Manager',
        'Custom Integration',
        'Advanced AI Training',
        'Multi-Location Support',
      ],
      highlight: false,
      icon: Crown,
    },
  ];

  return (
    <section className="py-20 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-black">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(144,74,242,0.15),transparent_70%)]" />
        <div className="absolute inset-0 bg-gradient-to-br from-black via-[#904af2]/5 to-black opacity-50" />
      </div>

      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-montserrat font-black mb-4">
            <span className="text-white">GET YOUR </span>{' '}
            <span className="gradient-text">AI ANSWERING</span>
            <span className="text-white"> TODAY</span>{' '}
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Choose the perfect plan for your studio's needs. All plans include a 14-day free trial.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center mt-8 space-x-4">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-2 rounded-lg transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-[#904af2] text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Monthly
            </button>
            <div className="relative cursor-pointer" onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}>
              <div className="w-12 h-6 bg-[#904af2]/20 rounded-full">
                <div
                  className={`absolute w-4 h-4 bg-[#904af2] rounded-full top-1 transition-all duration-300 ${
                    billingCycle === 'yearly' ? 'left-7' : 'left-1'
                  }`}
                />
              </div>
            </div>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-4 py-2 rounded-lg transition-all ${
                billingCycle === 'yearly'
                  ? 'bg-[#904af2] text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Yearly
              <span className="ml-2 text-xs bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded-full">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative rounded-2xl backdrop-blur-xl border ${
                plan.highlight
                  ? 'border-[#904af2] bg-[#904af2]/10'
                  : 'border-zinc-800/50 bg-black/40'
              } p-8 flex flex-col`}
            >
              {plan.highlight && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-[#904af2] text-white px-4 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                  <Star className="w-4 h-4" />
                  Most Popular
                </div>
              )}

              <div className="mb-8">
                <div className="w-12 h-12 rounded-lg bg-[#904af2]/10 flex items-center justify-center mb-4">
                  <plan.icon className="w-6 h-6 text-[#904af2]" />
                </div>
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="flex items-baseline mb-4">
                  <span className="text-4xl font-bold">${plan.price}</span>
                  <span className="text-gray-400 ml-2">/{billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
                </div>
                <p className="text-gray-400">{plan.description}</p>
              </div>

              <div className="flex-grow">
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                        plan.highlight ? 'bg-[#904af2]' : 'bg-purple-600/20'
                      }`}>
                        <Check className="w-3 h-3" />
                      </div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <HologramButton
                onClick={onStartCall}
                className={`w-full justify-center ${
                  plan.highlight ? '' : 'bg-transparent border border-[#904af2]'
                }`}
              >
                Start Free Trial
              </HologramButton>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 text-center text-sm text-gray-400">
          All plans include a 14-day free trial. No credit card required.
        </div>
      </div>
    </section>
  );
}
