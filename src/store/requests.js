import axios from 'axios';


export const doRequest = (store, { url, mutation, params, resolveMutation, callback }) => {
  return new Promise((resolve, reject) => {
    axios.get(process.env.API_URL + url).then(function (response) {
      if (mutation) store.commit(mutation, {data: response.data, params: params})
      var data = callback ? callback(response.data) : response.data
      resolve(data)
    }).catch(err => {
      // Change page depending where we are
      reject(err.response.data)
    })
  })
}

export const doLoginRequest = (store, { method, url, data, mutation, params }) => {
  return new Promise((resolve, reject) => {
    axios({
      method: method,
      url: process.env.API_URL + url,
      data: data
    }).then(response => {
      store.commit(mutation, {data: response.data, params: params})
      resolve(response.data)
    }).catch(err => {
      reject(err.response.data)
    })
  })
}

/* Checks jwt */
export const doAuthRequest = (store, { method, url, data, mutation, params, logout, callback }) => {
  return new Promise((resolve, reject) => {
    axios({
      method: method,
      url: process.env.API_URL + url,
      data: data,
      headers: {'Authorization': 'Bearer ' + localStorage.getItem('cimero-token') },
    }).then(response => {
      if(mutation) store.commit(mutation, {data: response.data, params: params})
      var data = callback ? callback(response.data) : response.data
      resolve(data)
    }).catch(err => {
      // also need to redirect here in case of a 401
      // Although there are some form functions
      if (logout) {
        // This won't work
        store.commit("loggedOut")
        // redirect
      } else {
        reject(err.response.data)
      }
    })
  })
}

/* Carries out token request */
export const doRefreshTokenRequest = (store) => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'get',
      url: process.env.API_URL + 'auth/refresh',
      headers: {'Authorization': 'Bearer ' + localStorage.getItem('cimero-token')},
    }).then(response => {
      localStorage.setItem('cimero-token',response.data.token)
      store.commit("refresh",response.data.token)
      resolve()
    }).catch(err => {
      localStorage.removeItem('cimero-token')
      reject()
    })
  })
}