import { TabContext, TabPanel } from "@mui/lab"
import { Box, Stack, Tab, Tabs } from "@mui/material"
import { MyAccount } from "./myAccount"
import BankTransition from "./bankTransition"
import WishList from "./wishList"
import Posts from "./posts"
import { TuiEditor } from "../../components/tuiEditor/tuiEditor"
import { useEffect, useState } from "react"
import { verifiedMemberData } from "../../apiServices/verified"
import { sweetErrorHandling, sweetFailureProvider } from "../../../lib/sweetAlert"
import Definer from "../../../lib/Definer"
import Followers from "./followers"
import Followings from "./followings"

//Redux
import { createSelector } from "reselect";
import { MemberServiceApi } from "../../apiServices/memberServiceApi"
import { Dispatch, createSlice } from "@reduxjs/toolkit"
import { Member } from "../../types/member"
import { setChosenBlog, setChosenMember, setTargetReviews } from "./slice"
import { chosenBlogRetrieve, chosenMemberRetrieve, targetBlogsRetrieve, targetReviewsRetrieve } from "./selector"
import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import { ViewerPage } from "../../components/tuiEditor/tuiViewer"
import { Blog } from "../../types/blog"
import CommunityServiceApi from "../../apiServices/communityServiceApi"
import { Review } from "../../types/review"

//Slice
const actionDispatch = (dispatch: Dispatch) => ({
    setChosenMember: (data: Member) => dispatch(setChosenMember(data)),
    setChosenBlog: (data: Blog) => dispatch(setChosenBlog(data)),
    setTargetReviews: (data: Review[]) => dispatch(setTargetReviews(data))
})
//selector
const retrieveChosenMember = createSelector(
    chosenMemberRetrieve,
    (chosenMember) => ({ chosenMember })
)

const chosenBlogRetriever = createSelector(
    chosenBlogRetrieve,
    (chosenBlog) => ({ chosenBlog })
)
const retrieveTargetReviews = createSelector(
    targetReviewsRetrieve,
    (targetReviews) => ({ targetReviews })
)

