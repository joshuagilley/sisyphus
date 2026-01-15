import { connectToDatabase } from "./db"
import { ProgressModel } from "./models"
import type { ProgressEntry } from "./types"

export async function getProgressEntries(): Promise<
  Array<ProgressEntry & { slug: string }>
> {
  try {
    await connectToDatabase()
    const docs = await ProgressModel.find().lean()
    return docs.map((doc) => ({
      slug: doc._id,
      attempts: doc.attempts,
      solved: doc.solved,
      lastResult: doc.lastResult,
      updatedAt: doc.updatedAt.toISOString()
    }))
  } catch (error) {
    console.error("Failed to load progress entries.", error)
    return []
  }
}

export async function getProgressBySlug(
  slug: string
): Promise<ProgressEntry | null> {
  try {
    await connectToDatabase()
    const doc = await ProgressModel.findById(slug).lean()
    if (!doc) return null

    return {
      attempts: doc.attempts,
      solved: doc.solved,
      lastResult: doc.lastResult,
      updatedAt: doc.updatedAt.toISOString()
    }
  } catch (error) {
    console.error(`Failed to load progress for ${slug}.`, error)
    return null
  }
}

export async function upsertProgress(
  slug: string,
  entry: ProgressEntry
): Promise<ProgressEntry> {
  await connectToDatabase()
  await ProgressModel.findByIdAndUpdate(
    slug,
    {
      _id: slug,
      attempts: entry.attempts,
      solved: entry.solved,
      lastResult: entry.lastResult,
      updatedAt: new Date(entry.updatedAt)
    },
    { upsert: true }
  )

  return entry
}
