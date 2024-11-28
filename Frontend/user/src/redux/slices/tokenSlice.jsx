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
        }
    }
})

export const {addToken} = tokenSlice.actions
export default tokenSlice.reducer