import { createSlice } from "@reduxjs/toolkit";
import { BrandPageState } from "../../../libs/types/screen";

const initialState: BrandPageState = {
    targetBrands: []
}

const brandPageSlice = createSlice({
    name: "brandPage",
    initialState,
    reducers: {
        setTargetBrands: (state, action) => {
            state.targetBrands = action.payload
        }
    }
})

export const {
    setTargetBrands
} = brandPageSlice.actions

const brandPageReducer = brandPageSlice.reducer
export default brandPageReducer