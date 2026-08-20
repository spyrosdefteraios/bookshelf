export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  genre?: string;
  description?: string;
  pages?: number;
  year?: number;
  status: 'reading' | 'read' | 'wishlist';
  rating?: number;
  userId: string;
  createdAt: string;
}

export interface Review {
  id: string;
  bookId: string;
  userId: string;
  text: string;
  rating: number;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface BookStats {
  total: number;
  reading: number;
  read: number;
  wishlist: number;
  avgRating: number;
}

export interface ApiResponse<T> {
  status: string;
  data: T;
}