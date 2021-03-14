<template>
  <table class="table table-bordered table-sm table-striped table-dark">
    <thead>
      <th>Host</th>
      <th>IP</th>
      <th>MAC</th>
      <th>Runtime</th>
    </thead>
    <tbody>
      <tr v-for="(l, i) in lists" :key="i">
          <td class="fit-width">{{hostname(l.lookup)}}</td>
          <td>{{l.ip}}</td>
          <td>{{l.mac}}</td>
          <td>{{l.runtime}} secs ago</td>
      </tr>
    </tbody>
    <tfoot>
      <tr><td colspan="3">{{sec}}</td></tr>
    </tfoot>
  </table>
</template>

<script>
import axios from 'axios';
export default {
    data() {
      return {
          lists: [],
          url: 'http://localhost:8081/',
          interval: {},
          timeout: 10, //secs,
          sec: 1,
          runtime: {},
      }
    },
    computed: {
      getmacs() {
          return this.lists.map(element => { return element.mac; });
      },
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
        this.lists = await axios.get(this.url)
                      .then(res => {
                        return res.data;
                      })
                      .catch(() => {
                        this.lists = [];
                      });
          this.sec = 1;
      }
    },
    mounted() {
        this.load();
        setInterval(() => {
            this.sec ++;
        }, 1000);
        this.interval = setInterval(() => {
            this.load();
        }, this.timeout * 1000);
    }
}
</script>

<style>
html, body, #app {
    width: 100%;
    height: 100%;
    background: var(--dark)
}
@import url('../node_modules/bootstrap/dist/css/bootstrap.min.css');
td, th  {
    width: 1px !important;
    white-space: nowrap !important;
}
</style>
