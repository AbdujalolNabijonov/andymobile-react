import React, { useEffect, useRef, useState } from 'react';
import { Box, Stack } from '@mui/material';
import Marquee from "react-fast-marquee";
import Moment from "react-moment"


//REDUX
import { createSelector } from "reselect"
import { Dispatch } from '@reduxjs/toolkit';
import { Blog } from '../../../libs/types/blog';
import { setCommunityPost } from "./slice"
import { retrieveCommunityPost } from './selector';
import CommunityServiceApi from '../../apiServices/communityServiceApi';
import { useDispatch, useSelector } from 'react-redux';
import { serverApi } from '../../../libs/config';
import { useHistory } from 'react-router-dom';
import { Favorite, FavoriteBorderRounded, FavoriteBorderTwoTone } from '@mui/icons-material';
import { handleLikeItem } from '../../components/features/likeItem';


//SLICE
const actionDispatch = (dispatch: Dispatch) => ({
    setCommunityPost: (data: Blog[]) => (dispatch(setCommunityPost(data)))
})
//SELECTOR
const communityPostRetriever = createSelector(
    retrieveCommunityPost,
    (communityPost) => ({ communityPost })
)
function CommunityPosts(props: any) {
    //Initializations
    const [scrolled, setScrolled] = useState<boolean>(false)
    const { setCommunityPost } = actionDispatch(useDispatch())
    const { communityPost } = useSelector(communityPostRetriever)
    const history = useHistory()
    const refs: any = useRef([])
    const [rebuild, setRebuild] = useState<Date>(new Date())
    //three circle Hook
    useEffect(() => {
        const communityServiceApi = new CommunityServiceApi()
        communityServiceApi.getTargetCommunityPost({ limit: 10, filter: "newToOld", page: 1 })
            .then(data => setCommunityPost(data))
            .catch(err => console.log(err))
    }, [rebuild])

    useEffect(() => {
        function scrollHandle() {
            if (window.scrollY > 2700) {
                setScrolled(true)
            } else {
                setScrolled(false)
            }
        }
        window.addEventListener("scroll", scrollHandle)
        return () => {
            window.removeEventListener("scroll", scrollHandle)
        }
    }, [])

    //handlers
    function handleOpenPost(post: Blog) {
        history.push(`/user-page/other/?mb_id=${post.mb_data._id}&art_id=${post._id}`)
    }

    return (
        <Box className="communityHomePosts">
            <Marquee
                pauseOnHover={true}
                style={{ padding: "20px 0" }}
            >
                {communityPost.map((blog: Blog, index: number) => {
                    const image_url = blog.blog_images[0] ? `${serverApi}/${blog.blog_images[0]}` : "/pictures/community/cute_girl.jpg";
                    const user_image = blog.mb_data.mb_image ? `${serverApi}/${blog.mb_data.mb_image}` : "/pictures/auth/default_user.svg"
                    return (
                        <Box className={"post_card"} onClick={() => handleOpenPost(blog)} key={index}>
                            <div className="post_img">
                                <div className="img_wrapper">
                                    <img src={image_url} alt="" className='w-100' />
                                </div>
                                <div
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        handleLikeItem(e, blog, "COMMUNITY", refs, setRebuild, true)
                                    }}
                                    className='rounded btn btn-secondary border-0'
                                    style={{
                                        position: "absolute",
                                        zIndex: 12,
                                        right: "20px",
                                        top: "10px"
                                    }}>
                                    <Favorite style={blog.me_liked && blog?.me_liked[0]?.mb_id ? { fill: "red", } : { fill: "white", }} />
                                </div>
                                <img src={image_url} alt="" />
                                <div className='post_type'>{blog.blog_category}</div>
                            </div>
                            <div className="post_body">
                                <Stack
                                    direction={"row"}
                                    className="post_info_header"
                                    gap={"20px"}
                                    justifyContent={"space-between"}
                                >
                                    <Stack
                                        flexDirection={"row"}
                                        gap="10px"
                                    >
                                        <div style={{
                                            height: "60px",
                                            width: "60px",
                                            overflow: "hidden",
                                            borderRadius: "50%",
                                            display: "flex",
                                            justifyContent: "center",
                                            padding: "5px"
                                        }}>
                                            <img
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    history.push(`/user-page/other/?mb_id=${blog.mb_data._id}`)
                                                }}
                                                src={user_image}
                                                alt=""
                                            />
                                        </div>
                                        <Box >
                                            <div className="author text-warning fw-bold" onClick={(e) => {
                                                e.stopPropagation()
                                                history.push(`/user-page/other/?mb_id=${blog.mb_data._id}`)
                                            }}>
                                                {blog.mb_data.mb_nick}
                                            </div>
                                        </Box>
                                    </Stack>
                                    <Stack>
                                        <Stack direction={"row"} gap={"5px"}>
                                            <div><i className="fa-solid fa-calendar-days"></i></div>
                                            <Moment format='YYYY-MM-DD'>
                                                {blog.createdAt}
                                            </Moment>
                                        </Stack>
                                        <Stack
                                            flexDirection={"row"}
                                            gap={'5px'}
                                            sx={{ fontSize: "12px" }}
                                            alignItems={"center"}
                                        >
                                            <Stack flexDirection={"row"} gap={'3px'} alignItems={"center"}>
                                                <i className="fa-solid fa-comments"></i>
                                                {blog.blog_comments ?? "0"}
                                            </Stack>
                                            |
                                            <Stack
                                                flexDirection={"row"}
                                                gap={'3px'}
                                                alignItems={"center"}
                                            >
                                                <Favorite sx={{ fontSize: 20, marginLeft: "5px" }} />
                                                <div
                                                    ref={(ele) => refs.current[blog._id] = ele}
                                                >
                                                    {blog.blog_likes}
                                                </div>
                                            </Stack>
                                            |
                                            <Stack flexDirection={"row"} gap={'3px'} alignItems={"center"}>
                                                <i className="fa-solid fa-eye"></i>
                                                {blog.blog_views}
                                            </Stack>
                                        </Stack>
                                    </Stack>
                                </Stack>
                                <div className="post_title pt-3 fs-6">
                                    {blog.blog_title}
                                </div>
                            </div>
                        </Box>
                    )
                })}
            </Marquee>
        </Box>
    );
}

export default CommunityPosts;