import { Suspense } from 'react'
import { PageHeader, Card } from '@/components/ui'
import { ModelList } from './ModelList'
import { ModelFormModal } from './ModelFormModal'

export default function ModelsPage() {
  return (
    <div className="p-8">
      <PageHeader
        title="模型管理"
        description="管理 AI 模型信息"
        action={<ModelFormModal />}
      />

      <Suspense fallback={<ModelsLoading />}>
        <ModelList />
      </Suspense>
    </div>
  )
}

function ModelsLoading() {
  return (
    <Card>
      <div className="animate-pulse space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 bg-cream-100 rounded-lg" />
        ))}
      </div>
    </Card>
  )
}
