<template>
  <div>
    <h1>Dashboard</h1>

    <nav>
      <router-link to="/admin">Profile</router-link>
      <router-link to="/admin/users">Users</router-link>
      <router-link to="/admin/types">Types</router-link>
    </nav>

    <nav>
      <router-link v-for="type in types" :key="type._id" :to="'/admin/types/' + type.slug">{{type.title}}</router-link>
    </nav>

    <router-view @list="list"/>

    <button @click="logout">Logout</button>
  </div>
</template>

<script>
export default {
  inject: ['io'],
  data: () => ({
    types: []
  }),
  created() {
    this.list()
  },
  methods: {
    logout() {
      this.$router.push('/logout')
    },
    async list() {
      let response = await this.io.service('types/any').find({
        query: {
          $limit: 100,
          $sort: {
            title: 'asc'
          }
        }
      })
      this.types = response.data
    }
  }
}
</script>

<style scoped>
nav > * {
  padding: 10px 10px 0 0;
}
</style>