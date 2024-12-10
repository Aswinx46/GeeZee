import { createSlice } from "@reduxjs/toolkit";

const initialState={
    variant:[]
}

export const variantSlice=createSlice({
    name:'variant',
    initialState,
    reducers:{
        addVariant:(state,action)=>{
            state.variant=action.payload
        },
        removeVarient:(state,action)=>{
            state.variant=[]
        }
    }
})

export const {addVariant,removeVarient}=variantSlice.actions

export default variantSlice.actions