import { Comment, Favorite, RemoveRedEye } from "@mui/icons-material"
import { Box, Stack } from "@mui/material"
import { useEffect, useRef, useState } from "react"
import { Link, NavLink } from "react-router-dom"
import { Blog } from "../../../libs/types/blog"
import Moment from "react-moment"
import { serverApi } from "../../../libs/config"
import { handleLikeItem } from "../../components/features/likeItem"

export const BlogsPage = (props: any) => {
    //Initializations
    const [loaded, setLoaded] = useState<boolean>(false)
    const refs: any = useRef({})

    //LifeCircle hook
    useEffect(() => {
        setLoaded(true)
        return () => {
            setLoaded(false)
        }
    }, [])

    //handlers
    return (
        <Stack
            className="blogs"
            flexDirection={"row"}
            flexWrap={"wrap"}
            justifyContent={"start"}
            gap={"15px"}
        >
            {props.blogs?.map((blog: Blog, index: number) => {
                const image_url = blog.mb_data.mb_image ? `${serverApi}/${blog.mb_data.mb_image}` : "/pictures/auth/default_user.svg"
                const blog_image = blog.blog_images[0] ? `${serverApi}/${blog.blog_images[0]}` : "/pictures/community/default_article.svg"
                return (
                    <Box className={loaded ? "blog_card aos-animate" : ""} data-aos="fade-left" data-aos-delay={150 * index}>
                        <div className="blog_img w-100 position-relative">
                            <div className="blog_wrapper"><img className="w-100" src={blog_image} alt="" /></div>
                            <div
                                className="btn btn-secondary position-absolute blog_like_btn"
                                onClick={(e) => handleLikeItem(e, blog, "COMMUNITY", refs)}
                            >
                                <Favorite style={blog.me_liked && blog.me_liked[0]?.mb_id?{fill:"red"}:{ fill: "white" }} />
                            </div>
                            <div className="blog_type position-absolute">{blog.blog_category}</div>
                            <img src={blog_image} alt="blog_img" height={"220px"} width={"autovs"} />
                        </div>
                        <div className="blog_body">
                            <div className="me-2 ms-2">
                                <Stack className="blog_subtitle p-2" flexDirection={"row"} justifyContent={"space-between"} alignItems={"center"}>
                                    <div className="blog_author">
                                        <i className="fa-solid fa-calendar-days me-2"></i>
                                        <span>
                                            <Moment format="YYYY-MM-DD">
                                                {blog.createdAt}
                                            </Moment>
                                        </span>
                                    </div>
                                    <Stack className="statistic" flexDirection={"row"} gap={"15px"}>
                                        <div className="d-flex gap-2 align-items-center">
                                            {blog.blog_comments}
                                            <Comment />
                                        </div>
                                        <div className="d-flex gap-2 align-items-center">
                                            <span ref={(ele) => refs.current[blog._id] = ele}>{blog.blog_likes}</span>
                                            <Favorite />
                                        </div>
                                        <div className="d-flex gap-2 align-items-center">
                                            {blog.blog_views}
                                            <RemoveRedEye />
                                        </div>
                                    </Stack>
                                </Stack>
                                <div className="blog_title fs-2 fw-bold">
                                    <NavLink to="#">
                                        {blog.blog_title}
                                    </NavLink>
                                </div>
                                <div className="blog_author d-flex align-items-center gap-3 mt-3 mb-1">
                                    <img src={image_url} alt="" />
                                    <a
                                        className="author_name fw-bold"
                                        href={`/user-page/other/?mb_id=${blog.mb_data._id}`}
                                        title={`/user-page/other/?mb_id=${blog.mb_data._id}`}
                                    >
                                        {blog.mb_data.mb_nick}
                                    </a>
                                </div>
                            </div>
                        </div>
                        <Stack className="blog_text fw-bold" flexDirection={"row"} alignItems={"center"} gap={"5px"}>
                            <span><i className="fa-solid fa-link"></i></span>
                            <Link title={`/user-page/other/?mb_id=${blog.mb_data._id}&art_id=${blog._id}`} to={`/user-page/other/?mb_id=${blog.mb_data._id}&art_id=${blog._id}`}>Continue Reading</Link>
                        </Stack>
                    </Box>
                )
            })}

        </Stack>
    )
}