'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  FileQuestion,
  PlayCircle,
  BarChart3,
  Bot,
  Settings,
  FolderOpen,
} from 'lucide-react'

const navItems = [
  { href: '/', label: '仪表盘', icon: LayoutDashboard },
  { href: '/questions', label: '题目管理', icon: FileQuestion },
  { href: '/categories', label: '分类管理', icon: FolderOpen },
  { href: '/models', label: '模型管理', icon: Bot },
  { href: '/evaluate', label: '开始评测', icon: PlayCircle },
  { href: '/statistics', label: '数据统计', icon: BarChart3 },
  { href: '/settings', label: '设置', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 h-screen bg-white border-r border-warm-100 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-warm-100">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-warm-500 flex items-center justify-center">
            <span className="text-white font-bold text-lg">E</span>
          </div>
          <div>
            <h1 className="font-bold text-warm-700 text-lg">EvaLab</h1>
            <p className="text-xs text-warm-400">AI 评测打分系统</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href ||
            (item.href !== '/' && pathname.startsWith(item.href))
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className={isActive ? 'nav-item-active' : 'nav-item'}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-warm-100">
        <div className="text-xs text-warm-400 text-center">
          EvaLab v0.1.0
        </div>
      </div>
    </aside>
  )
}
