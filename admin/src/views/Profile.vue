<template>
  <div>
    <h2>Profile</h2>
    <pre>
      {{user.user.email}}
    </pre>
  </div>
</template>

<script>
export default {
  data: () => ({
  }),
  computed: {
    user() {
      return JSON.parse(localStorage.getItem('user'))
    }
  },
  methods: {
  }
}
</script>

<style scoped>
</style>