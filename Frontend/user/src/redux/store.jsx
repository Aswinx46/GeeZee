import {configureStore} from '@reduxjs/toolkit'
import tokenSlice from './slices/tokenSlice'
import userSlice from './slices/userSlice'
import { persistStore,persistReducer } from 'redux-persist'
import { combineReducers } from '@reduxjs/toolkit'
import storage from 'redux-persist/lib/storage'
import CryptoJS from 'crypto-js';
// export const store=configureStore({
//     reducer:{
//         token:tokenSlice,
//         user:userSlice
//     }
// })



const persistConfig={
    key:'root',
    storage,
    blacklist: ['token'],  
}

const rootReducer=combineReducers({
    token:tokenSlice,
    user:userSlice
})

const persistenceReducer=persistReducer(persistConfig,rootReducer)

export const store=configureStore({
    reducer:persistenceReducer
})

export const persistor=persistStore(store)

