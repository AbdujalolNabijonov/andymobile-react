import { createSlice } from "@reduxjs/toolkit";
import { HomePageState } from "../../../libs/types/screen";


const initialState: HomePageState = {
    topRandomBrands: [],
    randomNewProducts: [],
    targetHomeProducts: [],
    communityPost: []
}

const HomePageSlice = createSlice({
    name: "Home",
    initialState,
    reducers: {
        setTopRandomBrands: (state, action) => {
            state.topRandomBrands = action.payload
        },
        setRandomNewProducts: (state, action) => {
            state.randomNewProducts = action.payload
        },
        setTargetHomeProducts: (state, action) => {
            state.targetHomeProducts = action.payload
        },
        setCommunityPost: (state, action) => {
            state.communityPost = action.payload
        }
    }
})

export const {
    setTopRandomBrands,
    setCommunityPost,
    setRandomNewProducts,
    setTargetHomeProducts
} = HomePageSlice.actions
const homePageReducer = HomePageSlice.reducer
export default homePageReducer