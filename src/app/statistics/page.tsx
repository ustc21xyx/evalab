import { Suspense } from 'react'
import { PageHeader, Card } from '@/components/ui'
import { ModelStatsTable } from './ModelStatsTable'
import { CategoryStatsTable } from './CategoryStatsTable'
import { ComparisonChart } from './ComparisonChart'

export default function StatisticsPage() {
  return (
    <div className="p-8">
      <PageHeader
        title="数据统计"
        description="分析和比较 AI 模型表现"
      />

      <div className="space-y-8">
        <Suspense fallback={<StatsLoading title="模型表现统计" />}>
          <ModelStatsTable />
        </Suspense>

        <Suspense fallback={<StatsLoading title="分类统计" />}>
          <CategoryStatsTable />
        </Suspense>
      </div>
    </div>
  )
}

function StatsLoading({ title }: { title: string }) {
  return (
    <Card>
      <h3 className="font-semibold text-warm-700 mb-4">{title}</h3>
      <div className="animate-pulse space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-12 bg-cream-100 rounded-lg" />
        ))}
      </div>
    </Card>
  )
}
