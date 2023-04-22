// import axios, { AxiosError, AxiosRequestConfig } from 'axios'
//
// // Define an Axios instance with default configuration
// const instance = axios.create({
//   baseURL: 'https://api.example.com',
//   timeout: 5000,
// })
//
// // Add a request interceptor to modify the request config
// instance.interceptors.request.use(
//   (config: AxiosRequestConfig) => {
//     // Add custom headers or modify the request config as needed
//     config.headers['Authorization'] = `Bearer ${localStorage.getItem('accessToken')}`
//     return config
//   },
//   (error: AxiosError) => {
//     // Handle request errors here
//     return Promise.reject(error)
//   }
// )
//
// // Add a response interceptor to handle the response data
// instance.interceptors.response.use(
//   (response) => {
//     // Handle successful responses here
//     return response
//   },
//   (error: AxiosError) => {
//     // Handle response errors here
//     return Promise.reject(error)
//   }
// )
//
// export default instance
