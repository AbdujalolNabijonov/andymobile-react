import { createSelector } from "reselect"
import { AppRootState } from "../../libs/types/screen";



const selectHomePage = (state: AppRootState) => state.homePage;

export const retrieveTargetHomeProducts = createSelector(
    selectHomePage,
    (HomePage) => HomePage.targetHomeProducts
)

export const retrieveRandomProducts = createSelector(
    selectHomePage,
    (HomePage) => HomePage.randomNewProducts
)

export const retrieveTopRandomBrands = createSelector(
    selectHomePage,
    (HomePage) => HomePage.topRandomBrands
)

export const retrieveCommunityPost = createSelector(
    selectHomePage,
    (HomePage) => HomePage.communityPost
)