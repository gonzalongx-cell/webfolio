export type ProfileRole = "model" | "super_admin";

export type ProfileStatus = "active" | "pending" | "suspended";

export interface ProfileRecord {
  id: string;
  role: ProfileRole;
  status: ProfileStatus;
  full_name: string;
  contact_email: string;
  created_at?: string;
  updated_at?: string;
}
