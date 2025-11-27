import { Suspense } from 'react'
import { PageHeader, Card, Button } from '@/components/ui'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import { EvaluationList } from './EvaluationList'

export default function EvaluatePage() {
  return (
    <div className="p-8">
      <PageHeader
        title="评测记录"
        description="管理 AI 模型评测记录"
        action={
          <Link href="/evaluate/new">
            <Button>
              <Plus size={18} />
              新建评测
            </Button>
          </Link>
        }
      />

      <Suspense fallback={<EvaluationsLoading />}>
        <EvaluationList />
      </Suspense>
    </div>
  )
}

function EvaluationsLoading() {
  return (
    <Card>
      <div className="animate-pulse space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 bg-cream-100 rounded-lg" />
        ))}
      </div>
    </Card>
  )
}
