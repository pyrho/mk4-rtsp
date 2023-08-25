import './assets/main.css'

import { createApp } from 'vue'
import PrimeVue from 'primevue/config'
import { createPinia } from 'pinia'
import Button from 'primevue/button'
import ProgressBar from 'primevue/progressbar'
import Skeleton from 'primevue/skeleton'

import 'primevue/resources/themes/lara-light-indigo/theme.css'

import App from './App.vue'
import router from './router'

const app = createApp(App)
app.use(PrimeVue)
app.component('Button', Button)
app.component('ProgressBar', ProgressBar)
app.component('Skeleton', Skeleton)

app.use(createPinia())
app.use(router)

app.mount('#app')
