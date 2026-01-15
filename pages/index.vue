<template>
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
      <p>Select a problem to start working on it. Your progress saves locally.</p>
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
</script>

<style scoped>
.layout {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 24px;
  align-items: start;
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
