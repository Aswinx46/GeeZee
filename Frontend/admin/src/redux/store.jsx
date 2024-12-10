import {configureStore} from '@reduxjs/toolkit'
import tokenSlice from './slices/tokenSlice'
import ProductSlice from '../redux/slices/editProductSlice'
import { persistStore,persistReducer } from 'redux-persist'
import { combineReducers } from '@reduxjs/toolkit'
import storage from 'redux-persist/lib/storage'
import variantSlice from './slices/variantSlice'
// export const store=configureStore({
//     reducer:{
//         token:tokenSlice,
//         product:ProductReducer
//     }
// })


    const persistConfig={
        key:'root',
        storage,
        blacklist:['token']
    };


    const rootReducer=combineReducers({
        token:tokenSlice,
        product:ProductSlice,
        variant:variantSlice
    })

    const persistanceReducer=persistReducer(persistConfig,rootReducer)

    export const store=configureStore({
        reducer:persistanceReducer
    })

    export const persistor=persistStore(store)
