interface ScoreDisplayProps {
  score: number
  maxScore?: number
  size?: 'sm' | 'md' | 'lg'
}

export function ScoreDisplay({ score, maxScore = 10, size = 'md' }: ScoreDisplayProps) {
  const percentage = (score / maxScore) * 100

  let colorClass = 'score-low'
  if (percentage >= 70) {
    colorClass = 'score-high'
  } else if (percentage >= 40) {
    colorClass = 'score-medium'
  }

  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-lg',
    lg: 'w-14 h-14 text-xl',
  }

  return (
    <div className={`${colorClass} ${sizeClasses[size]}`}>
      {score.toFixed(1)}
    </div>
  )
}
