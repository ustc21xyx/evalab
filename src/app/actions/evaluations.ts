'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { EvaluationInsert, EvaluationUpdate, EvaluationScoreInsert } from '@/types/database'

export async function getEvaluations() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('evaluations')
    .select(`
      *,
      questions (
        id,
        title,
        content,
        difficulty,
        categories (
          id,
          name,
          color
        )
      ),
      models (
        id,
        name,
        provider
      )
    `)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function getEvaluation(id: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('evaluations')
    .select(`
      *,
      questions (
        id,
        title,
        content,
        difficulty,
        expected_answer,
        categories (
          id,
          name,
          color
        )
      ),
      models (
        id,
        name,
        provider
      ),
      evaluation_scores (
        *,
        scoring_dimensions (
          id,
          name,
          max_score,
          weight
        )
      )
    `)
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}

export async function getEvaluationsByModel(modelId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('evaluations')
    .select(`
      *,
      questions (
        id,
        title,
        categories (
          id,
          name,
          color
        )
      )
    `)
    .eq('model_id', modelId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function getEvaluationsByQuestion(questionId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('evaluations')
    .select(`
      *,
      models (
        id,
        name,
        provider
      )
    `)
    .eq('question_id', questionId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function createEvaluation(
  evaluation: EvaluationInsert,
  scores?: { dimension_id: string; score: number; comment?: string }[]
) {
  const supabase = await createClient()

  // 插入评测记录
  const { data: evalData, error: evalError } = await supabase
    .from('evaluations')
    .insert(evaluation)
    .select()
    .single()

  if (evalError) throw evalError

  // 如果有评分维度分数，插入详细分数
  if (scores && scores.length > 0) {
    const scoreInserts: EvaluationScoreInsert[] = scores.map((s) => ({
      evaluation_id: evalData.id,
      dimension_id: s.dimension_id,
      score: s.score,
      comment: s.comment,
    }))

    const { error: scoreError } = await supabase
      .from('evaluation_scores')
      .insert(scoreInserts)

    if (scoreError) throw scoreError
  }

  revalidatePath('/evaluate')
  revalidatePath('/statistics')
  return evalData
}

export async function updateEvaluation(id: string, evaluation: EvaluationUpdate) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('evaluations')
    .update(evaluation)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error

  revalidatePath('/evaluate')
  revalidatePath('/statistics')
  revalidatePath(`/evaluate/${id}`)
  return data
}

export async function deleteEvaluation(id: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('evaluations')
    .delete()
    .eq('id', id)

  if (error) throw error

  revalidatePath('/evaluate')
  revalidatePath('/statistics')
}

export async function getScoringDimensions() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('scoring_dimensions')
    .select('*')
    .order('sort_order', { ascending: true })

  if (error) throw error
  return data
}
