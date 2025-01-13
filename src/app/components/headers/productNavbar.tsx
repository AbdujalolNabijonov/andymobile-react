import React, { useEffect, useState } from "react"
import { Box, Container, Stack } from "@mui/material"
import { NavLink, useHistory } from "react-router-dom"
import { Autoplay, EffectFade } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"
import { verifiedMemberData } from "../../apiServices/verified"
import { MobileNav } from "./mobileNav"
import { MobileNavTop } from "./mobileNavTop"


export const ProductNavbar = (props: any) => {
    //Initializations
    const current_url = `/${props.addressTitle.toLowerCase()}`
    const [scrolled, setScrolled] = useState<boolean>(false)
    const history = useHistory()

    //lifeCircle Hook
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setScrolled(true)
            } else {
                setScrolled(false)
            }

        };
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        }

    }, [])
    return (
        <Box>
            <Box className="productNavbar position-relative">
                <Stack
                    style={scrolled ? {} : { zIndex: "11", position: "relative" }}
                    className={scrolled ? "bg-light navbar-container" : ' bg-light container'}>
                    <Box className={scrolled ? "navbar container" : " text-light navbar container position-absolute "} flexDirection={"row"}>
                        <Box className="navbar-brand nav-item">
                            <NavLink to="/" className={"nav-link"}>
                                <span className="text-secondary fs-1">Andy</span><span className="text-warning">Mobiles</span>
                            </NavLink>
                        </Box>
                        <Stack className="nav navbar" flexDirection={"row"}>
                            <Box className="nav-item">
                                <NavLink to="/" className={scrolled ? "nav-link" : "nav-link text-light"} >
                                    Home
                                </NavLink>
                            </Box>
                            <Box className="nav-item" >
                                <NavLink to="/brands" className={scrolled ? "nav-link" : "nav-link text-light"} activeClassName="underline">
                                    Brands
                                </NavLink>
                            </Box>
                            <Box className="nav-item">
                                <NavLink to="/products" className={scrolled ? "nav-link" : "nav-link text-light"} activeClassName="underline">
                                    Products
                                </NavLink>
                            </Box>
                            <Box className="nav-item">
                                <NavLink to="/blogs" className={scrolled ? "nav-link" : "nav-link text-light"} activeClassName="underline">
                                    Blog
                                </NavLink>
                            </Box>
                            {
                                verifiedMemberData ? (
                                    <Box className="nav-item">
                                        <NavLink to="/user-page" className={scrolled ? "nav-link" : "nav-link text-light"} activeClassName="underline">
                                            My Page
                                        </NavLink>
                                    </Box>
                                ) : null
                            }
                            {
                                verifiedMemberData ? (
                                    <Box className="nav-item">
                                        <NavLink to="/track-order" className={scrolled ? "nav-link" : "nav-link text-light"} activeClassName="underline">
                                            Track Order
                                        </NavLink>
                                    </Box>
                                ) : null
                            }

                            <Box className="nav-item">
                                <NavLink to="/faq" className={scrolled ? "nav-link" : "nav-link text-light"} activeClassName="underline">
                                    Faq
                                </NavLink>
                            </Box>
                        </Stack>
                        <Stack
                            className="nav-features fs-5 gap-4"
                            flexDirection={"row"}
                            alignItems={"center"}
                        >
                            <Box className="nav-item basket_btn">
                                <button
                                    className={scrolled ? "btn btn-outline-secondary border-0 position-relative" : "btn btn-outline-secondary border-0 position-relative"}
                                    onClick={() => {
                                        localStorage.setItem("value", JSON.stringify({ value: 3 }))
                                        history.push("/user-page")
                                    }}
                                >
                                    <i className="fa-solid fa-thumbs-up" title="Liked Products"></i>
                                    <span className="position-absolute nav-badge top-0 start-100 translate-middle bg-danger border border-light rounded-circle text-center">
                                        {props.likedItemAmount}
                                    </span>
                                </button>
                            </Box>
                            <Box className="nav-item basket_btn">
                                <button
                                    className={scrolled ? "btn btn-outline-secondary border-0 position-relative" : "btn btn-outline-secondary border-0 position-relative"}
                                    onClick={props.handleBasketOpen}
                                >
                                    <i className="fa-brands fa-shopify"></i>
                                    <span className="position-absolute nav-badge top-0 start-100 translate-middle bg-danger border border-light rounded-circle text-center">
                                        {props.ordersAmount}
                                    </span>
                                </button>
                            </Box>
                            <Box className="nav-item auth_user dropdown">
                                <button
                                    className="btn btn-outline-secondary border-0 d-flex justify-content-center"
                                    type="button"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                    style={{
                                        boxShadow: "none",
                                        height: "60px",
                                        width: "60px"
                                    }}>
                                    <img
                                        style={{
                                            height: "50px",
                                            width: "50px",
                                            color: "white",
                                            borderRadius: "20%",
                                        }}
                                        src={verifiedMemberData?.mb_image ? verifiedMemberData?.mb_image : "/pictures/auth/default_user.svg"} alt="" />
                                </button>
                                <ul className="dropdown-menu">
                                    {
                                        verifiedMemberData ?
                                            (<li><button className="dropdown-item" onClick={props.handleLogOut}>Log Out</button></li>) :
                                            (<li><button className="dropdown-item" onClick={props.handleSignUpOpen}>Register</button></li>)
                                    }

                                    <li><a href="/track-order" className="dropdown-item">Track My Order</a></li>
                                </ul>
                            </Box>
                        </Stack>
                    </Box>
                </Stack>
                <Box className="navbar-address">
                    <Container>
                        <Box className="address-title text-warning">
                            {props.addressTitle}
                        </Box>
                        <Box className="address-link">
                            <NavLink to='/' className={"text-light"}>
                                Home{" "}
                            </NavLink>
                            <NavLink to={current_url}>
                                / {props.addressTitle}
                            </NavLink>
                        </Box>
                    </Container>
                </Box>
                <Swiper
                    centeredSlides={true}
                    effect="fade"
                    autoplay={
                        { delay: 6000 }
                    }
                    modules={[Autoplay, EffectFade]}
                    className="product_ads_swiper"
                >
                    <SwiperSlide>
                        <video
                            loop
                            muted
                            playsInline={true}
                            autoPlay
                        >
                            <source
                                src="https://www.apple.com/105/media/kr/iphone-15-pro/2023/2f337511-a940-4b57-b89c-1512b7507777/anim/hero/medium_2x.mp4"
                                type="video/mp4"
                                data-src="https://www.apple.com/105/media/kr/iphone-15-pro/2023/2f337511-a940-4b57-b89c-1512b7507777/anim/hero/medium_2x.mp4"
                            />
                        </video>
                    </SwiperSlide>
                    <SwiperSlide>
                        <video
                            loop
                            muted
                            playsInline={true}
                            autoPlay
                            className="w-100"
                        >
                            <source
                                type="video/mp4"
                                data-src="//images.samsung.com/is/content/samsung/assets/us/home/01172024/HOME_E3_Main-KV_1440x640_pc_LTR.mp4"
                                src="//images.samsung.com/is/content/samsung/assets/us/home/01172024/HOME_E3_Main-KV_1440x640_pc_LTR.mp4"
                            />
                        </video>
                    </SwiperSlide>
                </Swiper>
            </Box>
            <MobileNavTop
                handleLogOut={props.handleLogOut}
                handleSignUpOpen={props.handleSignUpOpen}
                handleBasketOpen={props.handleBasketOpen}
                ordersAmount={props.ordersAmount}
            />
            <MobileNav />
        </Box>
    )
}