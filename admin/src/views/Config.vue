<template>
  <div>
    <h2>Config</h2>
    <label>Languages</label>
    <input v-model="lang">
    <button @click="save">Save</button>
    <button @click="get">Refresh</button>
  </div>
</template>

<script>
export default {
  inject: ['io'],
  data: () => ({
    lang: ''
  }),
  created() {
    this.get()
  },
  methods: {
    save() {
      this.io.service('settings').patch('lang', { value: this.lang }).then(response => {
        console.log('response from setting langstrings', response)
        this.get()
      }).catch(e => {
        console.log(e)
        this.get()
      })
    },
    get() {
      this.io.service('settings').get('lang').then(response => {
        this.lang = response
      })
    }
  }
}
</script>

<style scoped>
</style>