'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Modal } from '@/components/ui'
import { Edit } from 'lucide-react'
import { updateEvaluation } from '@/app/actions/evaluations'

interface Props {
  id: string
  currentScore: number | null
}

export function EditScoreButton({ id, currentScore }: Props) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [score, setScore] = useState(currentScore?.toString() || '')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const totalScore = score ? parseFloat(score) : null
      await updateEvaluation(id, { total_score: totalScore })
      setIsOpen(false)
      router.refresh()
    } catch (error) {
      console.error('Failed to update score:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Button variant="secondary" size="sm" onClick={() => setIsOpen(true)}>
        <Edit size={16} />
        {currentScore !== null ? '修改分数' : '添加分数'}
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={currentScore !== null ? '修改分数' : '添加分数'}
        size="sm"
      >
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-warm-600 block mb-2">
                总分 (0-10)
              </label>
              <input
                type="number"
                min="0"
                max="10"
                step="0.5"
                value={score}
                onChange={(e) => setScore(e.target.value)}
                className="input text-center text-2xl font-bold"
                placeholder="0"
                autoFocus
              />
            </div>
          </div>

          <div className="flex gap-3 justify-end mt-6 pt-4 border-t border-warm-100">
            <Button type="button" variant="secondary" onClick={() => setIsOpen(false)}>
              取消
            </Button>
            <Button type="submit" loading={isSubmitting}>
              保存
            </Button>
          </div>
        </form>
      </Modal>
    </>
  )
}
