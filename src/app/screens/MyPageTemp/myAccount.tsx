import React, { useEffect, useState } from "react"
import { Box, Stack } from "@mui/material"
import { verifiedMemberData } from "../../apiServices/verified"
import { sweetErrorHandling, sweetTopSmallSuccessAlert, sweetTopSuccessAlert } from "../../../libs/sweetAlert"
import { MemberServiceApi } from "../../apiServices/memberServiceApi"
import assert from "assert"
import Definer from "../../../libs/Definer"


export const MyAccount = () => {
    //initilizationss
    const [movePosition, setMovePosition] = useState<string>("left");
    const [userImg, setUserImg] = useState<any>(verifiedMemberData?.mb_image);
    const [updateMember, setUpdateMember] = useState({
        mb_nick: '',
        mb_phone: '',
        mb_email: '',
        mb_description: "",
        mb_image: '',
        mb_address: ''
    });
    const [resetPassword, setResetPassword] = useState({
        old_password: "",
        new_password: ''
    });
    const [validPasswordOne, setValidPasswordOne] = useState("")
    const [validPasswordTwo, setValidPasswordTwo] = useState("")
    //React 3 circles hook
    useEffect(() => {
        window.scrollTo(0, 230)

    }, [])

    //Handlers
    function handleSetting(position: string) { setMovePosition(position) }
    function handleUser(e: any) {
        try {
            const file = e.target.files[0]
            let reader = new FileReader();
            reader.onload = function () {
                setUserImg(reader.result)
            }
            reader.readAsDataURL(file)
            updateMember.mb_image = file
            setUpdateMember({ ...updateMember })
        }
        catch (err) {
            sweetErrorHandling(err)
        }
    }
    function handleChangeName(e: any) {
        const newName = e.target.value;
        updateMember.mb_nick = newName
        setUpdateMember({ ...updateMember })
    }
    const handleChangePhone = (e: any) => {
        const newPhone = e.target.value;
        updateMember.mb_phone = newPhone;
        setUpdateMember({ ...updateMember })
    }
    const handleChangeEmail = (e: any) => {
        const newEmail = e.target.value;
        updateMember.mb_email = newEmail;
        setUpdateMember({ ...updateMember })
    }
    const handleChangeDescription = (e: any) => {
        const description = e.target.value;
        updateMember.mb_description = description;
        setUpdateMember({ ...updateMember })
    }
    const handleChangeAddress = (e: any) => {
        const newAddress = e.target.value;
        updateMember.mb_address = newAddress;
        setUpdateMember({ ...updateMember })
    }
    const handlePreviousPassword = (e: any) => {
        const old_password = e.target.value;
        resetPassword.old_password = old_password;
        setResetPassword({ ...resetPassword })
    }

    const handleSubmitChanges = async () => {
        try {
            const memberServiceApi = new MemberServiceApi();
            const member = await memberServiceApi.updateMember(updateMember)
            assert.ok(member, Definer.general_err1)
            sweetTopSmallSuccessAlert("Successfully updated!", 700, false);
            window.location.reload()
        } catch (err: any) {
            sweetErrorHandling(err)
        }
    }
    const handleResetPassword = async () => {
        try {
            //Validations
            assert.ok(validPasswordOne === validPasswordTwo, Definer.input_err4)
            resetPassword.new_password = validPasswordOne
            setResetPassword({ ...resetPassword })

            //API
            const memberServiceApi = new MemberServiceApi()
            await memberServiceApi.resetPasswordData(resetPassword);
            sweetTopSuccessAlert("Successfully updated", 700, false);
            window.location.reload()
        } catch (err: any) {
            sweetErrorHandling(err).then()
        }
    }
    return (
        <Box className={"my_account position-relative"}>
            <Box className="my_account_header" >
                <Stack
                    flexDirection={"row"}
                    alignItems={"center"}
                >
                    <div className="account_img">
                        <img src={userImg} alt="acccount image" aria-label="Account image" aria-hidden="true"/>
                    </div>
                    <div className="account_info ps-2">
                        <div className="account_name fs-3 fw-bold">{verifiedMemberData?.mb_nick}</div>
                        <div className="mt-3 fs-5">Update your photo and personal details</div>
                    </div>
                    <button className={"update_pic_btn"}>
                        <input type="file" onChange={handleUser} accept="image/*" />
                        <i className="fa-solid fa-camera-retro"></i>
                    </button>
                </Stack>
            </Box>
            <Stack
                direction={"row"}
                className={'setting_controller'}
                gap={"30px"}
            >
                <button
                    className="btn text-warning"
                    style={movePosition === "left" ? { borderBottom: "1px solid black" } : {}}
                    onClick={() => handleSetting("left")}>Profile Settings</button>
                <button
                    className="btn text-warning"
                    style={movePosition === "right" ? { borderBottom: "1px solid black" } : {}}
                    onClick={() => handleSetting("right")}>Password Reset</button>
            </Stack>
            <Stack
                className="my_account_body "
                direction={"row"}
                gap={"30px"}
            >
                <Box
                    style={movePosition === "left" ? { transform: "translateX(0%)" } : { transform: "translateX(-130%)" }}

                >
                    <Stack className="mb-4" flexDirection={"row"} gap={"70px"}>
                        <Box className={"w-50"}>
                            <label htmlFor="update_name" className="fs-5 text-dark fw-bold">User Name</label>
                            <input
                                type="text"
                                className="form-control ps-3  fs-5 w-100"
                                id="update_name"
                                placeholder={verifiedMemberData?.mb_nick}
                                onChange={handleChangeName}
                            />
                        </Box>
                        <Box className={"w-50"}>
                            <label htmlFor="update_phone" className="fs-5 text-dark fw-bold">Update Phone Number</label>
                            <input
                                type="text"
                                className="form-control ps-3  fs-5"
                                id="update_name"
                                placeholder={verifiedMemberData?.mb_phone}
                                onChange={handleChangePhone}
                            />
                        </Box>
                    </Stack>
                    <Stack
                        flexDirection={"row"}
                        gap={"70px"}
                    >
                        <Box className="update_email mt-3 w-50">
                            <label htmlFor="update_phone" className="fs-5 text-dark fw-bold">Address</label>
                            <input
                                type="text"
                                className="form-control ps-3 fs-5"
                                id="update_name"
                                placeholder={verifiedMemberData?.mb_address ? verifiedMemberData?.mb_address : "No address"}
                                onChange={(handleChangeAddress)}
                            />
                        </Box>
                        <Box className="update_email mt-3 w-50">
                            <label htmlFor="update_phone" className="fs-5 text-dark fw-bold">Email Address</label>
                            <input
                                type="text"
                                className="form-control ps-3 fs-5"
                                id="update_name"
                                placeholder={verifiedMemberData?.mb_email ?? "No email address"}
                                onChange={(handleChangeEmail)}
                            />
                        </Box>
                    </Stack>
                    <Box className="update_description mt-3">
                        <label htmlFor="update_phone" className="fs-5 text-dark fw-bold">Bio</label>
                        <textarea
                            className="form-control ps-3 fs-6 mt-3"
                            id="update_name"
                            cols={20}
                            rows={10}
                            placeholder={verifiedMemberData?.mb_description ?? "No description"}
                            onChange={handleChangeDescription}
                        >
                        </textarea>
                    </Box>
                    <Stack alignItems={"end"}>
                        <button
                            className="btn btn-outline-warning mt-5 w-50 fw-bold"
                            onClick={handleSubmitChanges}
                        >
                            Save
                        </button>
                    </Stack>
                </Box>
                <Box
                    style={movePosition === "right" ? { transform: "translateX(-105%)" } : { transform: "translateX(0%)" }}
                >
                    <Box className="update_email mb-3">
                        <label htmlFor="update_phone" className="fs-5 text-dark fw-bold">Old Password</label>
                        <input
                            type="text"
                            className="form-control ps-3 fs-5"
                            id="update_name"
                            placeholder="Please, enter a previous password"
                            onChange={handlePreviousPassword}
                        />
                    </Box>
                    <Stack className="mt-4" flexDirection={"row"} gap={"70px"}>
                        <Box className={"w-50"}>
                            <label htmlFor="update_name" className="fs-5 text-dark fw-bold">New User Password</label>
                            <input
                                type="text"
                                className="form-control ps-3  fs-5 w-100"
                                id="update_name"
                                placeholder="new password"
                                onChange={(e) => {
                                    setValidPasswordOne(e.target.value)
                                }}
                            />
                        </Box>
                        <Box className={"w-50"}>
                            <label htmlFor="update_phone" className="fs-5 text-dark fw-bold">ReEnter New Password</label>
                            <input
                                type="text"
                                className="form-control ps-3  fs-5"
                                id="update_name"
                                placeholder="repeat new password"
                                onChange={(e) => {
                                    setValidPasswordTwo(e.target.value)
                                }}
                            />
                        </Box>
                    </Stack>
                    <Stack alignItems={"end"}>
                        <button
                            className="btn btn-outline-warning mt-5 w-50 fw-bold"
                            onClick={handleResetPassword}
                        >
                            Save
                        </button>
                    </Stack>
                </Box>
            </Stack>
        </Box>
    )
}