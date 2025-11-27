'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Modal, Input, Textarea } from '@/components/ui'
import { Plus, Edit } from 'lucide-react'
import { createModel, updateModel } from '@/app/actions/models'
import type { Model } from '@/types/database'

interface Props {
  model?: Model
}

export function ModelFormModal({ model }: Props) {
  const router = useRouter()
  const isEditing = !!model

  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: model?.name || '',
    provider: model?.provider || '',
    version: model?.version || '',
    api_identifier: model?.api_identifier || '',
    description: model?.description || '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      if (isEditing) {
        await updateModel(model.id, formData)
      } else {
        await createModel(formData)
      }
      setIsOpen(false)
      setFormData({
        name: '',
        provider: '',
        version: '',
        api_identifier: '',
        description: '',
      })
      router.refresh()
    } catch (error) {
      console.error('Failed to save model:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

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
          添加模型
        </Button>
      )}

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={isEditing ? '编辑模型' : '添加模型'}
        size="md"
      >
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Input
              label="模型名称"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="如：GPT-4o"
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="提供商"
                value={formData.provider}
                onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                placeholder="如：OpenAI"
              />

              <Input
                label="版本"
                value={formData.version}
                onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                placeholder="如：2024"
              />
            </div>

            <Input
              label="API 标识符"
              value={formData.api_identifier}
              onChange={(e) => setFormData({ ...formData, api_identifier: e.target.value })}
              placeholder="如：gpt-4o"
            />

            <Textarea
              label="描述（可选）"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="关于这个模型的说明..."
              rows={3}
            />
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
