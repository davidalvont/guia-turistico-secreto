
export interface Category {
  id: string;
  name: string;
  icon: string;
  created_at?: string;
  updated_at?: string;
}

export interface TouristSpot {
  id: string;
  title: string;
  category_id: string;
  description: string;
  rating: number;
  image: string;
  google_maps_link?: string;
  social_media_link?: string;
  whatsapp_link?: string;
  site_link?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Profile {
  id: string;
  username: string;
  role: 'admin' | 'user';
  created_at?: string;
  updated_at?: string;
}

export interface VisitedSpot {
  id: string;
  user_id: string;
  spot_id: string;
  visited_at: string;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  youtube_link: string;
  created_at?: string;
  updated_at?: string;
}

// Legacy interface for backward compatibility
export interface User {
  id: string;
  username: string;
  password: string;
  role: 'admin' | 'user';
  visitedSpots: string[];
}
