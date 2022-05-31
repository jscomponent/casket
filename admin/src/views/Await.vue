<template>
  <div>
    Trying to connect to server
  </div>
</template>

<script>
export default {
  inject: ['io'],
  data: () => ({
  }),
  created() {
    let interval = setInterval(() => {
      this.io.service('settings').get('status').then(response => {
        clearInterval(interval)
        if (response === 'ready') {
          localStorage.setItem('ready', true)
          this.$router.push(localStorage.getItem('history') || '/')
        } else if (response === 'setup') {
          localStorage.setItem('ready', false)
          this.$router.push('/setup')
        }
      }).catch(e => {
        localStorage.removeItem('ready')
      })
    }, 1000)
  },
  methods: {
  }
}
</script>

<style scoped>
</style>