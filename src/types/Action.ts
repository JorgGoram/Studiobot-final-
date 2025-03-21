export interface Action {
  id: number;
  created_at: string;
  action_type: 'REAL_TIME_BOOKING' | 'LIVE_TRANSFER';
  action_id: string;
  user_id: string;
}
