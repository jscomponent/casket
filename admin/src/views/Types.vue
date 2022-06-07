<template>
  <div>
    <h2>Types</h2>
    <div>
      <label>Title</label>
      <input v-if="title?.en" v-model="title.en">
      <input v-else v-model="title">
    </div>
    <div>
      <label>Slug</label>
      <input v-model="slug"/>
    </div>
    <div>
      <label>Status</label>
      <input v-model="status"/>
    </div>
    <div>
      <label>Fields</label>
      <textarea v-model="fields"/>
    </div>
    <div>
      <label>Roles</label>
      <textarea v-model="roles"/>
    </div>
    <div>
      <label>Owner field</label>
      <input v-model="owner"/>
    </div>
    <button @click="create({title, slug, status, fields, roles, owner})">Create</button>
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
        <th>Title</th>
        <th>Slug</th>
        <th>Status</th>
        <th>Fields</th>
        <th>Roles</th>
        <th>Owner</th>
        <th>Instance</th>
        <th>Created</th>
        <th>Updated</th>
        <th>Actions</th>
      </tr>
      <tr v-for="type in types" :key="type._id">
        <td>{{type._id}}</td>
        <td>
          <input v-if="type?.en?.title" v-model="type.en.title">
          <input v-else v-model="type.title">
        </td>
        <td><input v-model="type.slug"></td>
        <td><input v-model="type.status"></td>
        <td><textarea v-model="type.fields"/></td>
        <td><textarea v-model="type.roles"/></td>
        <td><input v-model="type.owner"></td>
        <td><textarea v-model="type.instance"/></td>
        <td>{{type.createdAt}}</td>
        <td>{{type.updatedAt}}</td>
        <td>
          <button @click="save(type)">Save</button>
          <button @click="remove(type)">Remove</button>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  inject: ['io'],
  emits: ['list'],
  data: () => ({
    title: '',
    slug: '',
    status: '',
    fields: '',
    roles: '',
    owner: '',
    limit: 25,
    page: 1,
    response: null,
    search: ''
  }),
  computed: {
    types() {
      return this.response?.data || []
    }
  },
  created() {
    this.list()
  },
  methods: {
    async create(object) {
      let obj = Object.assign({}, object)
      obj.fields = obj.fields ? JSON.parse(obj.fields) : {}
      obj.roles = obj.roles ? JSON.parse(obj.roles) : {}
      obj.instance = new TextEncoder().encode(obj.instance).buffer
      await this.io.service('types/any').create(obj)
      this.clear()
      this.list()
    },
    async list() {
      let response = await this.io.service('types/any').find({
        query: {
          title: { $search: this.search },
          $limit: this.limit,
          $skip: (this.page - 1) * this.limit,
          $sort: {
            createdAt: -1
          }
        }
      })
      response.data = response.data.map(t => {
        if (t.fields) t.fields = JSON.stringify(t.fields)
        if (t.roles) t.roles = JSON.stringify(t.roles)
        t.instance = new TextDecoder().decode(t.instance)
        return t
      })
      this.$emit('list')
      this.response = response
    },
    async save(type) {
      await this.io.service('types/any').patch(type._id, {
        title: type.title,
        slug: type.slug,
        status: type.status,
        fields: type.fields ? JSON.parse(type.fields) : {},
        roles: type.roles ? JSON.parse(type.roles) : {},
        instance: new TextEncoder().encode(type.instance).buffer,
        owner: type.owner
      })
      this.list()
    },
    async remove(type) {
      await this.io.service('types/any').remove(type._id)
      this.list()
    },
    clear() {
      this.title = ''
      this.slug = ''
      this.fields = ''
      this.roles = ''
      this.owner = ''
    }
  }
}
</script>

<style scoped>
</style>