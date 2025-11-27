import { notFound } from 'next/navigation'
import { PageHeader, Card, CardHeader, Badge, Button } from '@/components/ui'
import { getQuestion } from '@/app/actions/questions'
import { getEvaluationsByQuestion } from '@/app/actions/evaluations'
import { Edit, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { DeleteQuestionButton } from './DeleteQuestionButton'

interface Props {
  params: Promise<{ id: string }>
}

export default async function QuestionDetailPage({ params }: Props) {
  const { id } = await params
  const question = await getQuestion(id)

  if (!question) {
    notFound()
  }

  const evaluations = await getEvaluationsByQuestion(id)

  return (
    <div className="p-8">
      <PageHeader
        title={question.title}
        action={
          <div className="flex gap-2">
            <Link href={`/questions/${id}/edit`}>
              <Button variant="secondary">
                <Edit size={18} />
                编辑
              </Button>
            </Link>
            <DeleteQuestionButton id={id} />
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 题目内容 */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader title="题目内容" />
            <div className="prose prose-warm max-w-none">
              <p className="whitespace-pre-wrap text-warm-600">{question.content}</p>
            </div>
          </Card>

          {question.expected_answer && (
            <Card>
              <CardHeader title="参考答案" />
              <p className="whitespace-pre-wrap text-warm-600">{question.expected_answer}</p>
            </Card>
          )}

          {/* 评测记录 */}
          <Card>
            <CardHeader
              title="评测记录"
              description={`共 ${evaluations.length} 条评测`}
              action={
                <Link href={`/evaluate?question=${id}`}>
                  <Button size="sm">添加评测</Button>
                </Link>
              }
            />
            {evaluations.length > 0 ? (
              <div className="space-y-3">
                {evaluations.map((evaluation) => (
                  <div
                    key={evaluation.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-cream-50"
                  >
                    <div>
                      <p className="font-medium text-warm-700">
                        {evaluation.models?.name}
                      </p>
                      <p className="text-sm text-warm-500 line-clamp-1">
                        {evaluation.answer.substring(0, 100)}...
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-warm-700">
                        {evaluation.total_score?.toFixed(1) || '-'}
                      </p>
                      <p className="text-xs text-warm-400">
                        {new Date(evaluation.evaluated_at).toLocaleDateString('zh-CN')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-warm-500 text-center py-4">暂无评测记录</p>
            )}
          </Card>
        </div>

        {/* 侧边信息 */}
        <div className="space-y-6">
          <Card>
            <CardHeader title="题目信息" />
            <dl className="space-y-3">
              <div>
                <dt className="text-sm text-warm-500">分类</dt>
                <dd className="mt-1">
                  {question.categories ? (
                    <Badge variant="custom" color={question.categories.color}>
                      {question.categories.name}
                    </Badge>
                  ) : (
                    <span className="text-warm-400">未分类</span>
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-warm-500">难度</dt>
                <dd className="mt-1 text-warm-700">
                  {'★'.repeat(question.difficulty)}{'☆'.repeat(5 - question.difficulty)}
                </dd>
              </div>
              {question.tags && question.tags.length > 0 && (
                <div>
                  <dt className="text-sm text-warm-500">标签</dt>
                  <dd className="mt-1 flex flex-wrap gap-1">
                    {question.tags.map((tag: string) => (
                      <Badge key={tag}>{tag}</Badge>
                    ))}
                  </dd>
                </div>
              )}
              <div>
                <dt className="text-sm text-warm-500">创建时间</dt>
                <dd className="mt-1 text-warm-700">
                  {new Date(question.created_at).toLocaleString('zh-CN')}
                </dd>
              </div>
            </dl>
          </Card>
        </div>
      </div>
    </div>
  )
}
