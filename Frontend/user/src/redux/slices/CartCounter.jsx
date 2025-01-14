import { createSlice } from "@reduxjs/toolkit";

const initialState={
    count:0
}

export const cartCounterSlice=createSlice({
    name:'cart Counter',
    initialState,
    reducers:{
        incrementCounter:(state,action)=>{
            state.count=action.payload
        },
        resetCounter:(state,action)=>{
            state.count=0
        },
        justIncrementCountByOne:(state,action)=>{
            state.count=state.count+1
        }
    }
})

export const {incrementCounter,resetCounter,justIncrementCountByOne}=cartCounterSlice.actions
export default cartCounterSlice.reducer