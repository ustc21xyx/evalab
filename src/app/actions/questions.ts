'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { QuestionInsert, QuestionUpdate } from '@/types/database'

export async function getQuestions() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('questions')
    .select(`
      *,
      categories (
        id,
        name,
        color
      )
    `)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function getQuestion(id: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('questions')
    .select(`
      *,
      categories (
        id,
        name,
        color
      )
    `)
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}

export async function createQuestion(question: QuestionInsert) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('questions')
    .insert(question)
    .select()
    .single()

  if (error) throw error

  revalidatePath('/questions')
  return data
}

export async function updateQuestion(id: string, question: QuestionUpdate) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('questions')
    .update(question)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error

  revalidatePath('/questions')
  revalidatePath(`/questions/${id}`)
  return data
}

export async function deleteQuestion(id: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('questions')
    .delete()
    .eq('id', id)

  if (error) throw error

  revalidatePath('/questions')
}

export async function importQuestions(questions: QuestionInsert[]) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('questions')
    .insert(questions)
    .select()

  if (error) throw error

  revalidatePath('/questions')
  return data
}
