export type UserRole = "founder" | "talent" | "investor";

export interface User {
  id: number;
  email: string;
  full_name: string;
  role: UserRole;
  avatar_url?: string;
  bio?: string;
  location?: string;
  profile_completeness: number;
}

export interface Startup {
  id: number;
  founder_id: number;
  name: string;
  tagline?: string;
  description?: string;
  industry: string;
  stage: string;
  funding_ask?: number;
  funding_currency: string;
  traction_summary?: string;
  team_size: number;
  website?: string;
  team_gaps?: TeamGap[];
}

export interface TeamGap {
  role: string;
  importance: string;
  reason: string;
}

export interface TalentRequirement {
  id: number;
  startup_id: number;
  title: string;
  description?: string;
  required_skills: string[];
  nice_to_have_skills: string[];
  engagement_type: string;
  compensation_min?: number;
  compensation_max?: number;
  compensation_currency: string;
  is_active: number;
}

export interface Skill {
  id: number;
  name: string;
  proficiency: string;
  years_experience: number;
}

export interface TalentProfile {
  id: number;
  user_id: number;
  institution?: string;
  degree?: string;
  graduation_year?: number;
  engagement_preference: string;
  expected_compensation_min?: number;
  expected_compensation_max?: number;
  portfolio_url?: string;
  github_url?: string;
  linkedin_url?: string;
  looking_for_cofounder: boolean;
  skills: Skill[];
}

export interface InvestorProfile {
  id: number;
  user_id: number;
  investor_type: string;
  investment_thesis?: string;
  preferred_sectors: string[];
  preferred_stages: string[];
  check_size_min?: number;
  check_size_max?: number;
  check_size_currency: string;
  is_diaspora: boolean;
  country: string;
}

export interface MatchResult {
  id: number;
  source_user_id: number;
  target_user_id: number;
  match_type: string;
  overall_score: number;
  skill_overlap_score?: number;
  semantic_score?: number;
  matched_skills: string[];
  missing_skills: string[];
  requirement_id?: number;
  target_name?: string;
  target_role?: string;
  startup_name?: string;
}

export interface ConnectionRequest {
  id: number;
  from_user_id: number;
  to_user_id: number;
  match_id?: number;
  message?: string;
  status: string;
  from_name?: string;
  to_name?: string;
}

export interface PitchFeedback {
  overall_score: number;
  market_size: { score: number; feedback: string };
  traction: { score: number; feedback: string };
  team: { score: number; feedback: string };
  defensibility: { score: number; feedback: string };
  summary: string;
  suggestions: string[];
}
