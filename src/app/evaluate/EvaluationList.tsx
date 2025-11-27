import { getEvaluations } from '@/app/actions/evaluations'
import { Card, Badge, EmptyState, Button, ScoreDisplay } from '@/components/ui'
import { PlayCircle, Plus, ChevronRight } from 'lucide-react'
import Link from 'next/link'

export async function EvaluationList() {
  const evaluations = await getEvaluations()

  if (!evaluations || evaluations.length === 0) {
    return (
      <Card>
        <EmptyState
          icon={<PlayCircle size={32} />}
          title="还没有评测记录"
          description="创建你的第一条评测记录"
          action={
            <Link href="/evaluate/new">
              <Button>
                <Plus size={18} />
                新建评测
              </Button>
            </Link>
          }
        />
      </Card>
    )
  }

  return (
    <div className="space-y-3">
      {evaluations.map((evaluation) => (
        <Link key={evaluation.id} href={`/evaluate/${evaluation.id}`}>
          <Card hover className="flex items-center gap-4">
            <ScoreDisplay
              score={evaluation.total_score || 0}
              size="lg"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-medium text-warm-700">
                  {evaluation.models?.name}
                </h3>
                <span className="text-warm-300">|</span>
                <span className="text-warm-500 truncate">
                  {evaluation.questions?.title}
                </span>
              </div>
              <p className="text-sm text-warm-500 line-clamp-1">
                {evaluation.answer.substring(0, 150)}...
              </p>
              <div className="flex items-center gap-4 mt-2 text-xs text-warm-400">
                {evaluation.questions?.categories && (
                  <Badge variant="custom" color={evaluation.questions.categories.color}>
                    {evaluation.questions.categories.name}
                  </Badge>
                )}
                <span>
                  {new Date(evaluation.evaluated_at).toLocaleString('zh-CN')}
                </span>
                {evaluation.evaluated_by && (
                  <span>评测人: {evaluation.evaluated_by}</span>
                )}
              </div>
            </div>
            <ChevronRight size={20} className="text-warm-300 shrink-0" />
          </Card>
        </Link>
      ))}
    </div>
  )
}
