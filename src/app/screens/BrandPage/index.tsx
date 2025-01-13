import React, { useEffect, useRef, useState } from "react"
import { useHistory } from "react-router-dom";
import { Box, Container, Pagination, PaginationItem, Stack } from "@mui/material"
import { ArrowBack, ArrowForward, Favorite, RemoveRedEye, Comment } from "@mui/icons-material"
import "../../css/brandsPage.css";

//REDUX
import { createSelector } from "reselect"
import { Dispatch } from "@reduxjs/toolkit";
import { setTargetBrands } from "./slice";
import { retrieveTargetBrands } from "./selector";
import { useDispatch, useSelector } from "react-redux";

import BrandsServiceApi from "../../apiServices/brandsServiceApi";
import { handleLikeItem } from "../../components/features/likeItem";
import { DownToUpBtn } from "../../components/features/downToUpBtn";
import { Brand } from "../../libs/types/member";
import { serverApi } from "../../libs/config";

//SLICE
const actionDispatch = (dispatch: Dispatch) => ({
    setTargetBrands: (data: Brand[]) => dispatch(setTargetBrands(data))
})

//SELECTOR
export const targetBrandsRetriever = createSelector(
    retrieveTargetBrands,
    (targetBrands) => ({ targetBrands })
)

const BrandPage = () => {
    //Initializations
    const [load, setLoad] = useState<boolean>(false);
    const [boxSize, setBoxSize] = useState<string>("23%")
    const { setTargetBrands } = actionDispatch(useDispatch())
    const { targetBrands } = useSelector(targetBrandsRetriever)
    const [searchObj, setSearchObj] = useState({ limit: 6, order: "createdAt", search: "", page: 1 })
    const [rebuild, setRebuild] = useState<Date>(new Date())
    const history = useHistory()
    const refs: any = useRef([])
    //Three circle Hook
    useEffect(() => {
        const brandsServiceApi = new BrandsServiceApi()
        brandsServiceApi.getTargetBrands(searchObj).then(data => setTargetBrands(data)).catch(err => console.log(err))
        window.scrollTo(0, 0)
        setLoad(true)
    }, [searchObj, rebuild])

    //Handlers
    function handleBoxSize(size: string) {
        setBoxSize(size)
    }
    function handlePagination(e: any, value: number) {
        searchObj.page = value;
        setSearchObj({ ...searchObj })
    }
    function handleFilter(e: any) {
        searchObj.order = e.target.value
        setSearchObj({ ...searchObj })
    }
    function handleSearch(e: any) {
        searchObj.search = e.target.value
        setSearchObj({ ...searchObj })
    }
    return (
        <Box>
            <Box className="brands">
                <Stack className="filter_brands container pt-3" flexDirection={"row"} justifyContent={"space-between"}>
                    <Stack className="grid_filter" flexDirection={"row"} alignItems={"center"} gap={"10px"}>
                        <button className="btn" onClick={() => handleBoxSize("24%")}>
                            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M220-160q-25 0-42.5-17.5T160-220q0-25 17.5-42.5T220-280q25 0 42.5 17.5T280-220q0 25-17.5 42.5T220-160Zm173 0q-25 0-42.5-17.5T333-220q0-25 17.5-42.5T393-280q25 0 42.5 17.5T453-220q0 25-17.5 42.5T393-160Zm174 0q-25 0-42.5-17.5T507-220q0-25 17.5-42.5T567-280q25 0 42.5 17.5T627-220q0 25-17.5 42.5T567-160Zm173 0q-25 0-42.5-17.5T680-220q0-25 17.5-42.5T740-280q25 0 42.5 17.5T800-220q0 25-17.5 42.5T740-160ZM220-333q-25 0-42.5-17.5T160-393q0-25 17.5-42.5T220-453q25 0 42.5 17.5T280-393q0 25-17.5 42.5T220-333Zm173 0q-25 0-42.5-17.5T333-393q0-25 17.5-42.5T393-453q25 0 42.5 17.5T453-393q0 25-17.5 42.5T393-333Zm174 0q-25 0-42.5-17.5T507-393q0-25 17.5-42.5T567-453q25 0 42.5 17.5T627-393q0 25-17.5 42.5T567-333Zm173 0q-25 0-42.5-17.5T680-393q0-25 17.5-42.5T740-453q25 0 42.5 17.5T800-393q0 25-17.5 42.5T740-333ZM220-507q-25 0-42.5-17.5T160-567q0-25 17.5-42.5T220-627q25 0 42.5 17.5T280-567q0 25-17.5 42.5T220-507Zm173 0q-25 0-42.5-17.5T333-567q0-25 17.5-42.5T393-627q25 0 42.5 17.5T453-567q0 25-17.5 42.5T393-507Zm174 0q-25 0-42.5-17.5T507-567q0-25 17.5-42.5T567-627q25 0 42.5 17.5T627-567q0 25-17.5 42.5T567-507Zm173 0q-25 0-42.5-17.5T680-567q0-25 17.5-42.5T740-627q25 0 42.5 17.5T800-567q0 25-17.5 42.5T740-507ZM220-680q-25 0-42.5-17.5T160-740q0-25 17.5-42.5T220-800q25 0 42.5 17.5T280-740q0 25-17.5 42.5T220-680Zm173 0q-25 0-42.5-17.5T333-740q0-25 17.5-42.5T393-800q25 0 42.5 17.5T453-740q0 25-17.5 42.5T393-680Zm174 0q-25 0-42.5-17.5T507-740q0-25 17.5-42.5T567-800q25 0 42.5 17.5T627-740q0 25-17.5 42.5T567-680Zm173 0q-25 0-42.5-17.5T680-740q0-25 17.5-42.5T740-800q25 0 42.5 17.5T800-740q0 25-17.5 42.5T740-680Z" /></svg>
                        </button>
                        <button className="btn" onClick={() => handleBoxSize("32%")}>
                            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M240-160q-33 0-56.5-23.5T160-240q0-33 23.5-56.5T240-320q33 0 56.5 23.5T320-240q0 33-23.5 56.5T240-160Zm240 0q-33 0-56.5-23.5T400-240q0-33 23.5-56.5T480-320q33 0 56.5 23.5T560-240q0 33-23.5 56.5T480-160Zm240 0q-33 0-56.5-23.5T640-240q0-33 23.5-56.5T720-320q33 0 56.5 23.5T800-240q0 33-23.5 56.5T720-160ZM240-400q-33 0-56.5-23.5T160-480q0-33 23.5-56.5T240-560q33 0 56.5 23.5T320-480q0 33-23.5 56.5T240-400Zm240 0q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Zm240 0q-33 0-56.5-23.5T640-480q0-33 23.5-56.5T720-560q33 0 56.5 23.5T800-480q0 33-23.5 56.5T720-400ZM240-640q-33 0-56.5-23.5T160-720q0-33 23.5-56.5T240-800q33 0 56.5 23.5T320-720q0 33-23.5 56.5T240-640Zm240 0q-33 0-56.5-23.5T400-720q0-33 23.5-56.5T480-800q33 0 56.5 23.5T560-720q0 33-23.5 56.5T480-640Zm240 0q-33 0-56.5-23.5T640-720q0-33 23.5-56.5T720-800q33 0 56.5 23.5T800-720q0 33-23.5 56.5T720-640Z" /></svg>
                        </button>
                        <button className="btn" onClick={() => handleBoxSize("49%")}>
                            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M120-520v-320h320v320H120Zm0 400v-320h320v320H120Zm400-400v-320h320v320H520Zm0 400v-320h320v320H520ZM200-600h160v-160H200v160Zm400 0h160v-160H600v160Zm0 400h160v-160H600v160Zm-400 0h160v-160H200v160Zm400-400Zm0 240Zm-240 0Zm0-240Z" /></svg>
                        </button>
                    </Stack>
                    <Stack className="sort_items" flexDirection={"row"} gap={"20px"} alignItems={"center"}>
                        <Box className="show_items">
                            Showing <span className="border ps-3 pe-3 pt-2 pb-2">{targetBrands.length}</span> brands per page
                        </Box>
                        <Box className="order_items">
                            <select className="form-select" id="order_item" onChange={handleFilter}>
                                <option value="createdAt">New to Old</option>
                                <option value="mb_likes">Popular Brands</option>
                                <option value="mb_top">Top Brands</option>
                                <option value="mb_views">Best Selling</option>
                            </select>
                        </Box>
                        <Box className="search_input">
                            <input type="text" className="pe-3 ps-3 fs-6" placeholder="Search, Brand" onKeyUpCapture={handleSearch} />
                        </Box>
                    </Stack>
                </Stack>
                <hr />
                <Stack
                    className="brands_items container"
                    flexDirection={"row"}
                    flexWrap={"wrap"}
                    gap={"10px"}
                    justifyContent={"start"}
                >
                    {targetBrands.map((ele: Brand, index: number) => {
                        const image_url = `${serverApi}/${ele.mb_image}`
                        return (
                            <div
                                key={ele._id}
                                className={load ? "card aos-animate" : "card"}
                                data-aos="fade-right"
                                data-aos-delay={150 * index}
                                style={boxSize === "32%" ? { fontSize: "19px", width: boxSize } : boxSize === "49%" ? { fontSize: "24px", width: boxSize } : { width: boxSize }}
                            >
                                <button
                                    className="btn btn-outline-secondary rounded-circle"
                                    style={{
                                        width: "50px",
                                        height: '50px',
                                        position: "absolute",
                                        right: "20px",
                                        top: "20px",
                                        zIndex: 100
                                    }}
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        handleLikeItem(e, ele, "MEMBER", refs, setRebuild)
                                    }}
                                >
                                    <Favorite style={ele.me_liked && ele.me_liked[0]?.mb_id ? { fill: "red" } : { fill: "white" }} />
                                </button>
                                <div
                                    className="brand_img"
                                    onClick={() => {
                                        history.push(`/products/${ele._id}`)
                                    }}>
                                    <img src={image_url} alt="" />
                                </div>
                                <Box className="card-content">
                                    <Stack
                                        flexDirection={"row"}
                                        className="card_title"
                                        alignItems={"center"}
                                        justifyContent={"space-between"}
                                    >
                                        <div className="fw-bold brand_name">{ele.mb_nick}</div>
                                        <Stack
                                            flexDirection={"row"}
                                            alignItems={"center"}
                                            gap={"5px"}
                                        >
                                            <div className="text-dark fw-bold"

                                            >
                                                <Favorite style={{ fill: "white", marginRight: "2px" }} />
                                                <span ref={(e) => refs.current[ele._id] = e}>
                                                    {ele.mb_likes}
                                                </span>
                                            </div>
                                            {"|"}
                                            <div className="text-dark fw-bold">
                                                <RemoveRedEye style={{ fill: "white", marginRight: "2px" }} />
                                                {ele.mb_views}
                                            </div>
                                            {"|"}
                                            <div className="text-dark fw-bold">
                                                <Comment style={{ fill: "white", marginRight: "2px" }} />
                                                {ele.mb_comments ? ele.mb_comments : 0}
                                            </div>
                                        </Stack>
                                    </Stack>
                                    <div
                                        className="card_description text-dark fw-bold"
                                    >
                                        <Stack className="adddress mb-3" flexDirection={"row"} gap="10px" alignItems={"center"}>
                                            <i className="fa-solid fa-location-dot"></i>
                                            <div className="address_name">
                                                {ele.mb_address}
                                            </div>
                                        </Stack>
                                        <Stack className="contact mb-3" flexDirection={"row"} gap="10px" alignItems={"center"}>
                                            <i className="fa-solid fa-address-book"></i>
                                            <div className="contact_number">
                                                +{ele.mb_phone}
                                            </div>
                                        </Stack>
                                        <Stack className="email mb-3" flexDirection={"row"} gap="10px" alignItems={"center"}>
                                            <i className="fa-solid fa-envelope"></i>
                                            <div className="email_address">
                                                {ele.mb_email ? ele.mb_email : "no email address"}
                                            </div>
                                        </Stack>
                                    </div>
                                </Box>
                            </div>
                        )
                    })}
                </Stack>
                <Container className="d-flex">
                    <Pagination
                        className="brand_pagination d-flex justify-content-center mt-5"
                        page={searchObj.page}
                        count={searchObj.page > 3 ? searchObj.page + 1 : 3}
                        onChange={handlePagination}
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
                </Container>
                <DownToUpBtn address={"#"} />
            </Box>
            <Container>
                <Box className={"notify-warn"}>
                    Mobile version is developing now <br />
                    Enjoy with desktop version untill mobile version is done.
                </Box>
            </Container>
        </Box>
    )
}

export default BrandPage