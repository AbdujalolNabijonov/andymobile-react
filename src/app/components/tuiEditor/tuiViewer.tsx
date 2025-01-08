import React, { useEffect, useState } from "react"
import { Box, Stack } from "@mui/material"
import { Viewer } from "@toast-ui/react-editor"
import "@toast-ui/editor/dist/toastui-editor.css"
import ReviewWriting from "../../screens/ProductsPage/reviewWriting"
import ProductReview from "../../screens/ProductsPage/productReview"

//Redux
import { createSelector } from "reselect"
import { chosenBlogRetrieve, targetReviewsRetrieve } from "../../screens/MyPage/selector"
import { useDispatch, useSelector } from "react-redux"
import CommunityServiceApi from "../../apiServices/communityServiceApi"
import { Dispatch } from "@reduxjs/toolkit"
import { Review } from "../../../libs/types/review"
import { setTargetReviews } from "../../screens/MyPage/slice"


//Slice
const actionDispatch = (dispatch: Dispatch) => ({
    setTargetReviews: (data: Review) => dispatch(setTargetReviews(data)),
})

//Selector
const retrieveTargetReviews = createSelector(
    targetReviewsRetrieve,
    (targetReviews) => ({ targetReviews })
)
const retrieveChosenBlog = createSelector(
    chosenBlogRetrieve,
    (chosenBlog) => ({ chosenBlog })
)
export const ViewerPage = () => {
    //Initializations
    const { targetReviews } = useSelector(retrieveTargetReviews)
    const { setTargetReviews } = actionDispatch(useDispatch())
    const { chosenBlog } = useSelector(retrieveChosenBlog);
    const [rebuildReview, setRebuildReview] = useState<Date>(new Date())

    //three circle React Hook
    useEffect(() => {
        const communityServiceApi = new CommunityServiceApi();
        //@ts-ignore
        communityServiceApi.getProductReviews(chosenBlog?._id).then(data => setTargetReviews(data)).catch(err => console.log(err))
    }, [rebuildReview])
    return (
        <Box
            style={{
                padding: "30px",
                borderRadius: "20px",
                boxShadow: "0 0 10px black",
                width: "800px",
                backgroundColor: "rgb(241, 238, 238)"
            }}
        >
            <div className="fw-bold text-center fs-2">Single Article</div>
            <div className="text-center fw-bold fs-3">{chosenBlog?.blog_title}</div>
            <Stack
                alignItems={"center"}
            >
                <Viewer
                    //@ts-ignore
                    initialValue={chosenBlog?.blog_context}
                    height="600px"
                />
            </Stack>
            {
                targetReviews && targetReviews[0] ? (
                    <ProductReview
                        reviews={targetReviews}
                    />
                ) : (
                    <div
                        className="p-2 rounded text-center fw-bold text-secondary"
                        style={{ backgroundColor: "#EAEAEA" }}
                    >
                        This Product has not been reviewed yet. Be First and leave a comment
                    </div>
                )
            }
            <ReviewWriting title_enabled={false} product_id={chosenBlog?._id} setRebuildReview={setRebuildReview} item_group={"COMMUNITY"} />
        </Box>
    )
}