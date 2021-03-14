<template>
  <img alt="Vue logo" src="./assets/logo.png">
  <table>
    <thead>
      <th>Host</th>
      <th>IP</th>
      <th>MAC</th>
    </thead>
    <tbody>
      <tr v-for="(l, i) in lists" :key="i">
          <td>{{hostname(l.lookup)}}</td>
          <td>{{l.ip}}</td>
          <td>{{l.mac}}</td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import axios from 'axios';
export default {
    data() {
      return {
          lists: [],
          url: 'http://localhost:8081/'
      }
    },
    methods: {
       hostname(string) {
          let host = '';
          let name = string.split('Name:');
          if(name[1]) {
              let ns = name[1].split('<br>');
              if(ns[0]) host = ns[0]
          }
          return host;
      },
      async load() {
        this.lists = [];
        this.lists = await axios.get(this.url)
                      .then(res => {
                        return res.data;
                      })
                      .catch((err) => {
                        alert(err);
                      })
      }
    },
    mounted() {
        this.load();
    }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
