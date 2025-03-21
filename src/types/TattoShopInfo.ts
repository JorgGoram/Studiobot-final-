export interface ExtractedData {
  shop_name: string;
  owner_name: string;
  phone: string;
  email?: string;
  address?: string;
  website: string;
  languages_supported: string[];
  appointment_type: string;
  operating_hours: {
    [key: string]: string;
  };
  hourly_rate: string;
  minimum_deposit?: string;
  deposit_required: boolean;
  cancellation_policy: string;
  services: Array<{
    service_name: string;
    base_price: string;
    duration: string;
  }>;
  tattoo_styles: string[];
  piercing_services: boolean;
  aftercare_services: boolean;
  online_booking_available: boolean;
  consultation_required: boolean;
  consultation_format: string[];
  response_time: string;
  artists: Array<{
    name: string;
    specialties: string[];
    availability: string;
    experience_years: number;
    portfolio_url?: string;
    languages: string[];
  }>;
  age_requirement: string;
  id_required: boolean;
  payment_methods: string[];
  custom_design_service: boolean;
  cover_up_specialist: boolean;
  touch_up_policy: string;
  years_in_business: number;
  rating: number;
  review_count: number;
  awards_certifications: string[];
  common_faqs: Array<{
    question: string;
    answer: string;
  }>;
  busy_hours: string[];
  peak_seasons: string[];
  special_events: Array<{
    name: string;
    date: string;
    description: string;
  }>;
}
