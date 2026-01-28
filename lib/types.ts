// 共通型定義

export interface Company {
  id?: string;
  name: string;
  industry?: string;
  website?: string;
  logo_url?: string;
  description?: string;
  locations?: string[];
  created_at?: number;
}

export interface Deadline {
  id?: string;
  company_id?: string;
  company_name: string;
  type: "es" | "honsenkou" | "test_center" | "internship";
  deadline_date: string; // ISO 8601 format
  description?: string;
  link?: string;
  source: string;
  created_at?: number;
}

export interface TestCenter {
  id?: string;
  company_id?: string;
  company_name: string;
  type: "web" | "venue";
  location?: string;
  notes?: string;
  created_at?: number;
}

export interface XApiTweet {
  id: string;
  text: string;
  created_at: string;
  author_id: string;
}

export interface ParsedDeadline {
  company_name: string;
  type: "es" | "honsenkou" | "test_center" | "internship";
  deadline_date: string;
  description?: string;
  link?: string;
  source: string;
}

export interface ScrapeResult {
  success: boolean;
  processed: number;
  added: number;
  updated: number;
  errors: string[];
}
