export enum AppView {
  DASHBOARD = 'DASHBOARD',
  RESUME = 'RESUME',
  JOBS = 'JOBS',
  INTERVIEW = 'INTERVIEW',
  TRACKER = 'TRACKER',
}

export enum ApplicationStatus {
  APPLIED = 'APPLIED',
  INTERVIEWING = 'INTERVIEWING',
  OFFER = 'OFFER',
  REJECTED = 'REJECTED',
}

export interface JobApplication {
  id: string;
  company: string;
  position: string;
  status: ApplicationStatus;
  dateApplied: string;
  notes: string;
  jobDescription?: string;
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  summary: string;
  skills: string[];
  experience: ExperienceItem[];
  education: EducationItem[];
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  duration: string;
  description: string;
}

export interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  year: string;
}

export interface JobListing {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string; // Remote, Hybrid, On-site
  salary: string;
  description: string;
  requiredSkills: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
}
