import { getCategoryStatistics } from '@/app/actions/statistics'
import { getCategories } from '@/app/actions/categories'
import { getModels } from '@/app/actions/models'
import { Card, CardHeader, EmptyState, Badge } from '@/components/ui'
import { FolderOpen } from 'lucide-react'

export async function CategoryStatsTable() {
  const [stats, categories, models] = await Promise.all([
    getCategoryStatistics(),
    getCategories(),
    getModels(),
  ])

  // 筛选有评测记录的统计
  const filteredStats = stats.filter((s) => s.total_evaluations > 0)

  if (!filteredStats || filteredStats.length === 0) {
    return (
      <Card>
        <CardHeader title="分类统计" description="按分类查看各模型表现" />
        <EmptyState
          icon={<FolderOpen size={32} />}
          title="暂无分类统计"
          description="完成一些评测后，这里会显示各分类的统计数据"
        />
      </Card>
    )
  }

  // 按分类分组
  const groupedByCategory = categories.reduce((acc, category) => {
    const categoryStats = filteredStats.filter((s) => s.category_id === category.id)
    if (categoryStats.length > 0) {
      acc[category.id] = {
        category,
        stats: categoryStats,
      }
    }
    return acc
  }, {} as Record<string, { category: typeof categories[0]; stats: typeof filteredStats }>)

  return (
    <Card>
      <CardHeader title="分类统计" description="按分类查看各模型表现" />

      {Object.keys(groupedByCategory).length === 0 ? (
        <EmptyState
          icon={<FolderOpen size={32} />}
          title="暂无分类统计"
          description="完成一些评测后，这里会显示各分类的统计数据"
        />
      ) : (
        <div className="space-y-6">
          {(Object.values(groupedByCategory) as { category: typeof categories[0]; stats: typeof filteredStats }[]).map(({ category, stats }) => (
            <div key={category.id}>
              <div className="flex items-center gap-2 mb-3">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: category.color }}
                />
                <h4 className="font-medium text-warm-700">{category.name}</h4>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {stats
                  .sort((a, b) => (b.avg_score || 0) - (a.avg_score || 0))
                  .map((stat) => (
                    <div
                      key={`${stat.category_id}-${stat.model_id}`}
                      className="p-3 rounded-lg bg-cream-50 border border-warm-100"
                    >
                      <p className="text-sm text-warm-500 mb-1">{stat.model_name}</p>
                      <p className="text-xl font-bold text-warm-700">
                        {stat.avg_score?.toFixed(1) || '-'}
                      </p>
                      <p className="text-xs text-warm-400">
                        {stat.total_evaluations} 次评测
                      </p>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}
