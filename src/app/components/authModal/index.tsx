import React, { useState } from "react";
import { Backdrop, Fade, Modal } from "@material-ui/core"
import { Box, Stack } from "@mui/material"
import { sweetErrorHandling, sweetTopSmallSuccessAlert } from "../../../libs/sweetAlert";
import assert from "assert"
import { MemberServiceApi } from "../../apiServices/memberServiceApi";
import { SignUpMember } from "../../../libs/types/member";
import Definer from "../../../libs/Definer";
import "./../../css/authModal.css"


export const AuthenticationModal = (props: any) => {
    //Initilizations
    const [signIn, toggle] = React.useState(true);
    const [mb_nick, setMb_nick] = React.useState('');
    const [mb_phone, setMb_phone] = React.useState("");
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState("");
    const [checkPassword, setCheckPassword] = React.useState("");
    const [login_mb_nick, set_login_mb_nick] = useState<string>("")
    const [login_mb_email, set_login_mb_email] = useState<string>("")
    const [login_mb_password, set_login_mb_password] = useState<string>("")
    const resizeWidth = window.screen.width
    //Handlers
    const handleSignUpRequest = async () => {
        try {
            const isFullFilled = (mb_nick !== "" && email !== "") && (password !== "" && checkPassword !== "")
            const signUpData: SignUpMember = {
                mb_nick: mb_nick,
                mb_password: password,
                mb_email: email,
                mb_phone: mb_phone
            }
            assert.ok(isFullFilled, Definer.input_err1);
            const checkEmail = await handleEmailValidator(email)
            if (!checkEmail) {
                sweetErrorHandling({ message: Definer.input_err3 })
                props.handleSignUpClose()
                return false
            }
            const doubleCheckPassword = password === checkPassword
            assert.ok(doubleCheckPassword, Definer.input_err2)
            const memberServiceApi = new MemberServiceApi()
            await memberServiceApi.memberRequestSignUp(signUpData)
            props.handleSignUpClose()
            sweetTopSmallSuccessAlert("Successfull Signed up.", 2000)
        } catch (err: any) {
            props.handleSignUpClose()
            await sweetErrorHandling(err)
        }
    }
    async function handleLogInRequest() {
        try {
            const memberServiceApi = new MemberServiceApi();
            const isFullFilled = (login_mb_email !== "" || login_mb_nick !== "") && login_mb_password !== ""
            assert.ok(isFullFilled, Definer.input_err1)
            let loginData;
            if (login_mb_email.includes("@")) {
                loginData = {
                    mb_email: login_mb_email,
                    mb_password: login_mb_password,
                }
            } else {
                loginData = {
                    mb_nick: login_mb_nick,
                    mb_password: login_mb_password,
                }
            }
            await memberServiceApi.loginRequest(loginData)
            props.handleSignUpClose()
            await sweetTopSmallSuccessAlert("Successfully, logged in")
        } catch (err: any) {
            props.handleSignUpClose()
            sweetErrorHandling(err)
        }
    }
    const handleLogInUserName = (e: any) => {
        if (!e.target.value.includes("@")) {
            set_login_mb_nick(e.target.value)
        } else {
            set_login_mb_email(e.target.value)
        }
    }
    const handleEmailValidator = async (text: string) => {
        const validate_emails = ["gmail", "yahoo", "mail", "yandex", "hotman", "outlook", "icloud", "gmx", "hubspot", "pm"]
        return validate_emails.some((ele) => text.includes(ele))
    }
    const handleKeyDownSignUp = (e: any) => {
        if (e.key === "Enter") {
            handleSignUpRequest()
        }
    }
    const handleKeyDownLogIn = (e: any) => {
        if (e.key === "Enter") {
            handleLogInRequest()
        }
    }
    return (
        <Box className="modal_auth">
            <Modal
                aria-labelledby="transition modal-title"
                aria-describedby="transition modal description"
                onClose={props.handleSignUpClose}
                open={props.openAuth}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{ timeout: 500 }}
            >
                <Fade
                    in={props.openAuth}
                >
                    <Stack className="bg-light authMain" sx={{ width: "800px", height: "400px", position: "absolute", top: "25%", left: "26%", borderRadius: "20px" }}>
                        <Box className="auth_container">
                            <Box className={"auth_signUp"} style={signIn ? {} : { transform: "translateX(100%)", opacity: "1", zIndex: "5" }}>
                                <Box className={"signUp_body"}>
                                    <div className="login_title fw-bold m-0 mb-2 fs-2">Create Account</div>
                                    <div className="form-floating w-100">
                                        <input type="text" className="form-control" id="floatingUser" placeholder="User Name" onChange={(e) => { setMb_nick(e.target.value) }} />
                                        <label htmlFor="floatingUser">User Name</label>
                                    </div>
                                    <div className="form-floating w-100">
                                        <input type="email" className="form-control" id="floatingEmail" placeholder="Email" onChange={(e) => { setEmail(e.target.value) }} />
                                        <label htmlFor="floatingEmail">Email</label>
                                    </div>
                                    <div className="form-floating w-100">
                                        <input type="text" className="form-control" id="floatingphone" placeholder="Phone Number" onChange={(e) => { setMb_phone(e.target.value) }} />
                                        <label htmlFor="floatingphone">Phone Number</label>
                                    </div>
                                    <div className="form-floating w-100">
                                        <input type="password" className="form-control" id="floatingpassword" placeholder="Password" onChange={(e) => { setPassword(e.target.value) }} />
                                        <label htmlFor="floatingpassword">Password</label>
                                    </div>
                                    <div className="form-floating w-100">
                                        <input type="password" className="form-control" id="floatingre" placeholder="Re-enter Password" onKeyDown={handleKeyDownSignUp} onChange={(e) => { setCheckPassword(e.target.value) }} />
                                        <label htmlFor="floatingre">Re-enter Password</label>
                                    </div>
                                    <button className={'btn btn-dark'} onClick={handleSignUpRequest} >Sign Up</button>
                                    {resizeWidth < 450 ? (
                                        <div className="text-danger mt-2" onClick={() => toggle(true)}>Sign In</div>
                                    ) : null}

                                </Box>
                            </Box>
                            <Box className={"auth_logIn"}>
                                <Box className={"logIn_body"} style={signIn ? {} : { transform: "translateX(100%)" }}>
                                    <div className="signup_title fw-bold m-0 fs-2 mb-2">Sign in</div>
                                    <div className="form-floating w-100">
                                        <input type="text" className="form-control" id="floatinguser" placeholder="User Name" onChange={handleLogInUserName} />
                                        <label htmlFor="floatinguser">User Name</label>
                                    </div>
                                    <div className="form-floating w-100">
                                        <input type="password" className="form-control" id="floatingpassord" placeholder="Password" onKeyDown={handleKeyDownLogIn} onChange={(e) => set_login_mb_password(e.target.value)} />
                                        <label htmlFor="floatingpassword">Password</label>
                                    </div>
                                    <a className={"auth_anchor text-danger"}>If you forget your password, you can log in with your signed up email address </a>
                                    <button className="btn btn-dark" onClick={handleLogInRequest}>Sign In</button>
                                    {resizeWidth < 450 ? (
                                        <div className="text-danger mt-2" onClick={() => toggle(false)}>Sign Up</div>
                                    ) : null}
                                </Box>
                            </Box>
                            <Box className={"auth_overlay bg-warning"} style={signIn ? {} : { transform: "translateX(-100%)" }}>
                                <Stack alignItems={"center"} flexDirection={"row"} className={"overlay_body"} style={signIn ? { transform: "translateX(-50%)" } : {}}>
                                    <Box className={"overlay"} style={signIn ? {} : { transform: "translate(0)" }}>
                                        <Box className="overlay_panel text-dark">
                                            <div className="left_overlay_title fs-2 fw-bold">Welcome Back!</div>
                                            <p>
                                                To keep connected with us please login with your personal info
                                            </p>
                                            <button className="ghost_button border-0 btn btn-outline-success" onClick={() => toggle(true)}>
                                                Sign In
                                            </button>
                                        </Box>
                                    </Box>
                                    <Box className={"righ_overlay"} style={signIn ? { transform: "translateX(0)" } : {}}>
                                        <Box className="overlay_panel text-dark">
                                            <div className="right_overlay_title fs-2 fw-bold ">Hello, Friend!</div>
                                            <p>
                                                Enter your personal details and start journey with us
                                            </p>
                                            <button className="ghost_button border-0 btn btn-outline-success" onClick={() => toggle(false)}>
                                                Sign Up
                                            </button>
                                        </Box>
                                    </Box>
                                </Stack>
                            </Box>
                        </Box>
                    </Stack>
                </Fade>
            </Modal>
        </Box >
    )
}