import { Suspense } from 'react'
import { PageHeader, Card, Button, EmptyState } from '@/components/ui'
import { Plus, FileQuestion } from 'lucide-react'
import Link from 'next/link'
import { QuestionList } from './QuestionList'

export default function QuestionsPage() {
  return (
    <div className="p-8">
      <PageHeader
        title="题目管理"
        description="管理评测题目，支持分类和批量导入"
        action={
          <Link href="/questions/new">
            <Button>
              <Plus size={18} />
              添加题目
            </Button>
          </Link>
        }
      />

      <Suspense fallback={<QuestionsLoading />}>
        <QuestionList />
      </Suspense>
    </div>
  )
}

function QuestionsLoading() {
  return (
    <Card>
      <div className="animate-pulse space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 bg-cream-100 rounded-lg" />
        ))}
      </div>
    </Card>
  )
}
