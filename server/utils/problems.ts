import type { Problem } from "./types"
import problemsData from "~/data/problems.json"
import { connectToDatabase } from "./db"
import { ProblemModel } from "./models"

let cachedProblems: Problem[] | null = null

export async function getProblems(): Promise<Problem[]> {
  if (cachedProblems) {
    return cachedProblems
  }

  await connectToDatabase()
  const existing = await ProblemModel.find().lean()

  if (existing.length === 0) {
    const seedData = (problemsData as Problem[]).map((problem) => ({
      _id: problem.slug,
      title: problem.title,
      difficulty: problem.difficulty,
      topicTags: problem.topicTags,
      prompt: problem.prompt,
      functionName: problem.functionName,
      params: problem.params,
      testCases: problem.testCases
    }))

    if (seedData.length > 0) {
      await ProblemModel.insertMany(seedData, { ordered: false })
    }
  }

  const docs = await ProblemModel.find().lean()
  const parsed = docs.map((doc) => ({
    slug: doc._id,
    title: doc.title,
    difficulty: doc.difficulty,
    topicTags: doc.topicTags,
    prompt: doc.prompt,
    functionName: doc.functionName,
    params: doc.params,
    testCases: doc.testCases
  })) as Problem[]

  cachedProblems = parsed
  return parsed
}

export async function getProblemBySlug(slug: string): Promise<Problem | null> {
  await connectToDatabase()
  const doc = await ProblemModel.findById(slug).lean()
  if (!doc) return null

  return {
    slug: doc._id,
    title: doc.title,
    difficulty: doc.difficulty,
    topicTags: doc.topicTags,
    prompt: doc.prompt,
    functionName: doc.functionName,
    params: doc.params,
    testCases: doc.testCases
  }
}
