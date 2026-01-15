export type Problem = {
  slug: string
  title: string
  difficulty: "Easy" | "Medium" | "Hard"
  topicTags: string[]
  prompt: string
  functionName: string
  params: string[]
  testCases: Array<{
    input: unknown[]
    expected: unknown
  }>
}

export type TestResult = {
  input: unknown[]
  expected: unknown
  actual: unknown
  passed: boolean
  error?: string
}

export type ProgressEntry = {
  attempts: number
  solved: boolean
  lastResult?: {
    passedAll: boolean
    results: TestResult[]
  }
  updatedAt: string
}
