import { getRouterParam, createError, defineEventHandler } from "h3"
import { getProblemBySlug } from "../../utils/problems"
import { getProgressBySlug } from "../../utils/progress"

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, "slug")
  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: "Missing slug." })
  }

  const [problem, progress] = await Promise.all([
    getProblemBySlug(slug),
    getProgressBySlug(slug)
  ])

  if (!problem) {
    throw createError({ statusCode: 404, statusMessage: "Problem not found." })
  }

  return {
    ...problem,
    progress
  }
})
