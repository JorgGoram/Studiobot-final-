import {
  LayoutDashboard,
  Activity,
  History,
  Settings,
  HelpCircle,
  CreditCard,
  Trophy
} from 'lucide-react';

export const NAVIGATION_ITEMS = [
  {
    id: 'dashboard',
    label: 'Home',
    icon: LayoutDashboard
  },
  {
    id: 'gamification',
    label: 'Rewards',
    icon: Trophy
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: Activity
  },
  {
    id: 'history',
    label: 'Call History',
    icon: History
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings
  },
  {
    id: 'help',
    label: 'Help Center',
    icon: HelpCircle
  }
] as const;

export const ADDITIONAL_ITEMS = [
  {
    id: 'subscribe',
    label: 'Subscribe',
    icon: CreditCard
  }
] as const;

export type NavigationSection = typeof NAVIGATION_ITEMS[number]['id'];