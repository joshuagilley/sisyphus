<template>
  <div v-if="pending" class="panel">Loading problem...</div>
  <div v-else-if="error" class="panel">Problem not found.</div>
  <section v-else class="problem-layout">
    <div class="panel">
      <NuxtLink to="/" class="back-link">← Back to list</NuxtLink>
      <h2>{{ problem.title }}</h2>
      <p class="difficulty">{{ problem.difficulty }}</p>
      <p class="prompt">{{ problem.prompt }}</p>

      <div class="tags">
        <span v-for="tag in problem.topicTags" :key="tag">{{ tag }}</span>
      </div>

      <div class="tests">
        <h3>Test Cases</h3>
        <ul>
          <li v-for="(testCase, index) in problem.testCases" :key="index">
            <div><strong>Input:</strong> {{ formatValue(testCase.input) }}</div>
            <div><strong>Expected:</strong> {{ formatValue(testCase.expected) }}</div>
          </li>
        </ul>
      </div>
    </div>

    <div class="panel">
      <h3>Solution</h3>
      <div class="signature">
        function {{ problem.functionName }}({{ problem.params.join(", ") }}) &#123;
      </div>
      <textarea v-model="solutionBody" rows="10" spellcheck="false" />
      <div class="signature">&#125;</div>

      <div class="actions">
        <button :disabled="submitting" @click="runSolution">
          {{ submitting ? "Running..." : "Run Tests" }}
        </button>
        <span v-if="progress" class="progress">
          Attempts: {{ progress.attempts }} ·
          {{ progress.solved ? "Solved" : "Not solved yet" }}
        </span>
      </div>

      <div v-if="results" class="results">
        <h3>Results</h3>
        <p :class="results.passedAll ? 'passed' : 'failed'">
          {{ results.passedAll ? "All tests passed!" : "Some tests failed." }}
        </p>
        <ul>
          <li v-for="(result, index) in results.results" :key="index">
            <div><strong>Input:</strong> {{ formatValue(result.input) }}</div>
            <div><strong>Expected:</strong> {{ formatValue(result.expected) }}</div>
            <div><strong>Actual:</strong> {{ formatValue(result.actual) }}</div>
            <div v-if="result.error" class="error">{{ result.error }}</div>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
type Problem = {
  slug: string
  title: string
  difficulty: string
  topicTags: string[]
  prompt: string
  functionName: string
  params: string[]
  testCases: Array<{ input: unknown[]; expected: unknown }>
  progress: Progress | null
}

type TestResult = {
  input: unknown[]
  expected: unknown
  actual: unknown
  passed: boolean
  error?: string
}

type SubmitResult = {
  passedAll: boolean
  results: TestResult[]
  progress: Progress
}

type Progress = {
  attempts: number
  solved: boolean
  solutionText?: string
  lastResult?: {
    passedAll: boolean
    results: TestResult[]
  }
  updatedAt: string
}

const route = useRoute()
const slug = route.params.slug as string

const { data, pending, error } = await useFetch<Problem>(`/api/problems/${slug}`)
const problem = computed(() => data.value as Problem)

const solutionBody = ref("// write your solution here")
const submitting = ref(false)
const results = ref<SubmitResult | null>(null)
const progress = ref<Progress | null>(null)

watchEffect(() => {
  if (data.value?.progress) {
    progress.value = data.value.progress
  }
})

watchEffect(() => {
  if (data.value?.progress?.solutionText) {
    solutionBody.value = data.value.progress.solutionText
  }
})

const runSolution = async () => {
  if (!problem.value) return
  submitting.value = true
  try {
    const response = await $fetch<SubmitResult>("/api/submit", {
      method: "POST",
      body: {
        slug: problem.value.slug,
        solutionBody: solutionBody.value
      }
    })
    results.value = response
    progress.value = response.progress
  } finally {
    submitting.value = false
  }
}

const formatValue = (value: unknown) => {
  if (typeof value === "string") return value
  return JSON.stringify(value)
}
</script>

<style scoped>
.problem-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  align-items: start;
}

.panel {
  background: #ffffff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.08);
}

.back-link {
  display: inline-block;
  margin-bottom: 12px;
  color: #2563eb;
  text-decoration: none;
}

.difficulty {
  font-weight: 600;
  color: #0f766e;
}

.prompt {
  margin-top: 12px;
  color: #475569;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 16px 0;
}

.tags span {
  background: #e2e8f0;
  color: #1f2937;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 0.8rem;
}

.tests ul,
.results ul {
  list-style: none;
  padding: 0;
  margin: 12px 0 0;
  display: grid;
  gap: 12px;
}

.tests li,
.results li {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 10px;
}

.signature {
  font-family: "SFMono-Regular", ui-monospace, SFMono-Regular, Menlo, Monaco, monospace;
  color: #475569;
  font-size: 0.9rem;
}

textarea {
  width: 100%;
  margin: 8px 0;
  border: 1px solid #cbd5f5;
  border-radius: 8px;
  padding: 12px;
  font-family: "SFMono-Regular", ui-monospace, SFMono-Regular, Menlo, Monaco, monospace;
  font-size: 0.9rem;
  min-height: 220px;
}

.actions {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 12px;
}

button {
  border: none;
  padding: 10px 16px;
  border-radius: 8px;
  background: #2563eb;
  color: #ffffff;
  font-weight: 600;
  cursor: pointer;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.progress {
  color: #64748b;
  font-size: 0.9rem;
}

.results {
  margin-top: 24px;
}

.passed {
  color: #16a34a;
  font-weight: 600;
}

.failed {
  color: #dc2626;
  font-weight: 600;
}

.error {
  color: #dc2626;
  margin-top: 6px;
  font-size: 0.9rem;
}
</style>
