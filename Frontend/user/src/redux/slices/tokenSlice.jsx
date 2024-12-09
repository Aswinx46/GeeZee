import {createSlice} from '@reduxjs/toolkit'


const initialState={
    token:''
}

export const tokenSlice=createSlice({
    name:'token',
    initialState,
    reducers:{
        addToken:(state,action)=>{
            state.token=action.payload
        },
        removeToken:(state,action)=>{
            state.token=null
        },
        
    }
})

export const {addToken,removeToken} = tokenSlice.actions
export default tokenSlice.reducer