<script setup lang="ts">
import { ref, watchEffect } from 'vue'
const API_URL = `http://mk4-rtsp.lan:2000/list`
const files = ref(null)
watchEffect(async () => {
  // this effect will run immediately and then
  // re-run whenever currentBranch.value changes
  files.value = await (await fetch(API_URL)).json()
})

const openInNewTab = (url: string) => {
  window.open(url, '_blank', 'noreferrer')
}
</script>

<template>
  <div class="greetings">
    <h1 class="green">Timelapses</h1>
  </div>
  <ul>
    <li v-for="file in files">
      <Button
        @click="openInNewTab(`http://mk4-rtsp.lan:2000/videos/${file}/timelapse.mp4`)"
        :label="'Job:' + file"
        link
        size="small"
      />
    </li>
  </ul>
</template>

<style>
li {
  padding: 5px;
  list-style-type: none;
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
