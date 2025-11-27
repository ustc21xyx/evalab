import { ReactNode } from 'react'
import { FileQuestion } from 'lucide-react'

interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description?: string
  action?: ReactNode
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-16 h-16 rounded-2xl bg-cream-200 flex items-center justify-center text-warm-400 mb-4">
        {icon || <FileQuestion size={32} />}
      </div>
      <h3 className="text-lg font-medium text-warm-700 mb-1">{title}</h3>
      {description && (
        <p className="text-warm-500 mb-4 max-w-sm">{description}</p>
      )}
      {action}
    </div>
  )
}
