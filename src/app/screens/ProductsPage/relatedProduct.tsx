import React, { useEffect, useRef } from "react"
import { Box, Container, Stack } from "@mui/material"
import { Autoplay } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"
import { Favorite } from "@mui/icons-material"
import ProductServiceApi from "../../apiServices/productServiceApi"
import { stringSplitterHandler } from "../../components/features/stringSplitter"
import { useHistory, useLocation } from "react-router-dom"
import { handleLikeItem } from "../../components/features/likeItem"
import { Product } from "../../libs/types/product"
import { serverApi } from "../../libs/config"

//redux
import { Dispatch } from "@reduxjs/toolkit";
import { createSelector } from "reselect";
import { useDispatch, useSelector } from "react-redux"
import { Direction } from "../../libs/enums/product"
import { setRelatedProducts } from "./slice"
import { relatedProductsRetriever } from "./selector"

//REDUX Slice
const actionDispatch = (dispatch: Dispatch) => ({
    setRelatedProducts: (data: Product[]) => dispatch(setRelatedProducts(data))
})

//REDUX SELECTOR
const relatedProductsRetrieve= createSelector(
    relatedProductsRetriever,
    (relatedProducts) => ({ relatedProducts })
)

export const RelatedProducts = (props: any) => {
    //Initializations
    const { setRelatedProducts} = actionDispatch(useDispatch())
    const { relatedProducts } = useSelector(relatedProductsRetrieve)
    const history = useHistory();
    const location = useLocation()
    const refs: any = useRef([])
    const resizeWidth = window.screen.width
    //3 circle
    useEffect(() => {
        const productServiceApi = new ProductServiceApi();
        productServiceApi.getTargetProducts({ page: 1, limit: 10, order: "createdAt", direction: Direction.DESC, search: {} })
            .then(data => setRelatedProducts(data)).catch(err => {
                console.log(err)
            })
    }, [])

    //Handlers
    function handleOpenChosenOne(e: any, key: string) {
        if (location.pathname.includes("/products/product/")) {
            history.push(`/products/product/${key}`)
            window.location.reload()
        } else {
            history.push(`/products/product/${key}`)
        }
    }

    return (
        <Container className="hot-products mt-5">
            <Box className="text-center  hot-products-title">
                Shop all latest offers
            </Box>
            <Swiper
                slidesPerView={resizeWidth < 440 ? 4 : 5}
                spaceBetween={30}
                loop={true}
                pagination={{
                    clickable: true,
                }}
                speed={1000}
                autoplay={
                    { delay: 1000, pauseOnMouseEnter: true }
                }
                modules={[Autoplay]}
                className="product-swiper cards"
                style={{ cursor: "pointer" }}
            >
                {relatedProducts.map((ele: Product, index: number) => {
                    let image_url_1 = `${serverApi}/${ele.product_images[0]}`,
                        image_url_2 = ele.product_images[1] ? `${serverApi}/${ele.product_images[1]}` : `/pictures/products/${ele.product_color}_phone.webp`,
                        discount_price = ele.product_price - (ele.product_price * (ele.product_discount / 100))
                    return (
                        <SwiperSlide
                            className="swiper-card"
                            key={ele._id}
                        >
                            <Box className={"slider-card border-0"} id="card">
                                <div className="card-img product_fade">
                                    <Box sx={{display:"flex", justifyContent:"center", alignItems:"center",height:"80%"}}>
                                        <img
                                            src={image_url_1}
                                            alt="phone1"
                                            className="product_img_1"
                                            width={100}
                                        />
                                        <img
                                            src={image_url_2}
                                            alt="2"
                                            className="product_img_2"
                                            width={100}
                                        />
                                    </Box>
                                    <Stack
                                        className="card-features"
                                        gap={"10px"}
                                    >
                                        <div
                                            className="rounded btn btn-outline-secondary border-0"
                                        >
                                            <Favorite
                                                className="heart_mobile_size"
                                                style={{ fill: ele?.me_liked && ele?.me_liked[0]?.mb_id ? "red" : "white" }}
                                                onClick={(e: any) => { handleLikeItem(e, ele, "PRODUCT", refs, true) }} />
                                        </div>
                                        <div className="rounded btn btn-outline-warning border-0" onClick={() => props.handleSaveBasket(ele)}>
                                            <i className="fa-brands fa-shopify"></i>
                                        </div>
                                    </Stack>
                                    <Stack
                                        flexDirection={"row"}
                                        justifyContent={"center"}
                                        alignItems={"center"}
                                        gap={"7px"}
                                        className="product_sort"
                                        flexWrap={"wrap"}
                                    >
                                        {
                                            ele?.product_related_colors?.map((product: any, index: number) => {
                                                let product_color = product.product_color.toLowerCase()
                                                let image_color = product_color === "silver" ? "white" : product_color
                                                return (
                                                    <div
                                                        className="color-select"
                                                        key={index}
                                                    >
                                                        <button
                                                            type="button"
                                                            onClick={(e) => handleOpenChosenOne(e, product._id)}
                                                            title={product_color}
                                                        >
                                                            <img src={`/pictures/products/${image_color}_phone.webp`} alt="" />
                                                        </button>
                                                        <span>
                                                            {product_color}
                                                        </span>
                                                    </div>
                                                )
                                            })
                                        }
                                    </Stack>
                                    {
                                        ele.product_new_released === "Y" ? (<div className="bg-danger position-absolute card-img_badge">NEW</div>) : (<div className="bg-danger position-absolute card-img_badge opacity-0">NEW</div>)
                                    }
                                </div>
                                <Stack
                                    flexDirection={"row"}
                                    justifyContent={"space-between"}
                                    className="mt-3 ps-1 pe-1 card-body"
                                >
                                    <div className="card-text fs-6 fw-bold text-warning">
                                        {ele.product_name}
                                    </div>
                                    <Stack
                                        flexDirection={"row"}
                                        gap={'5px'}
                                        sx={{ fontSize: "12px" }}
                                        alignItems={"center"}
                                    >
                                        <Stack
                                            flexDirection={"row"}
                                            gap={'3px'}
                                            alignItems={"center"}
                                            className="slider_icon"
                                        >
                                            <i className="fa-solid fa-comments "></i>
                                            {ele.product_comments ?? "0"}
                                        </Stack>
                                        |
                                        <Stack
                                            flexDirection={"row"}
                                            gap={'3px'}
                                            alignItems={"center"}
                                            className="slider_icon"
                                        >
                                            <i className="fa-solid fa-heart"></i>
                                            <div
                                                ref={(htmlEl) => (refs.current[ele._id] = htmlEl)}
                                            >
                                                {ele.product_likes ?? "0"}
                                            </div>
                                        </Stack>
                                        |
                                        <Stack
                                            flexDirection={"row"}
                                            gap={'3px'}
                                            alignItems={"center"}
                                            className="slider_icon"
                                        >
                                            <i className="fa-solid fa-eye"></i>
                                            {ele.product_views ?? "0"}
                                        </Stack>
                                    </Stack>
                                </Stack>
                                <div className="card-price mt-2 fw-bold">
                                    {ele.product_discount ? (<div>{stringSplitterHandler(discount_price, 3, ".")}₩<span className="text-secondary ms-2"><s>{stringSplitterHandler(ele.product_price, 3, ".")}₩</s></span></div>) : stringSplitterHandler(ele.product_price, 3, ".") + "₩"}
                                </div>
                            </Box>
                        </SwiperSlide>
                    )
                })}
            </Swiper>
        </Container>
    )
}