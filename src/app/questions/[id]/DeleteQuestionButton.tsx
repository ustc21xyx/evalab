'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Modal } from '@/components/ui'
import { Trash2 } from 'lucide-react'
import { deleteQuestion } from '@/app/actions/questions'

interface Props {
  id: string
}

export function DeleteQuestionButton({ id }: Props) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await deleteQuestion(id)
      router.push('/questions')
    } catch (error) {
      console.error('Failed to delete question:', error)
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
          确定要删除这道题目吗？相关的评测记录也会被删除，此操作不可撤销。
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
