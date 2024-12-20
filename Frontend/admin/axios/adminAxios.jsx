import axios from 'axios'
import { SERVER_URL } from '../.config/serverURL';
import {store} from '../src/redux/store'
import { addToken } from '@/redux/slices/tokenSlice';
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
      console.log('token interceptor done',config)
      return config;
      
    },
    (error)=>{
      return Promise.reject(error)
    }
  )

  instance.interceptors.response.use(
    response=>response,
    async(error)=>{
      const originalRequest=error.config;

      if(error.response.status==401 && !originalRequest._retry)
      {        
        originalRequest._retry=true;

        try{
          const refreshResponse=await instance.post('/refreshToken',{},{withCredentials:true})
          const newAccessToken=refreshResponse.data.newAccessToken
          store.dispatch(addToken(newAccessToken))
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          return instance(originalRequest);
        }catch(refreshError){
          console.log('refresh token failed',refreshError)
          window.location.href = '/';
          
          return Promise.reject(refreshError);
        }
      }
      console.log("response error " + error)
      return Promise.reject(error);
    }
  )

 

  export default instance