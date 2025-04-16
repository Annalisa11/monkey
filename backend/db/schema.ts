export interface Monkey {
  monkey_id: number;
  name: string;
  location: string;
  isActive: boolean;
  address?: string;
}
export interface QRCode {
  qr_id: string;
  created_at: Date;
  created_by_monkey_id: number;
  destination_monkey_id: number;
  destination_location: string;
  scanned: boolean;
  scanned_at: Date | null;
  scanned_by_monkey_id: number | null;
  journey_completed: boolean;
}

export interface Reward {
  reward_id: number;
  qr_id: string;
  issued: boolean;
  issued_at: Date | null;
}

export interface Settings {
  setting_id: number;
  monkey_id: number;
  key: string;
  value: string;
  description: string;
}

export interface Stats {
  stat_id: number;
  date: Date;
  monkey_id: number;
  qr_scans_count: number;
  successful_navigations: number;
  rewards_issued: number;
}
