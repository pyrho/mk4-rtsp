<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { loadPlayer } from 'rtsp-relay/browser'

// declare a ref to hold the element reference
// the name must match template ref value
const feed = ref(null)

onMounted(() => {
  if (feed.value) {
    loadPlayer({
      url: 'ws://mk4-rtsp.lan:2000/api/stream',
      canvas: feed.value
    })
  }
})

defineProps<{
  msg: string
}>()
</script>

<template>
  <canvas ref="feed"> </canvas>
</template>

<style scoped>
canvas {
  width: 500px;
}

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
