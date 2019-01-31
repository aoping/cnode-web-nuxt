import originAxios from 'axios'

const axios = originAxios.create({
  baseURL: 'https://cnodejs.org/api/v1',
  headers: {
      post: {
          'Content-Type': 'application/x-www-form-urlencoded'
      }
  }
})



// Add a request interceptor
axios.interceptors.request.use((config) => {
  // Do something before request is sent
  return config;
}, (error) => {
  // Do something with request error
  return Promise.reject(error);
});

// // Add a response interceptor
axios.interceptors.response.use((response) => {
  // Do something with response data
  return response && response.data
}, (error) => {
  // Do something with response error
  return error;
});


export default axios
