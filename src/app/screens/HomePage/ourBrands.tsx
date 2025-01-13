import React, { useEffect, useState } from "react"
import { Box, Container, Stack } from "@mui/material"
import { Autoplay, Pagination } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"
import { useHistory } from "react-router-dom"
import { Brand } from "../../libs/types/member"
import { serverApi } from "../../libs/config"


//Redux
import { Dispatch } from "@reduxjs/toolkit"
import BrandsServiceApi from "../../apiServices/brandsServiceApi"
import { createSelector } from "reselect"
import { useDispatch, useSelector } from "react-redux"
import { setTopRandomBrands } from "./slice"
import { retrieveTopRandomBrands } from "./selector"

//Slice
const actionDispatch = (dispatch: Dispatch) => ({
    setTopRandomBrands: (data: Brand[]) => dispatch(setTopRandomBrands(data))
})
//Selector
const targetBrandRetriever = createSelector(
    retrieveTopRandomBrands,
    (targetTopBrands) => ({ targetTopBrands })
)
export const OurBrands = () => {
    //Initializations
    const logo_Colors = ["#BCE7F0", "#F9CADA", "#1B448B", "#FBE285", "#F0F0F0", "#858DFA"];
    const { setTopRandomBrands } = actionDispatch(useDispatch())
    const { targetTopBrands } = useSelector(targetBrandRetriever)
    const [scroll, setScroll] = useState<boolean>(false)
    const history = useHistory()
    const screenWidth = window.screen.width
    //Three circle Hook
    useEffect(() => {
        function handlerScroll() {
            if (window.scrollY > 1100) {
                setScroll(true)
            } else {
                setScroll(false)
            }
        }
        window.addEventListener("scroll", handlerScroll)
        const brandsServiceApi = new BrandsServiceApi()
        brandsServiceApi.getTargetBrands({ random: true, limit: 10 })
            .then(data => setTopRandomBrands(data))
            .catch(err => console.log(err))
        return () => {
            window.removeEventListener("scroll", handlerScroll)
        }
    }, [])

    //Handlers
    function handleOpenBrandsProduct(e: any, key: string) {
        history.push(`/products/${key}`)
    }
    return (
        <Box className="mt-5 ourBrand mb-5">
            <div className="bg"></div>
            <Container>
                <h1 className="text-center fw-bold">Shop by Brands</h1>
                <Swiper
                    slidesPerView={screenWidth > 430 ? 4 : screenWidth < 400 ? 2 : 3}
                    pagination={{ clickable: true }}
                    autoplay={{ delay: 2000, pauseOnMouseEnter: true }}
                    modules={[Autoplay, Pagination]}
                    data-aos="fade-left"
                    data-aos-delay={500}
                    className={scroll ? "aos-animate brand-swiper" : "brand-swiper"}
                    style={{ transition: "all .3s ease-in-out" }}
                >
                    <Stack className="brand_cards" flexDirection={"row"} justifyContent={"space-evenly"}>
                        {targetTopBrands.map((brand: Brand, index: number) => {
                            const image_url = `${serverApi}/${brand.mb_image}`
                            return (
                                <SwiperSlide key={brand._id}>
                                    <Stack
                                        className="brand_card"
                                        style={{ backgroundColor: logo_Colors[index] }}
                                        alignItems={"center"}
                                        onClick={(e) => handleOpenBrandsProduct(e, brand._id)}
                                    >
                                        <div className="brand_img">
                                            <img src={image_url} alt="apple" className="brand_logo" />
                                        </div>
                                        <div className="brand_title fs-2 text-center fw-bold">
                                            {brand.mb_nick}
                                        </div>
                                    </Stack>
                                </SwiperSlide>
                            )
                        })}
                    </Stack>
                </Swiper>
            </Container>
        </Box>
    )
}