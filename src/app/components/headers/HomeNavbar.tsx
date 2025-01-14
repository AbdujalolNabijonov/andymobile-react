
import React, { useEffect, useRef, useState } from "react"
import { Box, Stack, Container } from "@mui/material"
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, EffectFade } from "swiper/modules"
import { NavLink, useHistory } from "react-router-dom";
import { verifiedMemberData } from "../../apiServices/verified";
import { MobileNav } from "./mobileNav";
import { MobileNavTop } from "./mobileNavTop";
import "swiper/css"
import "../../css/general.css"
import "../../css/navbar.css"

export const HomeNavbar = (props: any) => {
    //Initilizations
    const modules = [Navigation, Autoplay, EffectFade]
    const progressCircle = useRef(null);
    const progressContent = useRef(null);
    const [scrolled, setScrolled] = useState<Number>(0);
    const history = useHistory();
    //
    useEffect(() => {

        const handleScroll = () => {
            setScrolled(window.scrollY);
        };
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        }

    }, [])
    //Handlers
    const onAutoplayTimeLeft = (s: any, time: any, progress: any) => {
        //@ts-ignore
        progressCircle.current.style.setProperty('--progress', 1 - progress);
        //@ts-ignore
        progressContent.current.textContent = `${Math.ceil(time / 1000)}s`;
    };;

    return (
        <Box className="HomePage">
            <Stack
                className={"position-relative"}
                justifyContent={"center"}
                flexDirection={"row"}
            >
                <Swiper
                    simulateTouch={true}
                    loop={true}
                    spaceBetween={30}
                    speed={1000}
                    autoplay={{
                        delay: 6000,
                    }}
                    effect={"fade"}
                    navigation={true}
                    modules={modules}
                    onAutoplayTimeLeft={onAutoplayTimeLeft}
                    className="homeSwiper"
                >
                    <SwiperSlide className="slide_item_1 slide_vid position-relative ">
                        <video
                            loop
                            muted
                            autoPlay
                            playsInline
                            disableRemotePlayback
                            className="w-100"
                        >
                            <source
                                type="video/mp4"
                                data-src="//images.samsung.com/is/content/samsung/assets/us/home/01172024/HOME_E3_Main-KV_1440x640_pc_LTR.mp4"
                                src="//images.samsung.com/is/content/samsung/assets/us/home/01172024/HOME_E3_Main-KV_1440x640_pc_LTR.mp4"
                            />
                        </video>
                        <Container>
                            <div className="slide_vid_info galaxy_slide position-absolute">
                                <div className="vid-subtitle text-light btn btn-warning fw-bold">
                                    New
                                </div>
                                <div className="vid-title fs-1 text-secondary fw-bold">
                                    Galaxy S24 ULTRA
                                </div>
                                <div className="pb-3 text-secondary w-50">
                                    Elevate your work with the most epic Galaxy yet, featuring the game-changing power
                                    of Galaxy AI. From researching on the spot to capturing every detail of your projects day or night,
                                    unleash new ways to stay productive, collaborate and more.</div>
                                <button className="btn btn-dark text-light fw-bold" onClick={() => {
                                    history.push("/products/product/66310f10628274d1bb980693")
                                }}>
                                    Purchase
                                </button>
                            </div>
                        </Container>
                    </SwiperSlide>
                    <SwiperSlide className="slide_item_2">
                        <Container className="d-flex align-items-center justify-content-evenly">
                            <div className="slide_vid_info">
                                <div className="vid-subtitle text-light btn btn-warning fw-bold">
                                    New
                                </div>
                                <div className="fs-1 text-secondary fw-bold">
                                    iPhone 15 Pro
                                </div>
                                <div className="text-white pb-4 apple_text">
                                    As part of Apple's ongoing efforts to achieve carbon neutrality by 2030, iPhone 15 Pro and iPhone 15 Pro Max product ranges do not include power adapters and EarPods. Instead, a USB-C charging cable that supports fast charging and is compatible with USB‑C
                                    power adapters and computer ports is included.
                                </div>
                                <button className="btn btn-secondary text-light fw-bold" onClick={() => {
                                    history.push("/products/product/66310c22628274d1bb980686")
                                }}>
                                    Purchase
                                </button>
                            </div>
                            <img src="/icons/apples.jpg" alt="" />
                        </Container>
                    </SwiperSlide>
                    <SwiperSlide className="redmi_home">
                        <Container className="d-flex align-items-center justify-content-end">
                            <div className="redmi_info">
                                <img src="/icons/redme_home_info.svg" width="400px" alt="" />
                                <div className=" text-dark pt-3">
                                    The all-new Sony's LYT-900 sensor features a 1-inch sensor size and 3.2µm 4-in-1 Super Pixel
                                </div>
                                <div className="d-flex align-items-center gap-5 justify-content-center">
                                    <a className="nav-link pt-4"> <span>LEARN MORE</span><i className="fa-solid ms-1 fa-arrow-up-right-from-square"></i></a>
                                    <button className="mt-4 btn btn-secondary"
                                        onClick={() => {
                                            history.push("/products/product/66311b1d628274d1bb9806e5")
                                        }}
                                    >PURCHASE</button>
                                </div>
                            </div>
                        </Container>
                    </SwiperSlide>
                    <div className="autoplay-progress text-warning" slot="container-end">
                        <svg viewBox="0 0 48 48" ref={progressCircle}>
                            <circle style={{ stroke: "#F0B607" }} cx="24" cy="24" r="14"></circle>
                        </svg>
                        <span ref={progressContent}>=</span>
                    </div>
                </Swiper>
                <Box className={scrolled ? "bg-light navbar-container" : 'navbar-container container'}>
                    <Box className={scrolled ? "navbar container" : "navbar"} flexDirection={"row"}>
                        <Box className="navbar-brand nav-item">
                            <NavLink to="/" className={"nav-link"}>
                                <span className="text-secondary fs-1">Andy</span><span className="text-warning">Mobiles</span>
                            </NavLink>
                        </Box>
                        <Stack className="nav navbar" flexDirection={"row"}>
                            <Box className="nav-item">
                                <NavLink to="/" className={scrolled ? "nav-link text-dark" : "nav-link text-secondary"} activeClassName="underline">
                                    Home
                                </NavLink>
                            </Box>
                            <Box className="nav-item" >
                                <NavLink to="/brands" className={scrolled ? "nav-link text-dark" : "nav-link text-secondary"} activeClassName="underline">
                                    Brands
                                </NavLink>
                            </Box>
                            <Box className="nav-item">
                                <NavLink to="/products" className={scrolled ? "nav-link text-dark" : "nav-link text-secondary"} activeClassName="underline">
                                    Products
                                </NavLink>
                            </Box>
                            <Box className="nav-item">
                                <NavLink to="/blogs" className={scrolled ? "nav-link text-dark" : "nav-link text-secondary"} activeClassName="underline">
                                    Blog
                                </NavLink>
                            </Box>
                            {verifiedMemberData ? (
                                <Box className="nav-item">
                                    <NavLink to="/user-page" className={scrolled ? "nav-link text-dark" : "nav-link text-secondary"} activeClassName="underline">
                                        My Page
                                    </NavLink>
                                </Box>
                            ) : null}
                            {verifiedMemberData ? (
                                <Box className="nav-item">
                                    <NavLink to="/track-order" className={scrolled ? "nav-link text-dark" : "nav-link text-secondary"} activeClassName="underline">
                                        Track Orders
                                    </NavLink>
                                </Box>
                            ) : null}

                            <Box className="nav-item">
                                <NavLink to="/faq" className={scrolled ? "nav-link text-dark" : "nav-link text-secondary"} activeClassName="underline">
                                    Faq
                                </NavLink>
                            </Box>
                        </Stack>
                        <Stack className="nav-features fs-5 gap-4" flexDirection={"row"} alignItems={"center"}>
                            {
                                verifiedMemberData ? (
                                    <Box className="nav-item basket_btn">
                                        <button
                                            className={scrolled ? "btn btn-outline-secondary border-0 position-relative" : "btn btn-outline-secondary border-0 position-relative"}
                                            onClick={() => {
                                                history.push(`/user-page/?section=${JSON.stringify("3")}`)
                                            }}
                                        >
                                            <i className="fa-solid fa-thumbs-up" title="Liked Products"></i>
                                            <span className="position-absolute nav-badge top-0 start-100 translate-middle bg-danger border border-light rounded-circle text-center">
                                                {props.likedItemAmount}
                                            </span>
                                        </button>
                                    </Box>
                                ) : null
                            }
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
                </Box>
                <MobileNavTop
                    handleLogOut={props.handleLogOut}
                    handleSignUpOpen={props.handleSignUpOpen}
                    handleBasketOpen={props.handleBasketOpen}
                    ordersAmount={props.ordersAmount}
                />
                <MobileNav />
            </Stack>
        </Box>
    )
}