import axios from 'axios'
import { SERVER_URL } from '../config/serverURL';
import { store } from '../redux/store';
import { addToken } from '../redux/slices/tokenSlice';
import { toast } from 'react-toastify';
import { removeUser } from '../redux/slices/userSlice';
const instance = axios.create({
  baseURL: SERVER_URL,
  withCredentials: true
});


instance.interceptors.request.use(
  (config) => {

    const token = store.getState().token.token
    console.log(token)
    const user = store.getState().user?.user
    console.log('this is the userID', user)

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }

    if (user?._id) {
      config.headers['user_id'] = user._id
    }

    
    console.log('token interceptor done')
    return config;
    (error) => {
      return promise.reject(error)
    }
  }
)

instance.interceptors.response.use(
  response => response,
  async (error) => {
    const originalRequest = error.config;
    console.log('this is the error', error)
    if (error.response.status == 423) {
      console.log('user is blocked by admin')

      window.location.href = '/userBlockNotice';

      return Promise.reject(error)
    }

    if (error.response.status == 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshResponse = await instance.post('/refreshToken', {}, { withCredentials: true })
        const newAccessToken = refreshResponse.data.accessToken
        store.dispatch(addToken(newAccessToken))
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return instance(originalRequest);
      } catch (refreshError) {
        console.log('refresh token failed', refreshError)
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
)


export default instance