export interface SocialMedia {
  platform: string;
  url: string;
}

export interface OperatingHours {
  day: string;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
}

export interface FormData {
  // Business Info
  socialMedia: SocialMedia[];
  appointmentType: 'appointments' | 'walkins' | 'both';
  operatingHours: OperatingHours[];
  piercingServices: boolean;
  hourlyRate: string;
  timezone: string;
  ownerName: string;
  shopName: string;
  website: string;
  phoneNumber: string;
  // AI Configuration
  assistantName: string;
  welcomeMessage: string;
  specificInstructions: string;
  language: 'en-GB' | 'en-US' | 'de' | 'es' | 'it' | 'fr';
  dailyCallLimit: number;
  callHandling: 'inbound' | 'outbound';
  automaticReminders: boolean;
  waitlistManagement: boolean;
}

export interface FormStepProps {
  formData: FormData;
  errors: Partial<FormData>;
  setFormData: (data: FormData) => void;
}

export interface ErrorMessageProps {
  message?: string;
}
