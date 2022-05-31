import { createApp } from 'vue'
import App from './App.vue'
import router from './logic/router'
import io from './logic/feathers'

const app = createApp(App)

app.use(router, app)
app.use(io, app)

app.mount('#app')
