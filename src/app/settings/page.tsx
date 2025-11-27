import { PageHeader, Card, CardHeader } from '@/components/ui'
import { Database, Palette, Info } from 'lucide-react'

export default function SettingsPage() {
  return (
    <div className="p-8">
      <PageHeader
        title="设置"
        description="系统配置和信息"
      />

      <div className="space-y-6 max-w-2xl">
        <Card>
          <CardHeader
            title="数据库配置"
            description="Supabase 连接设置"
          />
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 rounded-lg bg-cream-50">
              <Database size={20} className="text-warm-500" />
              <div className="flex-1">
                <p className="text-sm font-medium text-warm-700">Supabase URL</p>
                <p className="text-xs text-warm-500 font-mono">
                  {process.env.NEXT_PUBLIC_SUPABASE_URL ? '已配置' : '未配置'}
                </p>
              </div>
              <div className={`w-2 h-2 rounded-full ${process.env.NEXT_PUBLIC_SUPABASE_URL ? 'bg-accent-green' : 'bg-red-400'}`} />
            </div>

            <div className="text-sm text-warm-500">
              <p className="mb-2">配置步骤：</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>在 Supabase 创建新项目</li>
                <li>运行 <code className="px-1 py-0.5 bg-cream-200 rounded">supabase/schema.sql</code> 初始化数据库</li>
                <li>复制项目 URL 和 anon key 到 <code className="px-1 py-0.5 bg-cream-200 rounded">.env.local</code></li>
                <li>重启开发服务器</li>
              </ol>
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader
            title="主题设置"
            description="界面外观配置"
          />
          <div className="flex items-center gap-3 p-4 rounded-lg bg-cream-50">
            <Palette size={20} className="text-warm-500" />
            <div className="flex-1">
              <p className="text-sm font-medium text-warm-700">当前主题</p>
              <p className="text-xs text-warm-500">温暖米色（默认）</p>
            </div>
          </div>
          <p className="text-sm text-warm-400 mt-3">
            更多主题选项即将推出
          </p>
        </Card>

        <Card>
          <CardHeader
            title="关于"
            description="系统信息"
          />
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-warm-500">版本</span>
              <span className="text-sm font-medium text-warm-700">0.1.0</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-warm-500">框架</span>
              <span className="text-sm font-medium text-warm-700">Next.js 14</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-warm-500">数据库</span>
              <span className="text-sm font-medium text-warm-700">Supabase</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
