'use server'

import { createClient } from '@/lib/supabase/server'

export async function getModelStatistics() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('model_statistics')
    .select('*')
    .order('avg_score', { ascending: false, nullsFirst: false })

  if (error) throw error
  return data
}

export async function getCategoryStatistics() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('category_statistics')
    .select('*')

  if (error) throw error
  return data
}

export async function getDashboardStats() {
  const supabase = await createClient()

  const [questionsResult, modelsResult, evaluationsResult] = await Promise.all([
    supabase.from('questions').select('id', { count: 'exact', head: true }),
    supabase.from('models').select('id', { count: 'exact', head: true }),
    supabase.from('evaluations').select('id', { count: 'exact', head: true }),
  ])

  return {
    questionsCount: questionsResult.count || 0,
    modelsCount: modelsResult.count || 0,
    evaluationsCount: evaluationsResult.count || 0,
  }
}

export async function getComparisonData(questionIds: string[], modelIds: string[]) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('evaluations')
    .select(`
      id,
      total_score,
      question_id,
      model_id,
      questions (
        id,
        title
      ),
      models (
        id,
        name
      )
    `)
    .in('question_id', questionIds)
    .in('model_id', modelIds)

  if (error) throw error
  return data
}
