import type { Problem } from "./types"
import problemsData from "~/data/problems.json"

let cachedProblems: Problem[] | null = null

export async function getProblems(): Promise<Problem[]> {
  if (cachedProblems) {
    return cachedProblems
  }

  const parsed = problemsData as Problem[]

  cachedProblems = parsed
  return parsed
}

export async function getProblemBySlug(slug: string): Promise<Problem | null> {
  const problems = await getProblems()
  return problems.find((problem) => problem.slug === slug) ?? null
}
