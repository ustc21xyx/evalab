import { getCategories } from '@/app/actions/categories'
import { Card, Badge, EmptyState } from '@/components/ui'
import { FolderOpen } from 'lucide-react'
import { CategoryFormModal } from './CategoryFormModal'
import { DeleteCategoryButton } from './DeleteCategoryButton'

export async function CategoryList() {
  const categories = await getCategories()

  if (!categories || categories.length === 0) {
    return (
      <Card>
        <EmptyState
          icon={<FolderOpen size={32} />}
          title="还没有分类"
          description="添加分类来组织你的题目"
          action={<CategoryFormModal />}
        />
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {categories.map((category) => (
        <Card key={category.id} className="relative">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: category.color }}
                />
                <h3 className="font-medium text-warm-700">{category.name}</h3>
              </div>
              {category.description && (
                <p className="text-sm text-warm-500">{category.description}</p>
              )}
            </div>
            <div className="flex gap-1">
              <CategoryFormModal category={category} />
              <DeleteCategoryButton id={category.id} name={category.name} />
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
