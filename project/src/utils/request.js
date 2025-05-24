import axios from 'axios'

export function request(config) {
  const instance = axios.create({
    baseURL: '/api',
    timeout:5000
  })

  instance.interceptors.request.use(config => {   
    config.headers['Content-Type'] = 'application/json'
    return config;         
  },err => {
    console.log(err);
  })

  instance.interceptors.response.use(res => {   
    return res.data         
  },err => {
    console.log(err);
  })
 
  return instance(config)  
 
} 