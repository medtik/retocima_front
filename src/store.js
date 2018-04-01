import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    listado: null,
    provincias: [],
    cimas: [],
    cimeros: [],
    allCimas: null,
    patanegra: null,
    ranking: null,
    isLoggedIn: localStorage.getItem('cimero-token'),
    loggedInUser: localStorage.getItem('cimero-user')
  },
  getters: {
    loggedIn: state => {
      return state.isLoggedIn
    }
  },
  mutations: {
    listado (state, listado) {
      state.listado = listado
    },
    provincia (state, provincia) {
      if (!state.provincias.find(x => x.id === provincia.id)); state.provincias.push(provincia)
    },
    allCimas (state, list) {
      state.allCimas = list
    },
    cima (state, cima) {
      if (!state.cimas.find(x => x.id === cima.id)) state.cimas.push(cima)
    },
    cimeros (state,cimero) {
      if (!state.cimeros.find(x => x.id === cimero.id)); state.cimeros.push(cimero)
    },
    patanegra (state, patanegra) {
      state.patanegra = patanegra
    },
    ranking (state, ranking) {
      state.ranking = ranking
    },
    authCimero (state, cimero) {
      state.ranking = cimero
    }
  },

  actions: {
    login ({ commit }, creds) {
      return new Promise((resolve, reject) => {
        axios.post(process.env.API_URL + 'auth/login', creds).then(function (response) {
          localStorage.setItem('cimero-token', response.data.token)
          localStorage.setItem('cimero-user', response.data.cimero.username)
          resolve(response.data)
        }).catch(err => {
          reject(err.response.data)
        })
      })
    },

    register ({ commit }, creds) {
      return new Promise((resolve, reject) => {
        axios.post(process.env.API_URL + 'auth/register', creds).then(function (response) {
          localStorage.setItem('cimero-token', response.data.token)
          localStorage.setItem('cimero-user', response.data.cimero.username)
          resolve(response.data)
        }).catch(err => {
          reject(err.response.data)
        })
      })
    },

    logout ({ commit }) {
      localStorage.removeItem('cimero-token')
      localStorage.removeItem('cimero-user')
      return true
    },

    cimero (context, cimero) {
      this.state.cimero = cimero
    },

    cima (context, id) {
      var self = this
      return new Promise((resolve, reject) => {
        if (self.state.cimas.find(x => x.id === id)) {
          resolve(self.state.cimas.find(x => x.id === id).val)
        } else {
          axios.get(process.env.API_URL + 'cima/' + id).then(function (response) {
            self.commit('cima', {val: response.data, id: id})
            resolve(response.data)
          })
        }
      })
    },

    cimeros (context, id) {
      var self = this
      return new Promise((resolve, reject) => {
        if (self.state.cimeros.find(x => x.id === id)) {
          resolve(self.state.cimeros.find(x => x.id === id).val)
        } else {
          axios.get(process.env.API_URL + 'cimero/' + id).then(function (response) {
            self.commit('cimeros', {val: response.data, id: id})
            resolve(response.data)
          })
        }
      })
    },

    allCimas (context) {
      var self = this
      return new Promise((resolve, reject) => {
        if (self.state.allCimas) {
          resolve(self.state.allCimas)
        } else {
          axios.get(process.env.API_URL + 'cimas').then(function (response) {
            self.commit('allCimas', response.data)
            resolve(response.data)
          })
        }
      })
    },

    provincia (context, id) {
      var self = this
      return new Promise((resolve, reject) => {
        if (self.state.provincias.find(x => x.id === id)) {
          resolve(self.state.provincias.find(x => x.id === id).val)
        } else {
          axios.get(process.env.API_URL + 'cimas/' + id).then(function (response) {
            self.commit('provincia', {val: response.data, id: id})
            resolve(response.data)
          })
        }
      })
    },

    patanegra (context) {
      var self = this
      return new Promise((resolve, reject) => {
        if (self.state.patanegra) {
          resolve(self.state.patanegra)
        } else {
          axios.get(process.env.API_URL + 'patanegra').then(function (response) {
            self.commit('patanegra', response.data)
            resolve(response.data)
          })
        }
      })
    },

    listado (context, id) {
      var self = this
      return new Promise((resolve, reject) => {
        if (self.state.listado) {
          resolve(self.state.listado)
        } else {
          axios.get(process.env.API_URL + 'communidads').then(function (response) {
            self.commit('listado', response.data)
            resolve(response.data)
          })
        }
      })
    },

    ranking (context) {
      var self = this
      return new Promise((resolve, reject) => {
        if (self.state.ranking) {
          resolve(self.state.ranking)
        } else {
          axios.get(process.env.API_URL + 'ranking').then(function (response) {
            response.data.map(function (d, i) {
              d.rank = i + 1
              d.link = self.baseUrl + '/cimeropublicdetails/' + d.id
              if (d.logros_count >= 480) d.image = 'gold'
              else if (d.logros_count < 480 && d.logros_count >= 320) d.image = 'silver'
              else if (d.logros_count >= 160 && d.logros_count < 320) d.image = 'bronze'
              else d.image = null
            })
            self.commit('ranking', response.data)
            resolve(response.data)
          })
        }
      })
    },

    authCimero (context) {
      var self = this
      return new Promise((resolve, reject) => {
        if (self.state.authCimero) {
          resolve(self.state.authCimero)
        } else {
          axios.get(process.env.API_URL + 'cimero',{
            headers: {
              'Authorization': 'Bearer ' + localStorage.getItem('cimero-token'),
            }
          }).then(function (response) {
            self.commit('authCimero', response.data)
            resolve(response.data)
          }).catch(() => reject()); 
        }
      })
    },

  }
})

export default store
