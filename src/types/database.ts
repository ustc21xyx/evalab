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
      categories: {
        Row: {
          id: string
          name: string
          description: string | null
          color: string
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          color?: string
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          color?: string
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
      }
      questions: {
        Row: {
          id: string
          title: string
          content: string
          category_id: string | null
          difficulty: number
          expected_answer: string | null
          tags: string[] | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          content: string
          category_id?: string | null
          difficulty?: number
          expected_answer?: string | null
          tags?: string[] | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          content?: string
          category_id?: string | null
          difficulty?: number
          expected_answer?: string | null
          tags?: string[] | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      models: {
        Row: {
          id: string
          name: string
          provider: string | null
          version: string | null
          description: string | null
          api_identifier: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          provider?: string | null
          version?: string | null
          description?: string | null
          api_identifier?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          provider?: string | null
          version?: string | null
          description?: string | null
          api_identifier?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      scoring_dimensions: {
        Row: {
          id: string
          name: string
          description: string | null
          max_score: number
          weight: number
          is_default: boolean
          sort_order: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          max_score?: number
          weight?: number
          is_default?: boolean
          sort_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          max_score?: number
          weight?: number
          is_default?: boolean
          sort_order?: number
          created_at?: string
        }
      }
      evaluations: {
        Row: {
          id: string
          question_id: string
          model_id: string
          answer: string
          total_score: number | null
          notes: string | null
          evaluated_by: string | null
          evaluated_at: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          question_id: string
          model_id: string
          answer: string
          total_score?: number | null
          notes?: string | null
          evaluated_by?: string | null
          evaluated_at?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          question_id?: string
          model_id?: string
          answer?: string
          total_score?: number | null
          notes?: string | null
          evaluated_by?: string | null
          evaluated_at?: string
          created_at?: string
          updated_at?: string
        }
      }
      evaluation_scores: {
        Row: {
          id: string
          evaluation_id: string
          dimension_id: string
          score: number
          comment: string | null
          created_at: string
        }
        Insert: {
          id?: string
          evaluation_id: string
          dimension_id: string
          score: number
          comment?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          evaluation_id?: string
          dimension_id?: string
          score?: number
          comment?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      model_statistics: {
        Row: {
          model_id: string
          model_name: string
          provider: string | null
          total_evaluations: number
          avg_score: number | null
          min_score: number | null
          max_score: number | null
        }
      }
      category_statistics: {
        Row: {
          category_id: string
          category_name: string
          model_id: string
          model_name: string
          total_evaluations: number
          avg_score: number | null
        }
      }
      evaluation_details: {
        Row: {
          evaluation_id: string
          answer: string
          total_score: number | null
          notes: string | null
          evaluated_by: string | null
          evaluated_at: string
          question_id: string
          question_title: string
          question_content: string
          difficulty: number
          category_id: string | null
          category_name: string | null
          model_id: string
          model_name: string
          provider: string | null
        }
      }
    }
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}

// 便捷类型别名
export type Category = Database['public']['Tables']['categories']['Row']
export type CategoryInsert = Database['public']['Tables']['categories']['Insert']
export type CategoryUpdate = Database['public']['Tables']['categories']['Update']

export type Question = Database['public']['Tables']['questions']['Row']
export type QuestionInsert = Database['public']['Tables']['questions']['Insert']
export type QuestionUpdate = Database['public']['Tables']['questions']['Update']

export type Model = Database['public']['Tables']['models']['Row']
export type ModelInsert = Database['public']['Tables']['models']['Insert']
export type ModelUpdate = Database['public']['Tables']['models']['Update']

export type ScoringDimension = Database['public']['Tables']['scoring_dimensions']['Row']
export type ScoringDimensionInsert = Database['public']['Tables']['scoring_dimensions']['Insert']
export type ScoringDimensionUpdate = Database['public']['Tables']['scoring_dimensions']['Update']

export type Evaluation = Database['public']['Tables']['evaluations']['Row']
export type EvaluationInsert = Database['public']['Tables']['evaluations']['Insert']
export type EvaluationUpdate = Database['public']['Tables']['evaluations']['Update']

export type EvaluationScore = Database['public']['Tables']['evaluation_scores']['Row']
export type EvaluationScoreInsert = Database['public']['Tables']['evaluation_scores']['Insert']
export type EvaluationScoreUpdate = Database['public']['Tables']['evaluation_scores']['Update']

// 视图类型
export type ModelStatistics = Database['public']['Views']['model_statistics']['Row']
export type CategoryStatistics = Database['public']['Views']['category_statistics']['Row']
export type EvaluationDetail = Database['public']['Views']['evaluation_details']['Row']

// 带关联数据的类型
export type QuestionWithCategory = Question & {
  categories: Category | null
}

export type EvaluationWithRelations = Evaluation & {
  questions: Question
  models: Model
  evaluation_scores: (EvaluationScore & {
    scoring_dimensions: ScoringDimension
  })[]
}