export const MyPage = (props: any) => {
    //Initilizations
    const [value, setValue] = useState<string>("1");
    const { setChosenMember, setChosenBlog, setTargetReviews } = actionDispatch(useDispatch());
    const { chosenMember } = useSelector(retrieveChosenMember);
    const { chosenBlog } = useSelector(chosenBlogRetriever);
    const { targetReviews } = useSelector(retrieveTargetReviews)
    const [reBuild, setRebuild] = useState<Date>(new Date());
    let localValue: any;
    //React Hook
    useEffect(() => {
        const localValueJson: any = localStorage.getItem("value")
        localValue = JSON.parse(localValueJson)
        if (localValue?.value) {
            setValue(localValue.value.toString())
            props.setRebuild(new Date())
        }
        if (!verifiedMemberData) {
            sweetFailureProvider(Definer.auth_err1, false, true)
        }

        //Calling chosenMember
        const memberServiceApi = new MemberServiceApi();
        memberServiceApi.getChosenMember(verifiedMemberData?._id).then(data => setChosenMember(data)).catch(err => console.log(err))
        return () => {
            localStorage.setItem("value", JSON.stringify(null))
        }
    }, [reBuild])

    async function handleChosenBlogData(id: string) {
        try {
            const communityServiceApi = new CommunityServiceApi()
            const chosenBlog = await communityServiceApi.getChosenBlog(id)
            setChosenBlog(chosenBlog)

            setValue("4")
        } catch (err: any) {
            await sweetErrorHandling(err)
        }
    }

    async function handleTargetReviews(id: string) {
        try {
            const communityServiceApi = new CommunityServiceApi()
            const targetReviews = await communityServiceApi.getProductReviews(id)
            setTargetReviews(targetReviews)
        } catch (err: any) {
            await sweetErrorHandling(err)
        }
    }
    //HANDLERS
    function handleValue(order: string) {
        setValue(order)
    }
    return (
        <Box>
            <Box className="myPage">
                <TabContext value={value}>
                    <Stack className="container" flexDirection={"row"}>
                        <Stack
                            className="setting_controller"
                            flexDirection={"column"}
                            alignItems={"center"}
                        >
                            <div className="user_info">
                                <div className="user_type text-danger fw-bold">{verifiedMemberData?.mb_type}</div>
                                <button className="user_logout btn"><img src="/icons/exit.png" alt="" /></button>
                                <div className="user_img">
                                    <img
                                        src={verifiedMemberData?.mb_image}
                                        alt="..."
                                        style={{ borderRadius: "50%" }}
                                    />
                                </div>
                            </div>
                            <div className="user_name fs-1 fw-bold">{chosenMember?.mb_nick}</div>
                            <div className=" text-secondary fs-6 fw-bold">{chosenMember?.mb_email}</div>
                            <Stack
                                flexDirection={"row"}
                                justifyContent={"space-between"}
                                gap={"20px"}
                                className="mt-2"
                            >
                                <div className="fw-bold text-dark">
                                    <span className="text-secondary me-1">Followers:</span>
                                    {chosenMember?.mb_followers}
                                </div>
                                <div className="fw-bold text-dark">
                                    <span className="text-secondary me-1">Followings:</span>
                                    {chosenMember?.mb_followings}
                                </div>
                            </Stack>
                            <Tabs
                                orientation="vertical"
                                className="settings_items"
                            >
                                <Stack
                                    className={value == "1" ? "chosenSet controller_tab" : "controller_tab"}
                                    flexDirection={"row"}
                                    style={value == "1" ? { borderLeft: "4px solid black", backgroundColor: "white" } : {}}
                                    onClick={() => handleValue("1")} alignItems={"center"}
                                    sx={{ padding: "0 0 0 10px" }}
                                >
                                    <i className="fa-solid fa-user fs-3"></i>
                                    <Tab value="1" label="User Account" />
                                </Stack>
                                <Stack
                                    className={value == "2" ? "chosenSet controller_tab" : "controller_tab"}
                                    flexDirection={"row"}
                                    style={value == "2" ? { borderLeft: "4px solid black", backgroundColor: "white" } : {}}
                                    onClick={() => handleValue("2")}
                                    alignItems={"center"}
                                    sx={{ padding: "0 0 0 10px" }}
                                >
                                    <i className={"fa-solid fa-piggy-bank fs-3"}></i>
                                    <Tab value="2" label="Bank cards" />
                                </Stack>
                                <Stack
                                    className={value == "3" ? "chosenSet controller_tab" : "controller_tab"}
                                    flexDirection={"row"}
                                    style={value == "3" ? { borderLeft: "4px solid black", backgroundColor: "white" } : {}}
                                    onClick={() => handleValue("3")}
                                    alignItems={"center"}
                                    sx={{ padding: "0 0 0 10px" }}
                                >
                                    <i className="fa-solid fa-basket-shopping fs-3"></i>
                                    <Tab value="3" label="wish list" />
                                </Stack>
                                <Stack
                                    className={value == "5" ? "chosenSet controller_tab" : "controller_tab"}
                                    flexDirection={"row"}
                                    style={value == "5" ? { borderLeft: "4px solid black", backgroundColor: "white" } : {}}
                                    onClick={() => handleValue("5")}
                                    alignItems={"center"}
                                    sx={{ padding: "0 0 0 10px" }}
                                >
                                    <i className="fa-solid fa-users fs-3"></i>
                                    <Tab value="5" label="followers" />
                                </Stack>
                                <Stack
                                    className={value == "6" ? "chosenSet controller_tab" : "controller_tab"}
                                    flexDirection={"row"}
                                    style={value == "6" ? { borderLeft: "4px solid black", backgroundColor: "white" } : {}}
                                    onClick={() => handleValue("6")}
                                    alignItems={"center"}
                                    sx={{ padding: "0 0 0 10px" }}
                                >
                                    <i className="fa-solid fa-user-plus fs-3"></i>
                                    <Tab value="6" label="followings" />
                                </Stack>
                                <Stack
                                    className={value == "7" ? "chosenSet controller_tab" : "controller_tab"}
                                    flexDirection={"row"}
                                    style={value == "7" ? { borderLeft: "4px solid black", backgroundColor: "white" } : {}}
                                    onClick={() => handleValue("7")}
                                    alignItems={"center"}
                                    sx={{ padding: "0 0 0 10px" }}
                                >
                                    <i className="fa-solid fa-message fs-3"></i>
                                    <Tab value="7" label="posts" />
                                </Stack>
                                <Stack
                                    className={value == "8" ? "chosenSet controller_tab" : "controller_tab"}
                                    flexDirection={"row"}
                                    style={value == "8" ? { borderLeft: "4px solid black", backgroundColor: "white" } : {}}
                                    onClick={() => handleValue("8")}
                                    alignItems={"center"}
                                    sx={{ padding: "0 0 0 10px" }}
                                >
                                    <i className="fa-solid fa-signature fs-3"></i>
                                    <Tab value="8" label="Write a post" />
                                </Stack>
                            </Tabs>
                        </Stack>
                        <TabPanel value={"1"} className={"account_info"}>
                            <MyAccount />
                        </TabPanel>
                        <TabPanel value={"2"} className={"account_info"}>
                            <BankTransition />
                        </TabPanel>
                        <TabPanel value={"3"} className={"account_info"}>
                            <WishList reBuild={props.reBuild} setRebuild={props.setRebuild} />
                        </TabPanel>
                        <TabPanel value="4">
                            <ViewerPage
                                setChosenBlog={setChosenBlog}
                                chosenBlog={chosenBlog}
                                targetReviews={targetReviews}
                            />
                        </TabPanel>
                        <TabPanel value={"5"} className={"account_info"}>
                            <Followers
                                action_enable={true}
                                setRebuild={setRebuild}
                            />
                        </TabPanel>
                        <TabPanel value={"6"} className={"account_info"}>
                            <Followings
                                action_enable={false}
                                setRebuild={setRebuild}
                            />
                        </TabPanel>
                        <TabPanel value={"7"} className={"account_info"}>
                            <Posts
                                mb_id={chosenMember?._id}
                                handleChosenBlogData={handleChosenBlogData}
                                handleTargetReviews={handleTargetReviews}
                            />
                        </TabPanel>
                        <TabPanel value={"8"} className={"account_info"}>
                            <TuiEditor />
                        </TabPanel>
                    </Stack>
                </TabContext>
            </Box>
        </Box>
    )
}