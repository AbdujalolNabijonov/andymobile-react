import { TabContext, TabList, TabPanel } from "@mui/lab"
import { Box, Container, Pagination, PaginationItem, Stack, Tab } from "@mui/material"
import { BlogsPage } from "./blogs"
import { useEffect, useState } from "react"
import { ArrowBack, ArrowForward } from "@mui/icons-material"
import { Route, Switch, useRouteMatch } from "react-router-dom"
import { ViewerPage } from "../../components/tuiEditor/tuiViewer"
import CommunityServiceApi from "../../apiServices/communityServiceApi"
import "../../css/blogPage.css"

//REDUX
import { createSelector } from "reselect";
import { Dispatch } from "@reduxjs/toolkit"
import { Blog } from "../../../libs/types/blog"
import { setTargetBlogs } from "./slice"
import { retrieveTargetBlogs } from "./selector"
import { useDispatch, useSelector } from "react-redux"

//Slice
const actionDispatch = (dispatch: Dispatch) => ({
    setTargetBlogs: (data: Blog[]) => dispatch(setTargetBlogs(data))
})

//Selector
const targetBlogsRetriever = createSelector(
    retrieveTargetBlogs,
    (targetBlogs) => ({ targetBlogs })
)
const BlogPage = () => {
    //Initilizations
    const blogPath = useRouteMatch().path;
    const [value, setValue] = useState<string>("1");
    const { setTargetBlogs } = actionDispatch(useDispatch())
    const { targetBlogs } = useSelector(targetBlogsRetriever)
    const [searchObj, setSearchObj] = useState({ order: "ALL", filter: "newToOld", limit: 6, page: 1 })
    //3 circle React Hook 
    useEffect(() => {
        window.scrollTo(0, 0)
        //GET::: communityBlogs
        const communityServiceApi = new CommunityServiceApi();
        communityServiceApi.getTargetBlogs(searchObj)
            .then(data => setTargetBlogs(data))
            .catch(err => console.log(err))
    }, [searchObj])

    //Handlers
    function handleValue(num: string) {
        setValue(num)
        switch (num) {
            case "1":
                searchObj.order = "ALL"
                setSearchObj({ ...searchObj })
                break;
            case "2":
                searchObj.order = "CELEBRITY";
                setSearchObj({ ...searchObj });
                break;
            case "3":
                searchObj.order = "EVALUATION";
                setSearchObj({ ...searchObj });
                break;
            case "4":
                searchObj.order = "STORY";
                setSearchObj({ ...searchObj });
                break;
            default:
                break;
        }
    }
    return (
        <Box className="blogPage mt-3">
            <Container className="blogPage_main">
                <Switch>
                    <Route path={`${blogPath}/:id`}>
                        <ViewerPage />
                    </Route>
                    <Route path={blogPath}>
                        <TabContext value={value}>
                            <Stack
                                style={{ position: "relative", zIndex: '2' }}
                                flexDirection={"row"}
                                justifyContent={"space-between"}
                            >
                                <TabList >
                                    <Tab className="blog_tab" value={"1"} label="All" onClick={() => handleValue("1")} />
                                    <Tab className="blog_tab" value={"2"} label="Celebrity" onClick={() => handleValue("2")} />
                                    <Tab className="blog_tab" value={"3"} label="Evaluation" onClick={() => handleValue("3")} />
                                    <Tab className="blog_tab" value={"4"} label="Stories" onClick={() => handleValue("4")} />
                                </TabList>
                                <Stack className="blog_sorting" flexDirection={"row"} alignItems={"center"}>
                                    <div>Sort by: </div>
                                    <select
                                        className="form-select fw-bold"
                                        onChange={(e) => {
                                            searchObj.filter = e.target.value;
                                            setSearchObj({ ...searchObj });
                                        }}
                                    >
                                        <option value="newToOld">Date, new to old</option>
                                        <option value="oldToNew">Date, old to new</option>
                                        <option value="like">Liked</option>
                                        <option value="view">Popular</option>
                                    </select>
                                </Stack>
                            </Stack>
                            <TabPanel value={"1"}>
                                <BlogsPage blogs={targetBlogs} />
                            </TabPanel>
                            <TabPanel value={"2"}>
                                <BlogsPage blogs={targetBlogs} />
                            </TabPanel>
                            <TabPanel value={"3"}>
                                <BlogsPage blogs={targetBlogs} />
                            </TabPanel>
                            <TabPanel value={"4"}>
                                <BlogsPage blogs={targetBlogs} />
                            </TabPanel>
                        </TabContext>
                        <Pagination
                            className="brand_pagination d-flex justify-content-center"
                            page={searchObj.page}
                            count={searchObj.page >= 3 ? searchObj.page + 1 : 3}
                            onChange={(e: any, newValue: number) => {
                                searchObj.page = newValue;
                                setSearchObj({ ...searchObj })
                                window.scrollTo(0, 0)
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
                    </Route>
                </Switch>
            </Container>
            <Container>
                <Box className={"notify-warn"}>
                    Mobile version is developing now <br />
                    Enjoy with desktop version untill mobile version is done.
                </Box>
            </Container>
        </Box>
    )
}

export default BlogPage