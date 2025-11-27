import { getModels } from '@/app/actions/models'
import { Card, Badge, EmptyState } from '@/components/ui'
import { Bot } from 'lucide-react'
import { ModelFormModal } from './ModelFormModal'
import { DeleteModelButton } from './DeleteModelButton'

export async function ModelList() {
  const models = await getModels()

  if (!models || models.length === 0) {
    return (
      <Card>
        <EmptyState
          icon={<Bot size={32} />}
          title="还没有模型"
          description="添加你要评测的 AI 模型"
          action={<ModelFormModal />}
        />
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {models.map((model) => (
        <Card key={model.id}>
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-cream-200 flex items-center justify-center text-warm-500">
                <Bot size={20} />
              </div>
              <div>
                <h3 className="font-medium text-warm-700">{model.name}</h3>
                {model.provider && (
                  <p className="text-sm text-warm-500">{model.provider}</p>
                )}
                {model.api_identifier && (
                  <code className="text-xs text-warm-400 bg-cream-100 px-1.5 py-0.5 rounded mt-1 inline-block">
                    {model.api_identifier}
                  </code>
                )}
              </div>
            </div>
            <div className="flex gap-1">
              <ModelFormModal model={model} />
              <DeleteModelButton id={model.id} name={model.name} />
            </div>
          </div>
          {model.description && (
            <p className="text-sm text-warm-500 mt-3 pt-3 border-t border-warm-50 whitespace-pre-wrap">
              {model.description}
            </p>
          )}
        </Card>
      ))}
    </div>
  )
}
