import React, { useEffect, useState } from "react"
import { Box, Stack, Container } from "@mui/material"
import { NavLink, useHistory } from "react-router-dom";
import { verifiedMemberData } from "../../apiServices/verified";
import { MobileNav } from "./mobileNav";
import { MobileNavTop } from "./mobileNavTop";
import "../../css/navbar.css"

export const NavbarOthers = (props: any) => {
    //initializations
    const wallpapers: any = {
        Brands: "https://beb-consultancy.b-cdn.net/wp-content/uploads/2018/10/Contracts-Agreements.jpg",
        Faq: "https://searchengineland.com/wp-content/seloads/2015/06/question-ask-faq-raise-hand-ss-1920.jpg",
        Community: "https://img.freepik.com/free-vector/people-crowd-diverse-characters-waving-hand_107791-14082.jpg?w=1380&t=st=1707456518~exp=1707457118~hmac=3265d932d404d7892ad0eac511bc5923cddc8e6fa6c8abdf89635bbb25fe940c",
        "Track My Order": "https://img.freepik.com/free-vector/isometric-e-commerce-elements-background_52683-536.jpg?w=1060&t=st=1709060021~exp=1709060621~hmac=814791e9597e2763ede47c0cf7b4fba8a622110c6d45b716189a3f03ade384dd",
        Blogs: "https://content-writing-india.com/blog/wp-content/uploads/2018/03/1080px.jpg",
        "My Page": "https://m-cdn.phonearena.com/images/article/64576-wide-two_1200/The-Best-Phones-to-buy-in-2024---our-top-10-list.webp?1707223752"
    }
    const image_url = wallpapers[props.addressTitle]
    const current_url = `/${props.addressTitle.toLowerCase()}`
    const [scrolled, setScrolled] = useState<boolean>(false)
    const history = useHistory()

    //Three Circle Hook
    useEffect(() => {
        function handleScroll() {
            setScrolled(window.scrollY > 50)
        };
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        }

    }, [])

    return (
        <Box>
            <Box className="otherNavbar position-relative" >
                <div className="navbar_wrapper"></div>
                <Stack
                    className={scrolled ? "bg-light navbar-container" : ' bg-light container'}
                >
                    <Box
                        className={scrolled ? "navbar container" : " text-light navbar container position-absolute "}
                        flexDirection={"row"}
                    >
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
                <Box className="navbar-address" style={{ backgroundImage: `url(${image_url})` }}>
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