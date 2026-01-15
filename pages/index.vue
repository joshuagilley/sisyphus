<template>
  <section class="progress-summary">
    <div class="panel">
      <h2>Progress</h2>
      <div v-if="pending">Loading progress...</div>
      <div v-else-if="!problems.length">No problems yet.</div>
      <div v-else class="progress-grid">
        <div
          v-for="item in progressSummary.byDifficulty"
          :key="item.difficulty"
          class="progress-row"
        >
          <div class="progress-label">
            <span>{{ item.difficulty }}</span>
            <span>{{ item.solved }} / {{ item.total }}</span>
          </div>
          <div class="progress-bar">
            <div
              class="progress-fill"
              :class="item.difficulty.toLowerCase()"
              :style="{ width: `${item.percent}%` }"
            />
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="layout">
    <div class="sidebar">
      <h2>Problem Set</h2>
      <div v-if="pending">Loading problems...</div>
      <div v-else-if="error">Failed to load problems.</div>
      <ul v-else class="problem-list">
        <li v-for="problem in problems" :key="problem.slug">
          <NuxtLink :to="`/problems/${problem.slug}`" class="problem-link">
            <div class="title-row">
              <span>{{ problem.title }}</span>
              <span v-if="problem.solved" class="badge solved">Solved</span>
            </div>
            <div class="meta">
              <span class="difficulty">{{ problem.difficulty }}</span>
              <span class="attempts">Attempts: {{ problem.attempts }}</span>
            </div>
          </NuxtLink>
        </li>
      </ul>
    </div>
    <div class="panel">
      <h2>Pick a problem</h2>
      <p>Select a problem to start working on it. Your progress saves in MongoDB.</p>
    </div>
  </section>
</template>

<script setup lang="ts">
type ProblemSummary = {
  slug: string
  title: string
  difficulty: string
  topicTags: string[]
  solved: boolean
  attempts: number
  updatedAt: string | null
}

const { data, pending, error } = await useFetch<ProblemSummary[]>("/api/problems")
const problems = computed(() => data.value ?? [])

const progressSummary = computed(() => {
  const totals = problems.value
  const difficulties = ["Easy", "Medium", "Hard"] as const

  const byDifficulty = difficulties.map((difficulty) => {
    const items = totals.filter((problem) => problem.difficulty === difficulty)
    const total = items.length
    const solved = items.filter((problem) => problem.solved).length
    const percent = total ? Math.round((solved / total) * 100) : 0
    return { difficulty, total, solved, percent }
  })

  return { byDifficulty }
})
</script>

<style scoped>
.layout {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 24px;
  align-items: start;
}

.progress-summary {
  margin-bottom: 24px;
}

.progress-grid {
  margin-top: 16px;
  display: grid;
  gap: 12px;
}

.progress-row {
  display: grid;
  gap: 8px;
}

.progress-label {
  display: flex;
  justify-content: space-between;
  font-weight: 600;
  color: #0f172a;
}

.progress-bar {
  width: 100%;
  height: 10px;
  border-radius: 999px;
  background: #e2e8f0;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 999px;
  background: #94a3b8;
  transition: width 0.3s ease;
}

.progress-fill.easy {
  background: #22c55e;
}

.progress-fill.medium {
  background: #f59e0b;
}

.progress-fill.hard {
  background: #ef4444;
}

.sidebar,
.panel {
  background: #ffffff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.08);
}

.problem-list {
  list-style: none;
  padding: 0;
  margin: 16px 0 0;
  display: grid;
  gap: 12px;
}

.problem-link {
  display: block;
  padding: 12px 14px;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  color: inherit;
  text-decoration: none;
}

.problem-link:hover {
  border-color: #94a3b8;
}

.title-row {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  font-weight: 600;
}

.meta {
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
  color: #64748b;
  font-size: 0.9rem;
}

.badge {
  font-size: 0.75rem;
  padding: 2px 8px;
  border-radius: 999px;
}

.solved {
  background: #dcfce7;
  color: #166534;
}
</style>
