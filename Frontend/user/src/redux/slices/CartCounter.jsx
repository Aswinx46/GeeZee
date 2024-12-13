import { createSlice } from "@reduxjs/toolkit";

const initialState={
    count:0
}

export const cartCounterSlice=createSlice({
    name:'cart Counter',
    initialState,
    reducers:{
        incrementCounter:(state,action)=>{
            state.count=state.count+1
        },
        decrementCounter:(state,action)=>{
            state.count=state.count-1
        }
    }
})

export const {incrementCounter,decrementCounter}=cartCounterSlice.actions
export default cartCounterSlice.reducer