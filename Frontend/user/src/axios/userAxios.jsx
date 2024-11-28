import axios from 'axios'
import { SERVER_URL } from '../config/serverURL';
import { store } from '../redux/store'; 
const instance = axios.create({
    baseURL:SERVER_URL,
    withCredentials:true
  });

  instance.interceptors.request.use(
    (config)=>{
      const token=store.getState().token.token
      console.log(token)
      if(token)
      {
        config.headers['Authorization']=`Bearer ${token}`
      }
      console.log('token interceptor done')
      return config;
      (error)=>{
        return promise.reject(error)
      }
    }
  )


  export default instance