export type ProfileRole = "model" | "super_admin";

export type ProfileStatus = "active" | "pending" | "suspended";

export interface ProfileRecord {
  id: string;
  role: ProfileRole;
  status: ProfileStatus;
  full_name: string;
  contact_email: string;
  avatar_url?: string | null;
  created_at?: string;
  updated_at?: string;
}

export type MediaType = "photo" | "video";

export interface PortfolioMediaItem {
  id: string;
  model_id: string;
  media_url: string;
  type: MediaType;
  caption?: string;
  created_at: string;
}

export interface SkillServiceItem {
  id: string;
  model_id: string;
  title: string;
  description: string;
  rate_amount: number;
  is_active: boolean;
}

export interface ClientAccessLinkItem {
  id: string;
  model_id: string;
  unique_token: string;
  client_name: string;
  expires_at: string;
}
