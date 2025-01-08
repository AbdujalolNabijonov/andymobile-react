import { AppRootState } from "../../../libs/types/screen";
import { createSelector } from 'reselect'
const selectMembePage = (state: AppRootState) => state.memberPage


export const chosenBankCardRetrieve = createSelector(
    selectMembePage,
    (MemberPage) => MemberPage.chosenBankCard
)

export const chosenMemberRetrieve = createSelector(
    selectMembePage,
    (MemberPage) => MemberPage.chosenMember
)

export const wishListItemsRetrieve = createSelector(
    selectMembePage,
    (MemberPage) => MemberPage.wishListItems
)

export const followersRetrieve = createSelector(
    selectMembePage,
    (MemberPage) => MemberPage.followers
)

export const followingsRetrieve = createSelector(
    selectMembePage,
    (MemberPage) => MemberPage.followings
)

export const targetBlogsRetrieve = createSelector(
    selectMembePage,
    (MemberPage) => MemberPage.targetBlogs
)
export const targetReviewsRetrieve = createSelector(
    selectMembePage,
    (MemberPage) => MemberPage.targetReviews
)

export const chosenBlogRetrieve = createSelector(
    selectMembePage,
    (MemberPage) => MemberPage.chosenBlog
)