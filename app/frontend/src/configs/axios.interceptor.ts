import axios from 'axios'

const TIMEOUT = 60 * 1000
axios.defaults.timeout = TIMEOUT
// axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL
// axios.defaults.baseURL = "http://64.226.97.1:3000/"
axios.defaults.baseURL = "http://localhost:3001/"

const setupAxiosInterceptors = (onUnauthenticated: any) => {
  const onRequestSuccess = (config: any) => {
    // console.log('config', config)
    // let token = localStorage.getItem('access_token')
    // const persist = localStorage.getItem('persist:auth')
    // config.headers.Authorization = `Bearer ${token}`
    return config
  }
  const onResponseSuccess = (response: any) => response
  const onResponseError = (err: any) => {
    const status = err.status || (err.response ? err.response.status : 0)
    if (status === 403 || status === 401) {
      // onUnauthenticated()
    }
    return Promise.reject(err)
  }
  axios.interceptors.request.use(onRequestSuccess)
  axios.interceptors.response.use(onResponseSuccess, onResponseError)
}

export default setupAxiosInterceptors
