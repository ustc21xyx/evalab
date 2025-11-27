import { Suspense } from 'react'
import { PageHeader, Card, Button } from '@/components/ui'
import { Plus } from 'lucide-react'
import { CategoryList } from './CategoryList'
import { CategoryFormModal } from './CategoryFormModal'

export default function CategoriesPage() {
  return (
    <div className="p-8">
      <PageHeader
        title="分类管理"
        description="管理题目分类"
        action={<CategoryFormModal />}
      />

      <Suspense fallback={<CategoriesLoading />}>
        <CategoryList />
      </Suspense>
    </div>
  )
}

function CategoriesLoading() {
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
