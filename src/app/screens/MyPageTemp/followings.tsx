import { ArrowBack, ArrowForward } from "@mui/icons-material";
import { Box, Pagination, PaginationItem, Stack } from "@mui/material";
import { Dispatch } from "@reduxjs/toolkit";
import { FollowInterface } from "../../../libs/types/member";
import { serverApi } from "../../../libs/config";
import { sweetErrorHandling, sweetTopSuccessAlert } from "../../../libs/sweetAlert";
import FollowServiceApi from "../../apiServices/followServiceApi";
import { useEffect, useState } from "react";

//Redux
import { createSelector } from "reselect"
import { setFollowings } from "./slice";
import { followingsRetrieve } from "./selector";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

//Slice
const actionDispatch = (dispatch: Dispatch) => ({
    setFollowings: (data: FollowInterface[]) => dispatch(setFollowings(data))
})


//Selector
const retrieveFollowings = createSelector(
    followingsRetrieve,
    (followings) => ({ followings })
)

const Followings = (props: any) => {
    //Initializations 
    const { followings } = useSelector(retrieveFollowings);
    const { setFollowings } = actionDispatch(useDispatch())
    const [reBuild, setRebuild] = useState<Date>(new Date())
    const { mb_id } = props
    const [objSearch, setObjSearch] = useState({
        mb_id: mb_id ? mb_id : "",
        limit: 5,
        page: 1
    })
    const history = useHistory()
    //React Hook
    useEffect(() => {
        //Calling Followings
        const followServiceApi = new FollowServiceApi()
        followServiceApi.getFollowings(objSearch).then((data: FollowInterface[]) => {
            setFollowings(data)

        }).catch(err => console.log(err))
    }, [reBuild, props.reBuild])
    //Handlers
    async function handleUnsubscribeMember(e: any, follower: FollowInterface) {
        try {
            e.stopPropagation()
            const followServiceApi = new FollowServiceApi();
            await followServiceApi.unsubscribeMember(follower.member_data._id);
            await sweetTopSuccessAlert(`Unsubscribed ${follower.member_data.mb_nick}`, 500, false);
            setRebuild(new Date())
            props.setRebuild(new Date())
        } catch (err: any) {
            await sweetErrorHandling(err)
        }
    }
    return (
        <Box>
            <div className="follow_title fs-4 fw-bold">
                {props.action_enable ? "FOLLOWERS" : "FOLLOWINGS"}
            </div>
            <Stack className="follow" alignItems={"center"}>
                <Stack gap="20px">
                    {followings[0] ?
                        followings.map((follower: FollowInterface) => {
                            const image_url = follower.member_data.mb_image ? `${serverApi}/${follower.member_data.mb_image}` : "/pictures/auth/default_user.svg"
                            return (
                                <Stack
                                    className={"follow_item"}
                                    flexDirection={"row"}
                                    justifyContent={"space-between"}
                                    alignItems={"center"}
                                    onClick={() => {
                                        history.push(`/user-page/other/?mb_id=${follower.follower_id}`)
                                        document.location.reload();
                                    }}
                                >
                                    <Stack
                                        flexDirection={"row"}
                                        alignItems={"center"}
                                        gap="15px"
                                    >
                                        <img
                                            src={image_url}
                                            alt="follow_image"
                                            style={{ borderRadius: "0 10px 0 10px", width: "auto", height: "100px" }}
                                        />
                                        <div className="follow_name fs-3 text-light fw-bold">
                                            {follower.member_data.mb_nick}
                                        </div>
                                    </Stack>
                                    <Box>
                                        {props.action_enable ? null : (
                                            <button
                                                className="btn btn-danger fw-bold fs-6"
                                                onClick={(e) => handleUnsubscribeMember(e, follower)}
                                            >
                                                <Stack
                                                    flexDirection={"row"}
                                                    gap={"10px"}
                                                    alignItems={"center"}
                                                >
                                                    <i className="fa-solid fa-user-xmark"></i>
                                                    <div>UnSubscribe</div>
                                                </Stack>
                                            </button>
                                        )}
                                    </Box>
                                </Stack>
                            )
                        }) : (
                            <div
                                className=" text-secondary rounded mb-5 fs-3 p-2"
                                style={{ backgroundColor: "#DBDDEF" }}
                            >
                                You don't have any Following Members yet
                            </div>
                        )
                    }
                </Stack>
                <Pagination
                    className="brand_pagination d-flex justify-content-center"
                    page={objSearch.page}
                    count={objSearch.page >= 3 ? objSearch.page + 1 : 3}
                    onChange={(e: any, newValue: number) => {
                        objSearch.page = newValue
                        setObjSearch({ ...objSearch })
                    }}
                    renderItem={(item) => (
                        <PaginationItem
                            components={{
                                previous: ArrowBack,
                                next: ArrowForward
                            }}
                            {...item}
                            color="secondary"
                        />
                    )}
                />
            </Stack>
        </Box>
    )
}

export default Followings