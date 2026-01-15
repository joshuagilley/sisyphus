<template>
  <div class="app">
    <header class="header">
      <h1>Sisyphus</h1>
      <p>Personal LeetCode practice with progress tracking.</p>
    </header>
    <main class="main">
      <NuxtPage />
    </main>
  </div>
</template>

<style scoped>
.app {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  color: #0f172a;
  background: #f8fafc;
  min-height: 100vh;
}

.header {
  padding: 32px 24px 8px;
}

.main {
  padding: 16px 24px 48px;
}

p {
  margin: 4px 0 0;
  color: #475569;
}
</style>
