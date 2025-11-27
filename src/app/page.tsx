import { FileQuestion, Bot, PlayCircle, BarChart3 } from 'lucide-react'
import { Card, CardHeader, PageHeader } from '@/components/ui'
import Link from 'next/link'

const stats = [
  { label: '题目总数', value: '0', icon: FileQuestion, href: '/questions' },
  { label: 'AI 模型', value: '0', icon: Bot, href: '/models' },
  { label: '评测记录', value: '0', icon: PlayCircle, href: '/evaluate' },
]

const quickActions = [
  { label: '添加题目', description: '创建新的评测题目', href: '/questions/new', icon: FileQuestion },
  { label: '开始评测', description: '选择题目进行 AI 评测', href: '/evaluate', icon: PlayCircle },
  { label: '查看统计', description: '分析模型表现数据', href: '/statistics', icon: BarChart3 },
]

export default function HomePage() {
  return (
    <div className="p-8">
      <PageHeader
        title="欢迎使用 EvaLab"
        description="AI 评测打分系统 - 测试和比较不同 AI 模型的表现"
      />

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Link key={stat.label} href={stat.href}>
              <Card hover className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-cream-200 flex items-center justify-center text-warm-500">
                  <Icon size={24} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-warm-700">{stat.value}</p>
                  <p className="text-sm text-warm-500">{stat.label}</p>
                </div>
              </Card>
            </Link>
          )
        })}
      </div>

      {/* 快捷操作 */}
      <Card>
        <CardHeader title="快捷操作" description="常用功能入口" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon
            return (
              <Link key={action.label} href={action.href}>
                <div className="p-4 rounded-xl border border-warm-100 hover:border-warm-200 hover:bg-cream-50 transition-all">
                  <div className="w-10 h-10 rounded-lg bg-cream-200 flex items-center justify-center text-warm-500 mb-3">
                    <Icon size={20} />
                  </div>
                  <h3 className="font-medium text-warm-700">{action.label}</h3>
                  <p className="text-sm text-warm-400">{action.description}</p>
                </div>
              </Link>
            )
          })}
        </div>
      </Card>

      {/* 使用说明 */}
      <Card className="mt-6">
        <CardHeader title="开始使用" description="按照以下步骤设置你的评测环境" />
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-warm-500 text-white flex items-center justify-center text-sm font-medium shrink-0">
              1
            </div>
            <div>
              <h4 className="font-medium text-warm-700">配置 Supabase</h4>
              <p className="text-sm text-warm-500">
                创建 Supabase 项目，运行 <code className="px-1.5 py-0.5 bg-cream-200 rounded text-warm-600">supabase/schema.sql</code> 初始化数据库
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-warm-500 text-white flex items-center justify-center text-sm font-medium shrink-0">
              2
            </div>
            <div>
              <h4 className="font-medium text-warm-700">添加环境变量</h4>
              <p className="text-sm text-warm-500">
                复制 <code className="px-1.5 py-0.5 bg-cream-200 rounded text-warm-600">.env.local.example</code> 为 <code className="px-1.5 py-0.5 bg-cream-200 rounded text-warm-600">.env.local</code> 并填入 Supabase 密钥
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-warm-500 text-white flex items-center justify-center text-sm font-medium shrink-0">
              3
            </div>
            <div>
              <h4 className="font-medium text-warm-700">添加题目并开始评测</h4>
              <p className="text-sm text-warm-500">
                在「题目管理」中添加评测题目，然后在「开始评测」中记录 AI 回答并打分
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
