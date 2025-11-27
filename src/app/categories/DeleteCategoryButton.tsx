'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Modal } from '@/components/ui'
import { Trash2 } from 'lucide-react'
import { deleteCategory } from '@/app/actions/categories'

interface Props {
  id: string
  name: string
}

export function DeleteCategoryButton({ id, name }: Props) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await deleteCategory(id)
      setIsOpen(false)
      router.refresh()
    } catch (error) {
      console.error('Failed to delete category:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="p-1.5 rounded-lg text-warm-400 hover:text-red-500 hover:bg-red-50 transition-colors"
      >
        <Trash2 size={16} />
      </button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="确认删除"
        size="sm"
      >
        <p className="text-warm-600 mb-6">
          确定要删除分类「{name}」吗？该分类下的题目不会被删除，但会变成未分类状态。
        </p>
        <div className="flex gap-3 justify-end">
          <Button variant="secondary" onClick={() => setIsOpen(false)}>
            取消
          </Button>
          <Button variant="danger" onClick={handleDelete} loading={isDeleting}>
            确认删除
          </Button>
        </div>
      </Modal>
    </>
  )
}
