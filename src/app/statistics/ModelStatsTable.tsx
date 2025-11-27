import { getModelStatistics } from '@/app/actions/statistics'
import { Card, CardHeader, EmptyState, ScoreDisplay } from '@/components/ui'
import { BarChart3, Trophy } from 'lucide-react'

export async function ModelStatsTable() {
  const stats = await getModelStatistics()

  if (!stats || stats.length === 0 || stats.every((s) => s.total_evaluations === 0)) {
    return (
      <Card>
        <CardHeader title="模型表现统计" description="按模型统计评测得分" />
        <EmptyState
          icon={<BarChart3 size={32} />}
          title="暂无统计数据"
          description="完成一些评测后，这里会显示模型的统计数据"
        />
      </Card>
    )
  }

  // 筛选有评测记录的模型
  const filteredStats = stats.filter((s) => s.total_evaluations > 0)

  return (
    <Card>
      <CardHeader title="模型表现统计" description="按模型统计评测得分" />
      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>排名</th>
              <th>模型</th>
              <th>提供商</th>
              <th>评测数</th>
              <th>平均分</th>
              <th>最高分</th>
              <th>最低分</th>
            </tr>
          </thead>
          <tbody>
            {filteredStats.map((stat, index) => (
              <tr key={stat.model_id}>
                <td>
                  {index === 0 ? (
                    <span className="inline-flex items-center gap-1 text-yellow-600">
                      <Trophy size={16} />
                      1
                    </span>
                  ) : (
                    index + 1
                  )}
                </td>
                <td className="font-medium text-warm-700">{stat.model_name}</td>
                <td className="text-warm-500">{stat.provider || '-'}</td>
                <td>{stat.total_evaluations}</td>
                <td>
                  <ScoreDisplay score={stat.avg_score || 0} size="sm" />
                </td>
                <td className="text-accent-green font-medium">
                  {stat.max_score?.toFixed(1) || '-'}
                </td>
                <td className="text-red-500 font-medium">
                  {stat.min_score?.toFixed(1) || '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
