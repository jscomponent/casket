<template>
  <div>
    <h1>Setup</h1>
    <div v-if="status === 'setup'">
      <label>MongoDB Connection URL</label>
      <input v-model="mongodb"/>
    </div>
    <div>
      <label>Administrator email</label>
      <input v-model="email"/>
    </div>
    <div>
      <label>Administrator password</label>
      <input v-model="password" type="password"/>
    </div>
    <button @click="setup({mongodb, email, password})">Setup</button>
  </div>
</template>

<script>
export default {
  inject: ['io'],
  data: () => ({
    mongodb: '',
    email: '',
    password: '',
    status: ''
  }),
  async created() {
    this.status = await this.io.service('settings').get('status')
  },
  methods: {
    async setup(obj) {
      let response = await this.io.service('settings').create(obj)
      if (response === 'ready') {
        localStorage.setItem('ready', true)
        this.$router.push(localStorage.getItem('history') || '/')
      } else {
        alert(response)
      }
    }
  }
}
</script>

<style scoped>
</style>