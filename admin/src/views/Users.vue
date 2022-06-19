<template>
  <div>
    <h2>Users</h2>
    <div>
      <label>Email</label>
      <input v-model="email"/>
    </div>
    <div>
      <label>Password</label>
      <input v-model="password" type="password"/>
    </div>
    <div>
      <label>Locale</label>
      <input v-model="locale"/>
    </div>
    <div>
      <label>Permission</label>
      <input v-model="permission"/>
    </div>
    <div>
      <label>Owner group</label>
      <input v-model="owner_group"/>
    </div>
    <button @click="create({email, password, locale, permissions: [permission], owner_group})">Create</button>
    <button @click="clear">Clear</button>
    <button @click="list">List</button>
    <button @click="page--, list()">Prev page</button>
    <span>Page {{page}}</span>
    <button @click="page++, list()">Next page</button>

    <label>Search</label>
    <input v-model="search">

    <table>
      <tr>
        <th>ID</th>
        <th>Email</th>
        <th>Password</th>
        <th>Locale</th>
        <th>Permission</th>
        <th>Owner group</th>
        <th>Created</th>
        <th>Updated</th>
        <th>Actions</th>
      </tr>
      <tr v-for="user in users" :key="user._id">
        <td>{{user._id}}</td>
        <td><input v-model="user.email"></td>
        <td><input v-model="user.password"></td>
        <td><input v-model="user.locale"></td>
        <td><input v-model="user.permissions[0]">{{user.permissions.join(' ')}}</td>
        <td><input v-model="user.owner_group"></td>
        <td>{{user.createdAt}}</td>
        <td>{{user.updatedAt}}</td>
        <td><button @click="save(user)">Save</button></td>
        <td><button @click="remove(user)">Remove</button></td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  inject: ['io'], 
  data: () => ({
    email: '',
    owner_group: '',
    password: '',
    locale: '',
    owner_group: '',
    permission: '',
    response: null,
    search: '',
    limit: 25,
    page: 1
  }),
  computed: {
    users() {
      return this.response?.data || []
    }
  },
  created() {
    this.list()
  },
  methods: {
    async create(obj) {
      await this.io.service('users').create(obj)
      this.clear()
      this.list()
    },
    async list() {
      let response = await this.io.service('users').find({
        query: {
          email: { $search: this.search },
          $limit: this.limit,
          $skip: (this.page - 1) * this.limit,
          $sort: {
            createdAt: -1
          }
        }
      })
      this.response = response
    },
    async save(user) {
      let usr = Object.assign({}, user)
      if (!usr.password) delete usr.password
      if (usr.password && usr.password.length < 6) {
        alert('Too short password!')
        return
      }
      await this.io.service('users').patch(usr._id, usr)
      this.list()
    },
    async remove(user) {
      await this.io.service('users').remove(user._id)
      this.list()
    },
    clear() {
      this.email = ''
      this.owner_group = ''
      this.password = ''
      this.locale = ''
      this.permission = ''
    }
  }
}
</script>

<style scoped>
</style>