'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { CategoryInsert, CategoryUpdate } from '@/types/database'

export async function getCategories() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order', { ascending: true })

  if (error) throw error
  return data
}

export async function getCategory(id: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}

export async function createCategory(category: CategoryInsert) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('categories')
    .insert(category)
    .select()
    .single()

  if (error) throw error

  revalidatePath('/categories')
  revalidatePath('/questions')
  return data
}

export async function updateCategory(id: string, category: CategoryUpdate) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('categories')
    .update(category)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error

  revalidatePath('/categories')
  revalidatePath('/questions')
  return data
}

export async function deleteCategory(id: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id)

  if (error) throw error

  revalidatePath('/categories')
  revalidatePath('/questions')
}
