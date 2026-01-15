import { getProblems } from "../utils/problems"
import { getProgressEntries } from "../utils/progress"

export default defineEventHandler(async () => {
  const [problems, progressEntries] = await Promise.all([
    getProblems(),
    getProgressEntries()
  ])

  const progressMap = Object.fromEntries(
    progressEntries.map((entry) => [entry.slug, entry])
  )

  return problems.map((problem) => {
    const progress = progressMap[problem.slug]
    return {
      slug: problem.slug,
      title: problem.title,
      difficulty: problem.difficulty,
      topicTags: problem.topicTags,
      solved: progress?.solved ?? false,
      attempts: progress?.attempts ?? 0,
      updatedAt: progress?.updatedAt ?? null
    }
  })
})
