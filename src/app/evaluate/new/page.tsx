import { PageHeader } from '@/components/ui'
import { EvaluationForm } from '../EvaluationForm'
import { getQuestions } from '@/app/actions/questions'
import { getModels } from '@/app/actions/models'
import { getScoringDimensions } from '@/app/actions/evaluations'

export default async function NewEvaluationPage() {
  const [questions, models, dimensions] = await Promise.all([
    getQuestions(),
    getModels(),
    getScoringDimensions(),
  ])

  return (
    <div className="p-8">
      <PageHeader
        title="新建评测"
        description="记录 AI 模型的回答并打分"
      />

      <EvaluationForm
        questions={questions}
        models={models}
        dimensions={dimensions}
      />
    </div>
  )
}
