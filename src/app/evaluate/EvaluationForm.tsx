'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardHeader, Button, Select, Textarea, Input } from '@/components/ui'
import { createEvaluation } from '@/app/actions/evaluations'
import type { Question, Model, ScoringDimension, Category } from '@/types/database'

interface QuestionWithCategory extends Question {
  categories: Category | null
}

interface Props {
  questions: QuestionWithCategory[]
  models: Model[]
  dimensions: ScoringDimension[]
  preselectedQuestionId?: string
}

export function EvaluationForm({ questions, models, dimensions, preselectedQuestionId }: Props) {
  const router = useRouter()

  const [formData, setFormData] = useState({
    question_id: preselectedQuestionId || '',
    model_id: '',
    answer: '',
    total_score: '',
    notes: '',
    evaluated_by: '',
  })

  const [dimensionScores, setDimensionScores] = useState<Record<string, number>>(
    dimensions.reduce((acc, d) => ({ ...acc, [d.id]: 5 }), {})
  )

  const [useDetailedScoring, setUseDetailedScoring] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const selectedQuestion = questions.find((q) => q.id === formData.question_id)

  const calculateTotalScore = () => {
    if (!useDetailedScoring) return parseFloat(formData.total_score) || 0

    const defaultDimensions = dimensions.filter((d) => d.is_default)
    if (defaultDimensions.length === 0) return 0

    const totalWeight = defaultDimensions.reduce((sum, d) => sum + d.weight, 0)
    const weightedSum = defaultDimensions.reduce(
      (sum, d) => sum + (dimensionScores[d.id] / d.max_score) * d.weight,
      0
    )

    return (weightedSum / totalWeight) * 10
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      const totalScore = calculateTotalScore()

      const scores = useDetailedScoring
        ? dimensions
            .filter((d) => d.is_default)
            .map((d) => ({
              dimension_id: d.id,
              score: dimensionScores[d.id],
            }))
        : undefined

      await createEvaluation(
        {
          question_id: formData.question_id,
          model_id: formData.model_id,
          answer: formData.answer,
          total_score: totalScore,
          notes: formData.notes || null,
          evaluated_by: formData.evaluated_by || null,
        },
        scores
      )

      router.push('/evaluate')
    } catch (err) {
      setError('保存失败，请重试')
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const questionOptions = questions.map((q) => ({
    value: q.id,
    label: `${q.title}${q.categories ? ` [${q.categories.name}]` : ''}`,
  }))

  const modelOptions = models.map((m) => ({
    value: m.id,
    label: `${m.name}${m.provider ? ` (${m.provider})` : ''}`,
  }))

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 主表单 */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader title="基本信息" />
            <div className="space-y-4">
              <Select
                label="选择题目"
                value={formData.question_id}
                onChange={(e) => setFormData({ ...formData, question_id: e.target.value })}
                options={questionOptions}
                placeholder="选择要评测的题目"
                required
              />

              <Select
                label="选择模型"
                value={formData.model_id}
                onChange={(e) => setFormData({ ...formData, model_id: e.target.value })}
                options={modelOptions}
                placeholder="选择 AI 模型"
                required
              />

              <Input
                label="评测人（可选）"
                value={formData.evaluated_by}
                onChange={(e) => setFormData({ ...formData, evaluated_by: e.target.value })}
                placeholder="你的名字"
              />
            </div>
          </Card>

          {/* 题目内容预览 */}
          {selectedQuestion && (
            <Card>
              <CardHeader title="题目内容" />
              <p className="whitespace-pre-wrap text-warm-600">
                {selectedQuestion.content}
              </p>
              {selectedQuestion.expected_answer && (
                <div className="mt-4 pt-4 border-t border-warm-100">
                  <p className="text-sm text-warm-500 mb-2">参考答案：</p>
                  <p className="whitespace-pre-wrap text-warm-600">
                    {selectedQuestion.expected_answer}
                  </p>
                </div>
              )}
            </Card>
          )}

          <Card>
            <CardHeader title="AI 回答" description="粘贴或输入 AI 模型的回答" />
            <Textarea
              value={formData.answer}
              onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
              placeholder="在这里输入 AI 的回答..."
              rows={10}
              required
            />
          </Card>

          <Card>
            <CardHeader title="评语/备注（可选）" />
            <Textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="对这次评测的备注..."
              rows={4}
            />
          </Card>
        </div>

        {/* 打分区域 */}
        <div className="space-y-6">
          <Card>
            <CardHeader title="打分" />

            <div className="mb-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={useDetailedScoring}
                  onChange={(e) => setUseDetailedScoring(e.target.checked)}
                  className="rounded border-warm-300 text-warm-500 focus:ring-warm-500"
                />
                <span className="text-sm text-warm-600">使用多维度评分</span>
              </label>
            </div>

            {useDetailedScoring ? (
              <div className="space-y-4">
                {dimensions
                  .filter((d) => d.is_default)
                  .map((dimension) => (
                    <div key={dimension.id}>
                      <div className="flex justify-between mb-1">
                        <label className="text-sm font-medium text-warm-600">
                          {dimension.name}
                        </label>
                        <span className="text-sm text-warm-500">
                          {dimensionScores[dimension.id]} / {dimension.max_score}
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max={dimension.max_score}
                        step="0.5"
                        value={dimensionScores[dimension.id]}
                        onChange={(e) =>
                          setDimensionScores({
                            ...dimensionScores,
                            [dimension.id]: parseFloat(e.target.value),
                          })
                        }
                        className="w-full h-2 bg-cream-200 rounded-lg appearance-none cursor-pointer accent-warm-500"
                      />
                      {dimension.description && (
                        <p className="text-xs text-warm-400 mt-1">{dimension.description}</p>
                      )}
                    </div>
                  ))}

                <div className="pt-4 border-t border-warm-100">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-warm-700">综合得分</span>
                    <span className="text-2xl font-bold text-warm-700">
                      {calculateTotalScore().toFixed(1)}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <label className="text-sm font-medium text-warm-600 block mb-2">
                  总分 (0-10)
                </label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  step="0.5"
                  value={formData.total_score}
                  onChange={(e) => setFormData({ ...formData, total_score: e.target.value })}
                  className="input text-center text-2xl font-bold"
                  placeholder="0"
                  required={!useDetailedScoring}
                />
              </div>
            )}
          </Card>

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          <div className="flex gap-3">
            <Button
              type="button"
              variant="secondary"
              className="flex-1"
              onClick={() => router.back()}
            >
              取消
            </Button>
            <Button type="submit" className="flex-1" loading={isSubmitting}>
              保存评测
            </Button>
          </div>
        </div>
      </div>
    </form>
  )
}
