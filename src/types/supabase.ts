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
      profiles: {
        Row: {
          id: string
          email: string | null
          full_name: string | null
          college: string | null
          graduation_year: number | null
          career_goal: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email?: string | null
          full_name?: string | null
          college?: string | null
          graduation_year?: number | null
          career_goal?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string | null
          full_name?: string | null
          college?: string | null
          graduation_year?: number | null
          career_goal?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      resumes: {
        Row: {
          id: string
          user_id: string
          file_name: string
          file_url: string | null
          content: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          file_name: string
          file_url?: string | null
          content?: string | null
          created_at?: string
        }
      }
      analyses: {
        Row: {
          id: string
          resume_id: string
          job_title: string
          ats_score: number
          breakdown: Json
          skill_gaps: Json
          recommendations: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          resume_id: string
          job_title: string
          ats_score: number
          breakdown: Json
          skill_gaps: Json
          recommendations?: Json | null
          created_at?: string
        }
      }
      courses: {
        Row: {
          id: string
          title: string
          provider: string
          duration: string | null
          cost: string | null
          rating: number | null
          skill_tags: string[] | null
          url: string | null
          created_at: string
        }
      }
      user_courses: {
        Row: {
          id: string
          user_id: string
          course_id: string
          progress: number
          status: string
          enrolled_at: string
          completed_at: string | null
        }
      }
      interview_sessions: {
        Row: {
          id: string
          user_id: string
          job_title: string
          session_type: string
          questions: Json
          answers: Json | null
          score: number | null
          feedback: string | null
          created_at: string
        }
      }
    }
  }
}
