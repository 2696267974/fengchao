import axios from 'axios'

export function request(config) {
  const instance = axios.create({
    baseURL: 'http://117.72.35.156:13333',
    timeout:5000
  })

  instance.interceptors.request.use(config => {   
    // config.headers['Content-Type'] = 'application/json'
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