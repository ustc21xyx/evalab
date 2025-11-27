import { notFound } from 'next/navigation'
import { PageHeader } from '@/components/ui'
import { QuestionForm } from '../../QuestionForm'
import { getQuestion } from '@/app/actions/questions'
import { getCategories } from '@/app/actions/categories'

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditQuestionPage({ params }: Props) {
  const { id } = await params
  const [question, categories] = await Promise.all([
    getQuestion(id),
    getCategories(),
  ])

  if (!question) {
    notFound()
  }

  return (
    <div className="p-8">
      <PageHeader
        title="编辑题目"
        description={question.title}
      />

      <QuestionForm question={question} categories={categories} />
    </div>
  )
}
