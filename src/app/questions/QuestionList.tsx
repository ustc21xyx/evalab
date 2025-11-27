import { getQuestions } from '@/app/actions/questions'
import { Card, Badge, EmptyState, Button } from '@/components/ui'
import { FileQuestion, ChevronRight, Plus } from 'lucide-react'
import Link from 'next/link'

export async function QuestionList() {
  const questions = await getQuestions()

  if (!questions || questions.length === 0) {
    return (
      <Card>
        <EmptyState
          icon={<FileQuestion size={32} />}
          title="还没有题目"
          description="添加你的第一道评测题目开始使用"
          action={
            <Link href="/questions/new">
              <Button>
                <Plus size={18} />
                添加题目
              </Button>
            </Link>
          }
        />
      </Card>
    )
  }

  return (
    <div className="space-y-3">
      {questions.map((question) => (
        <Link key={question.id} href={`/questions/${question.id}`}>
          <Card hover className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-medium text-warm-700 truncate">
                  {question.title}
                </h3>
                {question.categories && (
                  <Badge variant="custom" color={question.categories.color}>
                    {question.categories.name}
                  </Badge>
                )}
              </div>
              <p className="text-sm text-warm-500 line-clamp-2">
                {question.content}
              </p>
              <div className="flex items-center gap-4 mt-2 text-xs text-warm-400">
                <span>难度: {'★'.repeat(question.difficulty)}{'☆'.repeat(5 - question.difficulty)}</span>
                {question.tags && question.tags.length > 0 && (
                  <span>标签: {question.tags.join(', ')}</span>
                )}
              </div>
            </div>
            <ChevronRight size={20} className="text-warm-300 shrink-0 ml-4" />
          </Card>
        </Link>
      ))}
    </div>
  )
}
