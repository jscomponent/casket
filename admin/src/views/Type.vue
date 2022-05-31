<template>
  <div>
    <h2>{{instance.title}}</h2>

    <button @click="remove(type)">Add</button>

    <h3>Fields</h3>
    <table>
      <tr>
        <th>Key</th>
        <th>Type</th>
        <th>Actions</th>
      </tr>
      <tr v-for="key in fields" :key="key">
        <td><input :value="key"></td>
        <td><input v-model="instance.fields[key]"></td>
        <td>
          <button @click="save(type)">Save</button>
          <button @click="remove(type)">Remove</button>
        </td>
      </tr>
    </table>

    <h3>Data</h3>

    <div v-for="key in fields" :key="key">
      <label>{{key}}</label>
      <input v-model="obj[key]"/>
    </div>

    <button @click="create(obj)">Create</button>
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
        <th v-for="key in fields" :key="key">{{key}}</th>
        <th>Created</th>
        <th>Updated</th>
        <th>Actions</th>
      </tr>
      <tr v-for="row in table" :key="row._id">
        <td>{{row._id}}</td>
        <td v-for="key in fields" :key="key">
          <input v-if="row[key]?.en" v-model="row[key].en">
          <input v-else v-model="row[key]">
        </td>
        <td>{{row.createdAt}}</td>
        <td>{{row.updatedAt}}</td>
        <td>
          <button @click="save(row)">Save</button>
          <button @click="remove(row)">Remove</button>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  props: ['type'],
  inject: ['io'], 
  data: () => ({
    obj: {},
    title: '',
    slug: '',
    limit: 25,
    page: 1,
    response: null,
    responseRow: null,
    search: ''
  }),
  computed: {
    instance() {
      return this.response?.data[0] || {}
    },
    fields() {
      return this.instance?.fields
        ? Object.keys(this.instance?.fields)
        : []
    },
    table() {
      return this.responseRow?.data || []
    }
  },
  created() {
    this.list()
  },
  watch: {
    type() {
      this.list()
    }
  },
  methods: {
    async list() {
      let response = await this.io.service('types/any').find({
        query: {
          $limit: this.limit,
          $skip: (this.page - 1) * this.limit,
          $sort: {
            createdAt: -1
          }
        }
      })
      this.response = response
      this.listRow()
    },
    async listRow() {
      let response = await this.io.service('types/' + this.type).find({
        query: {
          title: { $search: this.search },
          $limit: this.limit,
          $skip: (this.page - 1) * this.limit,
          $sort: {
            createdAt: -1
          }
        }
      })
      console.log('list row', response)
      this.responseRow = response
    },
    async create(obj) {
      await this.io.service('types/' + this.type).create(obj)
      this.clear()
      this.list()
    },
    async save(obj) {
      await this.io.service('types/' + this.type).patch(obj._id, obj)
      this.list()
    },
    async remove(obj) {
      await this.io.service('types/' + this.type).remove(obj._id)
      this.list()
    },
    clear() {
      this.obj = {}
    }
  }
}
</script>

<style scoped>
</style>