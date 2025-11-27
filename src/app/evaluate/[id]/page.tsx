import { notFound } from 'next/navigation'
import { PageHeader, Card, CardHeader, Badge, Button, ScoreDisplay } from '@/components/ui'
import { getEvaluation } from '@/app/actions/evaluations'
import { Edit, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { DeleteEvaluationButton } from './DeleteEvaluationButton'

interface Props {
  params: Promise<{ id: string }>
}

export default async function EvaluationDetailPage({ params }: Props) {
  const { id } = await params
  const evaluation = await getEvaluation(id)

  if (!evaluation) {
    notFound()
  }

  return (
    <div className="p-8">
      <PageHeader
        title="评测详情"
        action={
          <div className="flex gap-2">
            <DeleteEvaluationButton id={id} />
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 主内容 */}
        <div className="lg:col-span-2 space-y-6">
          {/* 题目信息 */}
          <Card>
            <CardHeader
              title="题目"
              action={
                <Link href={`/questions/${evaluation.questions?.id}`}>
                  <Button size="sm" variant="ghost">查看题目</Button>
                </Link>
              }
            />
            <h3 className="font-medium text-warm-700 mb-2">
              {evaluation.questions?.title}
            </h3>
            <p className="whitespace-pre-wrap text-warm-600">
              {evaluation.questions?.content}
            </p>
            {evaluation.questions?.expected_answer && (
              <div className="mt-4 pt-4 border-t border-warm-100">
                <p className="text-sm text-warm-500 mb-2">参考答案：</p>
                <p className="whitespace-pre-wrap text-warm-600">
                  {evaluation.questions.expected_answer}
                </p>
              </div>
            )}
          </Card>

          {/* AI 回答 */}
          <Card>
            <CardHeader title="AI 回答" />
            <p className="whitespace-pre-wrap text-warm-600">
              {evaluation.answer}
            </p>
          </Card>

          {/* 评语 */}
          {evaluation.notes && (
            <Card>
              <CardHeader title="评语/备注" />
              <p className="whitespace-pre-wrap text-warm-600">
                {evaluation.notes}
              </p>
            </Card>
          )}
        </div>

        {/* 侧边栏 */}
        <div className="space-y-6">
          {/* 得分 */}
          <Card>
            <CardHeader title="评测得分" />
            <div className="flex items-center justify-center py-4">
              <ScoreDisplay
                score={evaluation.total_score || 0}
                size="lg"
              />
            </div>

            {/* 维度分数 */}
            {evaluation.evaluation_scores && evaluation.evaluation_scores.length > 0 && (
              <div className="mt-4 pt-4 border-t border-warm-100 space-y-3">
                {evaluation.evaluation_scores.map((score) => (
                  <div key={score.id} className="flex justify-between items-center">
                    <span className="text-sm text-warm-600">
                      {score.scoring_dimensions?.name}
                    </span>
                    <span className="font-medium text-warm-700">
                      {score.score} / {score.scoring_dimensions?.max_score}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* 评测信息 */}
          <Card>
            <CardHeader title="评测信息" />
            <dl className="space-y-3">
              <div>
                <dt className="text-sm text-warm-500">模型</dt>
                <dd className="mt-1 font-medium text-warm-700">
                  {evaluation.models?.name}
                </dd>
                {evaluation.models?.provider && (
                  <dd className="text-sm text-warm-500">
                    {evaluation.models.provider}
                  </dd>
                )}
              </div>
              <div>
                <dt className="text-sm text-warm-500">分类</dt>
                <dd className="mt-1">
                  {evaluation.questions?.categories ? (
                    <Badge variant="custom" color={evaluation.questions.categories.color}>
                      {evaluation.questions.categories.name}
                    </Badge>
                  ) : (
                    <span className="text-warm-400">未分类</span>
                  )}
                </dd>
              </div>
              {evaluation.evaluated_by && (
                <div>
                  <dt className="text-sm text-warm-500">评测人</dt>
                  <dd className="mt-1 text-warm-700">{evaluation.evaluated_by}</dd>
                </div>
              )}
              <div>
                <dt className="text-sm text-warm-500">评测时间</dt>
                <dd className="mt-1 text-warm-700">
                  {new Date(evaluation.evaluated_at).toLocaleString('zh-CN')}
                </dd>
              </div>
            </dl>
          </Card>
        </div>
      </div>
    </div>
  )
}
