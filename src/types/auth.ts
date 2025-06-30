
export interface AuthUser {
  id: string;
  username: string;
  password: string;
  role: 'admin' | 'user';
  visitedSpots: string[];
}

export interface AuthSession {
  user: AuthUser;
  isAuthenticated: boolean;
}
