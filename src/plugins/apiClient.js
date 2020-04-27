export default ({ app }, inject) => {
  const apiClient = {
    get: (url) => {
      return app.$axios.get(`${process.env.FIREBASE_FUNCTIONS_ORIGIN}${url}`)
    },
    post: (url, params) => {
      return app.$axios.post(`${process.env.FIREBASE_FUNCTIONS_ORIGIN}${url}`, params)
    }
  }
  inject('apiClient', apiClient)
}
