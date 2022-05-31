<template>
  <div>
    <h1>Login</h1>
    <div>
      <label>Administrator email</label>
      <input v-model="email"/>
    </div>
    <div>
      <label>Administrator password</label>
      <input v-model="password" type="password"/>
    </div>
    <button @click="login({email, password})">Login</button>
  </div>
</template>

<script>
export default {
  inject: ['io'],
  data: () => ({
    email: '',
    password: ''
  }),
  methods: {
    async login(creds) {
      this.io.authenticate({
        strategy: 'local',
        ...creds
      }).then(response => {
        localStorage.setItem('user', JSON.stringify(response))
        this.$router.push(localStorage.getItem('history') || '/')
      }).catch(e => {
        console.error('Authentication error', e)
        alert(e.message)
      })
    }
  }
}
</script>

<style scoped>
</style>