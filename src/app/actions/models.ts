'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { ModelInsert, ModelUpdate } from '@/types/database'

export async function getModels() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('models')
    .select('*')
    .order('name', { ascending: true })

  if (error) throw error
  return data
}

export async function getModel(id: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('models')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}

export async function createModel(model: ModelInsert) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('models')
    .insert(model)
    .select()
    .single()

  if (error) throw error

  revalidatePath('/models')
  revalidatePath('/evaluate')
  return data
}

export async function updateModel(id: string, model: ModelUpdate) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('models')
    .update(model)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error

  revalidatePath('/models')
  revalidatePath('/evaluate')
  return data
}

export async function deleteModel(id: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('models')
    .delete()
    .eq('id', id)

  if (error) throw error

  revalidatePath('/models')
  revalidatePath('/evaluate')
}
