export interface Estate {
  id: number;
  title: string;
  description: string;
  price: number;
  location: string;
  user_id: number;
  created_at: string;
  updated_at: string;
}

export interface PropertyInspection {
  id: number;
  estate_id: number | null;
  user_id: number;
  status: string;
  who: string;
  config: string | null;
  date: string;
  comments: string | null;
  created_at: string;
  updated_at: string;
  estate?: Estate;
} 