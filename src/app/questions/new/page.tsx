import { PageHeader } from '@/components/ui'
import { QuestionForm } from '../QuestionForm'
import { getCategories } from '@/app/actions/categories'

export default async function NewQuestionPage() {
  const categories = await getCategories()

  return (
    <div className="p-8">
      <PageHeader
        title="添加题目"
        description="创建新的评测题目"
      />

      <QuestionForm categories={categories} />
    </div>
  )
}
