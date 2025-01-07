import { AppRootState } from "../../../libs/types/screen";
import { createSelector } from "reselect"

const selectBrandPage = (state: AppRootState) => state.brandPage

export const retrieveTargetBrands = createSelector(
    selectBrandPage,
    (brandsPage) => brandsPage.targetBrands
)

