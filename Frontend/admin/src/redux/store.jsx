import {configureStore} from '@reduxjs/toolkit'
import tokenSlice from './slices/tokenSlice'
import ProductReducer from '../redux/slices/editProductSlice'
export const store=configureStore({
    reducer:{
        token:tokenSlice,
        product:ProductReducer
    }
})