import { createSlice } from "@reduxjs/toolkit";
import { OrderPage } from "../../libs/types/screen";

const initialState: OrderPage = {
    targetOrders: [],
    chosenOrder: null,
    chosenTargetTransaction:null
}


const OrderPageSlice = createSlice(
    {
        name: "OrderPage",
        initialState,
        reducers: {
            setTargetOrders: (state, action) => {
                state.targetOrders = action.payload
            },
            setChosenOrder: (state, action) => {
                state.chosenOrder = action.payload
            },
            setChosenTargetTransaction:(state,action)=>{
                state.chosenTargetTransaction=action.payload
            }
        }
    }
)

export const { setChosenOrder, setTargetOrders,setChosenTargetTransaction } = OrderPageSlice.actions
const orderPageReducer = OrderPageSlice.reducer;
export default orderPageReducer