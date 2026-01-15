import mongoose, { Schema } from "mongoose"
import type { TestResult } from "./types"

type ProgressDocument = {
  _id: string
  attempts: number
  solved: boolean
  solutionText?: string
  lastResult?: {
    passedAll: boolean
    results: TestResult[]
  }
  updatedAt: Date
}

type SubmissionDocument = {
  problemId: string
  solutionText: string
  passedAll: boolean
  createdAt: Date
}

const TestResultSchema = new Schema<TestResult>(
  {
    input: [Schema.Types.Mixed],
    expected: Schema.Types.Mixed,
    actual: Schema.Types.Mixed,
    passed: Boolean,
    error: String
  },
  { _id: false }
)

const ProgressSchema = new Schema<ProgressDocument>(
  {
    _id: { type: String, required: true },
    attempts: { type: Number, required: true, default: 0 },
    solved: { type: Boolean, required: true, default: false },
    solutionText: { type: String },
    lastResult: {
      passedAll: Boolean,
      results: [TestResultSchema]
    },
    updatedAt: { type: Date, required: true }
  },
  {
    collection: "sisyphus"
  }
)

const SubmissionSchema = new Schema<SubmissionDocument>(
  {
    problemId: { type: String, required: true },
    solutionText: { type: String, required: true },
    passedAll: { type: Boolean, required: true },
    createdAt: { type: Date, required: true }
  },
  {
    collection: "submissions"
  }
)

export const ProgressModel =
  mongoose.models.Progress ||
  mongoose.model<ProgressDocument>("Progress", ProgressSchema)

export const SubmissionModel =
  mongoose.models.Submission ||
  mongoose.model<SubmissionDocument>("Submission", SubmissionSchema)
