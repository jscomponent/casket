<template>
  <div>
    <h2>Config</h2>
    <div style="margin-bottom: 50px">
      <div v-for="setting in settings" :key="setting.key">
        <label>{{setting.label}}</label>
        <input v-model="setting.value">
        <button @click="save(setting.key, setting.value)">Save</button>
      </div>
      <div>
        <h3>Enable Google Drive Auto Backup</h3>
        <ul>
          <li>
            <a href="https://developers.google.com/workspace/guides/create-project">
              Create a project and enable the API
            </a>
          </li>
          <li>
            Enable Google Drive API
          </li>
          <li>
            Create <b>Service account</b> credential
          </li>
          <li>
            Open service account and create new Key in JSON format
          </li>
          <li>
            Encode using this tool and store as google secret
          </li>
          <li>
            Find a folder in google drive and share it with service account user
          </li>
          <li>
            Copy that folder id and paste it in here
          </li>
        </ul>
        <textarea v-model="googleJSONkey"/>
        <textarea v-model="googleJSONkeyEncoded"/>
        <button @click="encode">
          Encode
        </button>
      </div>
      <button @click="get()">Refresh</button>
    </div>
  </div>
</template>

<script>
export default {
  inject: ['io'],
  data: () => ({
    googleJSONkey: '',
    googleJSONkeyEncoded: '',
    settings: [
      {key: 'lang', value: '', label: 'Languages'},
      {key: 'google-secret', value: '', label: 'Google Secret'},
      {key: 'google-folder', value: '', label: 'Google Folder'},
      {key: 'backup-interval', value: '', label: 'Backup interval'}
    ]
  }),
  created() {
    this.get()
  },
  methods: {
    save(key, value) {
      this.io.service('settings').patch(key, { value }).then(response => {
        this.get()
      }).catch(e => {
        this.get()
      })
    },
    get() {
      this.settings.forEach(setting => {
        this.io.service('settings').get(setting.key).then(response => {
          setting.value = response
        })
      })
    },
    encode() {
      //console.log(this.googleJSONkey)
      //console.log(JSON.parse(this.googleJSONkey))
      //console.log('encoded', window.btoa(string))
      this.googleJSONkeyEncoded = window.btoa(this.googleJSONkey)
    }
  }
}
</script>

<style scoped>
</style>