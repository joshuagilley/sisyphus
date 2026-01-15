import { readBody, createError } from "h3"
import { getProblemBySlug } from "../utils/problems"
import { connectToDatabase } from "../utils/db"
import { SubmissionModel } from "../utils/models"
import { getProgressBySlug, upsertProgress } from "../utils/progress"
import { runSolution } from "../utils/runner"

type SubmitBody = {
  slug?: string
  solutionBody?: string
}

export default defineEventHandler(async (event) => {
  const body = (await readBody(event)) as SubmitBody
  const slug = body.slug?.trim()
  const solutionBody = body.solutionBody ?? ""

  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: "Missing slug." })
  }

  if (!solutionBody.trim()) {
    throw createError({ statusCode: 400, statusMessage: "Solution is empty." })
  }

  const problem = await getProblemBySlug(slug)
  if (!problem) {
    throw createError({ statusCode: 404, statusMessage: "Problem not found." })
  }

  const runResult = runSolution(problem, solutionBody)

  const previous = await getProgressBySlug(slug)
  const now = new Date().toISOString()

  const updated = {
    attempts: (previous?.attempts ?? 0) + 1,
    solved: Boolean(previous?.solved || runResult.passedAll),
    solutionText: solutionBody,
    lastResult: runResult,
    updatedAt: now
  }

  await connectToDatabase()
  await SubmissionModel.create({
    problemId: slug,
    solutionText: solutionBody,
    passedAll: runResult.passedAll,
    createdAt: new Date(now)
  })

  await upsertProgress(slug, updated)

  return {
    passedAll: runResult.passedAll,
    results: runResult.results,
    progress: updated
  }
})
