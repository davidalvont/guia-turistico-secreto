
export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface TouristSpot {
  id: string;
  title: string;
  categoryId: string;
  description: string;
  rating: number;
  image: string;
  googleMapsLink?: string;
  socialMediaLink?: string;
  whatsappLink?: string;
}

export interface User {
  id: string;
  username: string;
  password: string;
  role: 'admin' | 'user';
  visitedSpots: string[];
}
