export interface Estate {
  id: number
  user_id: number
  title: string
  description: string
  price: number
  location: string
  created_at: string
  updated_at: string
}

export interface PropertyInspection {
  id: number
  estate_id: number
  user_id: number
  date: string
  status: 'Approved' | 'Pending' | 'Rejected'
  comments: string
  created_at: string
  updated_at: string
}
