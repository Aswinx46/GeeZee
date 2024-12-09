import {configureStore} from '@reduxjs/toolkit'
import tokenSlice from './slices/tokenSlice'
import userSlice from './slices/userSlice'
import { persistStore,persistReducer } from 'redux-persist'
import { combineReducers } from '@reduxjs/toolkit'
import storage from 'redux-persist/lib/storage'
import OtpSlice from './slices/OtpCheck'
const persistConfig={
    key:'root',
    storage,
    blacklist: ['token','otpCheck'],  
}

const rootReducer=combineReducers({
    token:tokenSlice,
    user:userSlice,
    otpCheck:OtpSlice

})

const persistedReducer =persistReducer(persistConfig,rootReducer)

export const store=configureStore({
    reducer:persistedReducer ,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
            },
        }),
})

export const persistor=persistStore(store)

