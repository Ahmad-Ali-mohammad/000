export interface User {
  id: string;
  email: string;
  token: string;
}

export type CampaignStatus = 'created' | 'active' | 'completed' | 'paused';
export type ReferenceImageType = 'logo' | 'character' | 'business' | 'expressive' | 'other';

export interface Post {
  id: string;
  day: number;
  title: string;
  content: string;
  hashtags?: string[]; 
  imagePrompt?: string;
  imageUrl?: string; // Store generated image base64
  status: 'pending' | 'published' | 'failed';
  scheduledTime?: string;
}

export interface Campaign {
  id: string;
  userId: string;
  title: string; 
  topic: string; 
  targetAudience: string; 
  postsPerDay: number;
  durationDays: number;
  state: CampaignStatus;
  createdAt: string;
  posts: Post[];
  platforms: string[]; 
  referenceImage?: string; // Base64
  referenceImageType?: ReferenceImageType;
}

export interface CreateCampaignDTO {
  title: string;
  topic: string;
  targetAudience: string;
  postsPerDay: number;
  durationDays: number;
  platforms: string[];
  referenceImage?: string;
  referenceImageType?: ReferenceImageType;
}