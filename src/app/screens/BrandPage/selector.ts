import { createSelector } from "reselect"
import { AppRootState } from "../../libs/types/screen"

const selectBrandPage = (state: AppRootState) => state.brandPage

export const retrieveTargetBrands = createSelector(
    selectBrandPage,
    (brandsPage) => brandsPage.targetBrands
)

