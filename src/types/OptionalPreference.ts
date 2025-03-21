import { OperatingHours } from './FormData';
import { ExtractedData } from './TattoShopInfo';
export interface FAQ {
  question: string;
  answer: string;
}
export interface TrainingFile {
  id: string;
  name: string;
  size: number;
  type: string;
  progress: number;
  status: 'uploading' | 'complete' | 'error';
  content?: string;
}
export interface OptionalPreferenceType {
  id: number;
  user_id: string;
  created_at: string;
  appointment_type: 'appointments' | 'walkins' | 'both';
  operating_hours: OperatingHours[]; // JSON type
  piercing_service: boolean;
  hourly_rate: number;
  specific_instructions: string;
  faq?: FAQ[];
  scraping_data?: ExtractedData;
  training_data?: TrainingFile[];
}

export type OptionalPreferenceInput = Omit<
  OptionalPreferenceType,
  'id' | 'user_id' | 'created_at'
>;
