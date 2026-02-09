export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string
          title: string
          location: string
          area: string
          category: string
          image_url: string
          images: string[]
          video_url: string | null
          description: string | null
          published: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          location: string
          area: string
          category: string
          image_url: string
          images?: string[]
          video_url?: string | null
          description?: string | null
          published?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          location?: string
          area?: string
          category?: string
          image_url?: string
          images?: string[]
          video_url?: string | null
          description?: string | null
          published?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          id: string
          name: string
          email: string
          rating: number
          comment: string
          location: string | null
          approved: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          rating: number
          comment: string
          location?: string | null
          approved?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          rating?: number
          comment?: string
          location?: string | null
          approved?: boolean
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Convenience type for projects
export type Project = Database['public']['Tables']['projects']['Row'];
export type ProjectInsert = Database['public']['Tables']['projects']['Insert'];
export type ProjectUpdate = Database['public']['Tables']['projects']['Update'];

// Convenience type for reviews
export type Review = Database['public']['Tables']['reviews']['Row'];
export type ReviewInsert = Database['public']['Tables']['reviews']['Insert'];
export type ReviewUpdate = Database['public']['Tables']['reviews']['Update'];
