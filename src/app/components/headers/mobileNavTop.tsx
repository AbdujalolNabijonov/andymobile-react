import { Box, Stack } from "@mui/material"
import { NavLink, useHistory } from "react-router-dom"
import { verifiedMemberData } from "../../apiServices/verified"

export const MobileNavTop = (props: any) => {

    return (
        <Stack
            flexDirection={"row"}
            justifyContent={"space-between"}
            className={"mobile-nav d-none"}
            alignItems={"center"}
        >
            <Box className="navbar-brand nav-item">
                <NavLink to="/" className={"nav-link"}>
                    <span className="text-secondary fs-1">Andy</span><span className="text-warning">Mobiles</span>
                </NavLink>
            </Box>
            <Stack flexDirection={"row"} alignItems={"center"} gap="20px">
                <Box className="nav-item basket_btn">
                    <button
                        className={"btn btn-outline-secondary border-0 position-relative"}
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
        </Stack>
    )
}