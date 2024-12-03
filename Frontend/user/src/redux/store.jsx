import {configureStore} from '@reduxjs/toolkit'
import tokenSlice from './slices/tokenSlice'
import userSlice from './slices/userSlice'
export const store=configureStore({
    reducer:{
        token:tokenSlice,
        user:userSlice
    }
})