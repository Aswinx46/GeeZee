import { createSlice } from "@reduxjs/toolkit";

const initialState={
    otp:null
}

export const otpvalidation=createSlice({
    name:"otpValidation",
    initialState,
    reducers:{
        addValidation:(state,action)=>{
            state.otp=action.payload
        }
    }
})

export const {addValidation}=otpvalidation.actions
export default otpvalidation.reducer