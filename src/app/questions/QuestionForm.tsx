'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, Button, Input, Textarea, Select } from '@/components/ui'
import { createQuestion, updateQuestion } from '@/app/actions/questions'
import type { Question, Category, QuestionInsert } from '@/types/database'

interface Props {
  question?: Question
  categories: Category[]
}

export function QuestionForm({ question, categories }: Props) {
  const router = useRouter()
  const isEditing = !!question

  const [formData, setFormData] = useState({
    title: question?.title || '',
    content: question?.content || '',
    category_id: question?.category_id || '',
    difficulty: question?.difficulty || 3,
    expected_answer: question?.expected_answer || '',
    tags: question?.tags?.join(', ') || '',
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      const questionData: QuestionInsert = {
        title: formData.title,
        content: formData.content,
        category_id: formData.category_id || null,
        difficulty: formData.difficulty,
        expected_answer: formData.expected_answer || null,
        tags: formData.tags ? formData.tags.split(',').map((t) => t.trim()).filter(Boolean) : null,
      }

      if (isEditing) {
        await updateQuestion(question.id, questionData)
        router.push(`/questions/${question.id}`)
      } else {
        const newQuestion = await createQuestion(questionData)
        router.push(`/questions/${newQuestion.id}`)
      }
    } catch (err) {
      setError('保存失败，请重试')
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const categoryOptions = categories.map((c) => ({ value: c.id, label: c.name }))
  const difficultyOptions = [
    { value: '1', label: '★☆☆☆☆ 简单' },
    { value: '2', label: '★★☆☆☆ 较易' },
    { value: '3', label: '★★★☆☆ 中等' },
    { value: '4', label: '★★★★☆ 较难' },
    { value: '5', label: '★★★★★ 困难' },
  ]

  return (
    <form onSubmit={handleSubmit}>
      <Card className="max-w-3xl">
        <div className="space-y-6">
          <Input
            label="题目标题"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="简短描述这道题目"
            required
          />

          <Textarea
            label="题目内容"
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            placeholder="详细的题目描述..."
            rows={6}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="分类"
              value={formData.category_id}
              onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
              options={categoryOptions}
              placeholder="选择分类"
            />

            <Select
              label="难度"
              value={String(formData.difficulty)}
              onChange={(e) => setFormData({ ...formData, difficulty: parseInt(e.target.value) })}
              options={difficultyOptions}
            />
          </div>

          <Textarea
            label="参考答案（可选）"
            value={formData.expected_answer}
            onChange={(e) => setFormData({ ...formData, expected_answer: e.target.value })}
            placeholder="用于对比 AI 回答的参考答案..."
            rows={4}
          />

          <Input
            label="标签（可选）"
            value={formData.tags}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            placeholder="用逗号分隔多个标签，如：算法, 递归, 动态规划"
          />

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          <div className="flex gap-3 justify-end pt-4 border-t border-warm-100">
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.back()}
            >
              取消
            </Button>
            <Button type="submit" loading={isSubmitting}>
              {isEditing ? '保存修改' : '创建题目'}
            </Button>
          </div>
        </div>
      </Card>
    </form>
  )
}
