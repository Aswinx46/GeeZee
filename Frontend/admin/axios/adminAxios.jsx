import axios from 'axios'
import { SERVER_URL } from '../src/.config/serverURL';
const instance = axios.create({
    baseURL:SERVER_URL,
    withCredentials:true
  });

  export default instance