<script setup lang="ts">
import { ref, watchEffect, type Ref } from 'vue'
const API_URL = `http://mk4-rtsp.lan:2000/status`
const printerStatus: Ref<null | Record<any, any>> = ref(null)

watchEffect(async () => {
  printerStatus.value = await (await fetch(API_URL)).json()
})
</script>

<template>
  <div class="greetings">
    <h1 class="green">Printer Status</h1>
  </div>
  <span v-if="printerStatus" class="status"
    >Status: {{ printerStatus?.printer.state.toLowerCase() }}</span
  >
  <br />
  <span v-if="printerStatus" class="status"
    >Time remaining:
    {{ new Date(printerStatus.job.time_remaining * 1000).toISOString().substring(11, 11 + 8) }} (end
    at {{ new Date(+new Date() + printerStatus.job.time_remaining * 1000).toLocaleString() }})</span
  >
  <br />
  <ProgressBar :value="printerStatus?.job.progress"></ProgressBar>
</template>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  position: relative;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}

.greetings h1,
.greetings h3 {
  text-align: center;
}

@media (min-width: 1024px) {
  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}
</style>
