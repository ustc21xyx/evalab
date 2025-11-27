'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Modal } from '@/components/ui'
import { Trash2 } from 'lucide-react'
import { deleteEvaluation } from '@/app/actions/evaluations'

interface Props {
  id: string
}

export function DeleteEvaluationButton({ id }: Props) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await deleteEvaluation(id)
      router.push('/evaluate')
    } catch (error) {
      console.error('Failed to delete evaluation:', error)
      setIsDeleting(false)
    }
  }

  return (
    <>
      <Button variant="danger" onClick={() => setIsOpen(true)}>
        <Trash2 size={18} />
        删除
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="确认删除"
        size="sm"
      >
        <p className="text-warm-600 mb-6">
          确定要删除这条评测记录吗？此操作不可撤销。
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
