import {createSelector} from "reselect"
import { AppRootState } from "../../libs/types/screen"

const selectOrderPage=(state:AppRootState)=>state.orderPage


export const targetOrdersRetrieve = createSelector(
    selectOrderPage,
    (OrderPage)=>OrderPage.targetOrders
)

export const chosenOrderRetrieve = createSelector(
    selectOrderPage,
    (TrackPage)=>TrackPage.chosenOrder
)

export const chosenTargetTransactionRetrieve=createSelector(
    selectOrderPage,
    (TrackPage)=>TrackPage.chosenTargetTransaction
)

