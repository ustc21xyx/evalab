'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Modal, Input, Textarea } from '@/components/ui'
import { Plus, Edit } from 'lucide-react'
import { createCategory, updateCategory } from '@/app/actions/categories'
import type { Category } from '@/types/database'

interface Props {
  category?: Category
}

export function CategoryFormModal({ category }: Props) {
  const router = useRouter()
  const isEditing = !!category

  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: category?.name || '',
    description: category?.description || '',
    color: category?.color || '#8B7355',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      if (isEditing) {
        await updateCategory(category.id, formData)
      } else {
        await createCategory(formData)
      }
      setIsOpen(false)
      router.refresh()
    } catch (error) {
      console.error('Failed to save category:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const colors = [
    '#8B7355', '#6B8E6B', '#B8860B', '#708090', '#CD853F',
    '#8FBC8F', '#DEB887', '#BC8F8F', '#9370DB', '#20B2AA',
  ]

  return (
    <>
      {isEditing ? (
        <button
          onClick={() => setIsOpen(true)}
          className="p-1.5 rounded-lg text-warm-400 hover:text-warm-600 hover:bg-cream-100 transition-colors"
        >
          <Edit size={16} />
        </button>
      ) : (
        <Button onClick={() => setIsOpen(true)}>
          <Plus size={18} />
          添加分类
        </Button>
      )}

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={isEditing ? '编辑分类' : '添加分类'}
        size="sm"
      >
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Input
              label="分类名称"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="如：逻辑推理"
              required
            />

            <Textarea
              label="描述（可选）"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="这个分类包含什么类型的题目..."
              rows={3}
            />

            <div>
              <label className="block text-sm font-medium text-warm-600 mb-2">
                颜色
              </label>
              <div className="flex flex-wrap gap-2">
                {colors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setFormData({ ...formData, color })}
                    className={`w-8 h-8 rounded-lg transition-all ${
                      formData.color === color
                        ? 'ring-2 ring-offset-2 ring-warm-500'
                        : 'hover:scale-110'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-3 justify-end mt-6 pt-4 border-t border-warm-100">
            <Button type="button" variant="secondary" onClick={() => setIsOpen(false)}>
              取消
            </Button>
            <Button type="submit" loading={isSubmitting}>
              {isEditing ? '保存' : '创建'}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  )
}
