import { readFile } from "node:fs/promises"
import { join } from "node:path"
import type { Problem } from "./types"

let cachedProblems: Problem[] | null = null

export async function getProblems(): Promise<Problem[]> {
  if (cachedProblems) {
    return cachedProblems
  }

  const filePath = join(process.cwd(), "data", "problems.json")
  const raw = await readFile(filePath, "utf-8")
  const parsed = JSON.parse(raw) as Problem[]

  cachedProblems = parsed
  return parsed
}

export async function getProblemBySlug(slug: string): Promise<Problem | null> {
  const problems = await getProblems()
  return problems.find((problem) => problem.slug === slug) ?? null
}
