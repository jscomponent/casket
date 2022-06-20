<template>
  <div>
    <h2>{{instance.title?.en}}</h2>

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
        <th v-for="key in fields" :key="key">
          <span v-if="instance?.fields[key]?.title?.en">
            {{instance.fields[key].title.en}}
          </span>
          <span v-else>
            {{key}}
          </span>
        </th>
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
          slug: this.type,
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
      let query = { $or: [] }
      this.fields.forEach(field => {
        if (this.instance.fields[field].type === 'String') {
          let obj = {}
          obj[field] = { $regex: this.search }
          query.$or.push(obj)
        }
      })
      if (!query.$or.length || !this.search) delete query.$or
      let response = await this.io.service('types/' + this.type).find({
        query: {
          ...query,
          $limit: this.limit,
          $skip: (this.page - 1) * this.limit,
          $sort: {
            createdAt: -1
          }
        }
      })
      console.log(response)
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