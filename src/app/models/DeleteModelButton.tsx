'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Modal } from '@/components/ui'
import { Trash2 } from 'lucide-react'
import { deleteModel } from '@/app/actions/models'

interface Props {
  id: string
  name: string
}

export function DeleteModelButton({ id, name }: Props) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await deleteModel(id)
      setIsOpen(false)
      router.refresh()
    } catch (error) {
      console.error('Failed to delete model:', error)
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
          确定要删除模型「{name}」吗？相关的评测记录也会被删除，此操作不可撤销。
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
