import axios from 'axios'
import { store } from '../redux/store';
import { addToken } from '../redux/slices/tokenSlice';

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true
});


instance.interceptors.request.use(
  (config) => {

    const token = store.getState().token.token
    
    const user = store.getState().user?.user
    
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }

    if (user?._id) {
      config.headers['user_id'] = user._id
    }


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
    if (error.response.status == 423) {

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
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
)


export default instance