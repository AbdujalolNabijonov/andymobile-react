import { ArrowBack, ArrowForward, Comment, FavoriteTwoTone, RemoveRedEye } from "@mui/icons-material"
import { Pagination, PaginationItem, Stack } from "@mui/material"
import { Blog } from "../../../libs/types/blog"
import { serverApi } from "../../../libs/config"
import Moment from "react-moment"
import { sweetTopSmallSuccessAlert } from "../../../libs/sweetAlert"
import CommunityServiceApi from "../../apiServices/communityServiceApi"
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { verifiedMemberData } from "../../apiServices/verified"

export const TargetPosts = (props: any) => {

    //Handlers
    async function handleDeletePost(blog_id: string) {
        try {
            const communityServiceApi = new CommunityServiceApi();
            await communityServiceApi.removeChosenBlog(blog_id)
            await sweetTopSmallSuccessAlert("Successfully Deleted!", 500, false);
            props.setRebuildBlog(new Date())
        } catch (err: any) {
            await sweetTopSmallSuccessAlert(err)
        }
    }
    function handleAlertConfirmation(e: any, blog_id: string) {
        e.stopPropagation()
        let result = false
        confirmAlert({
            title: "Confirm to delete",
            message: "Are you sure to delete this blog",
            buttons: [
                {
                    label: "Yes",
                    onClick: async () => await handleDeletePost(blog_id)
                },
                {
                    label: "No",
                }
            ]
        })
        return result
    }
    return (
        <Stack
            className=" mt-5"
            alignItems={"center"}
            alignContent={"start"}
        >
            {
                props.targetBlogs[0] ? (
                    <Stack gap={"20px"}>
                        {props.targetBlogs.map((blog: Blog, index: number) => {
                            //@ts-ignore
                            const blog_image = blog.blog_images[0] ? `${serverApi}/${blog.blog_images[0]}` : "/pictures/community/default_article.svg"
                            const user_url = blog.mb_data.mb_image ? `${serverApi}/${blog.mb_data.mb_image}` : "/pictures/auth/default_user.svg"
                            return (
                                <Stack
                                    className={"targetPost position-relative"}
                                    flexDirection={"row"}
                                    gap={"20px"}
                                    onClick={() => {
                                        props.handleChosenBlogData(blog._id)
                                        props.handleTargetReviews(blog._id)
                                    }}
                                >
                                    <div
                                        className="position-absolute bg-warning text-light fw-bold p-1"
                                        style={{
                                            right: "-10px",
                                            top: "10px",
                                            borderRadius: "10px 0 0px 10px",
                                        }}
                                    >{blog.blog_category}</div>
                                    {
                                        verifiedMemberData?._id === blog.mb_id ? (
                                            <div
                                                className="position-absolute btn btn-danger text-light fw-bold"
                                                style={{
                                                    right: "40px",
                                                    top: "60px",
                                                }}
                                                onClick={(e) => handleAlertConfirmation(e, blog._id)}
                                            >Delete Article</div>
                                        ) : null
                                    }

                                    <div
                                        className="post_img d-flex main_img justify-content-center align-items-center ps-2"
                                    >
                                        <img src={blog_image} alt="image" className="rounded" aria-label="Blog  Image" aria-hidden="true" />
                                    </div>
                                    <Stack>
                                        <Stack
                                            flexDirection={"row"}
                                            alignItems={"center"}
                                            gap={"20px"}
                                            className="mt-2"
                                        >
                                            <div
                                                style={{
                                                    height: "60px",
                                                    width: "60px",
                                                    borderRadius: "50%",
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    alignItems: "center"
                                                }}
                                            >
                                                <img

                                                    src={user_url}
                                                    alt=""
                                                    style={{ width: "100%", height: "100%", borderRadius: "50%" }}
                                                />
                                            </div>
                                            <div
                                                className="post_by text-light fw-bold"
                                            >
                                                {blog.mb_data.mb_nick}
                                            </div>
                                        </Stack>
                                        <div className="post_titile fs-5 mt-3 fw-bold">
                                            {blog.blog_title}
                                        </div>
                                    </Stack>
                                    <Stack
                                        flexDirection={"row"}
                                        justifyContent={"space-between"}
                                        className="w-50 read_more position-absolute"
                                    >
                                        <Moment format="YYYY-MM-DD" className="fw-bold fs-6">
                                            {blog.createdAt}
                                        </Moment>
                                        <Stack
                                            flexDirection={"row"}
                                            gap={"20px"}
                                            className="fw-bold"
                                        >
                                            <div>
                                                <FavoriteTwoTone style={{ fill: "gray" }} className="me-2" />
                                                <span>{blog.blog_likes.toString()}</span>
                                            </div>
                                            <div>
                                                <Comment className="me-2" style={{ fill: "black" }} />
                                                <span>{blog.blog_comments.toString()}</span>
                                            </div>
                                            <div>
                                                <RemoveRedEye className="me-2" style={{ fill: "black" }} />
                                                <span>{blog.blog_views.toString()}</span>
                                            </div>
                                        </Stack>
                                    </Stack>
                                </Stack>
                            )
                        })}
                    </Stack>
                )
                    : (
                        <div
                            className=" text-secondary rounded mb-5 fs-3 p-2"
                            style={{ backgroundColor: "#DBDDEF" }}
                        >
                            You don't have any Following Members yet
                        </div>
                    )
            }
            <Pagination
                className="brand_pagination d-flex justify-content-center"
                page={props.searchObj.page}
                count={props.searchObj.page >= 3 ? props.searchObj.page + 1 : 3}
                onChange={(e: any, newValue) => {
                    props.searchObj.page = newValue
                    props.setSearchObj({ ...props.searchObj })
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

        </Stack >
    )
}