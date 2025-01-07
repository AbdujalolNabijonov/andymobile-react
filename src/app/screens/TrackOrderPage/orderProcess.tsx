import { Accordion, AccordionDetails, AccordionSummary, Box, Stack, Typography } from "@mui/material"
import {useRef, useState } from "react"
import { CardDetail, OrderItem } from "../../../libs/types/order"
import { verifiedMemberData } from "../../apiServices/verified"
import { sweetErrorHandling } from "../../../libs/sweetAlert"
import Definer from "../../../libs/Definer"
import TransactionServiceApi from "../../apiServices/transactionServiceApi"
import assert from "assert"

//Redux
import { createSelector } from "reselect"
import { serverApi } from "../../../libs/config";
import { stringSplitterHandler } from "../../components/features/stringSplitter";

import { Transaction } from "../../../libs/types/bank";
import { useDispatch, useSelector } from "react-redux"
import { chosenOrderRetrieve } from "./selector"
import { Dispatch } from "@reduxjs/toolkit"
import { setChosenTargetTransaction } from "./slice"

//Slice
const actionDispatch = (dispatch: Dispatch) => ({
    setChosenTargetTransaction: (data: Transaction) => dispatch(setChosenTargetTransaction(data))
})

//Selector
const retrieveChosenOrder = createSelector(
    chosenOrderRetrieve,
    (chosenOrder) => ({ chosenOrder })
)
const OrderProcess = (props: any) => {
    //Initializations
    const { chosenOrder } = useSelector(retrieveChosenOrder)
    const [openAccordionAddress, setOpenAccordionAddress] = useState<boolean>(true)
    const [openAccordionCard, setOpenAccordionCard] = useState<boolean>(true)
    const [cardDetail, setCardDetail] = useState<CardDetail>({
        exist_card: false,
        exist_address: false,
        order_code: chosenOrder?.order_code ?? "",
        order_id: chosenOrder?._id ?? "",
        order_address: verifiedMemberData?.mb_address,
        trans_owner: '',
        trans_card_number: 0,
        trans_card_expiry: '',
        trans_card_cvc: 0,
        trans_card_pincode: ''
    })
    const { setChosenTargetTransaction } = actionDispatch(useDispatch())
    const refs: any = useRef([])
    //Handl ers
    function TabPanel(props: any) {
        const { children, value, index, ...other } = props;

        return (
            <div
                role="tabpanel"
                hidden={value !== index}
                id={`full-width-tabpanel-${index}`}
                aria-labelledby={`full-width-tab-${index}`}
                {...other}
            >
                {value === index && (
                    <Box sx={{ mt: 5 }}>
                        <Typography>{children}</Typography>
                    </Box>
                )}
            </div>
        );
    }
    function handleOpenAccordionAddress(e: any, opt: string) {
        if (e.target.checked && opt === "yes") {
            if (!verifiedMemberData?.mb_address) {
                sweetErrorHandling({ message: Definer.trans_err1 }).then()
                setOpenAccordionAddress(true)
            } else {
                cardDetail.exist_address = true;
                setCardDetail({ ...cardDetail })
                setOpenAccordionAddress(false)
            }
        } else if (e.target.checked && opt === "no") {
            setOpenAccordionAddress(true)
        }
    }
    async function handleOpenAccordionCard(e: any, chosenFeature: string) {
        if (e.target.checked && chosenFeature === "existDepit") {
            const transactionServiceApi = new TransactionServiceApi();
            const exsistCard = await transactionServiceApi.getChosenBankCard()
            if (exsistCard && exsistCard.card_number) {
                cardDetail.exist_card = true
                cardDetail.trans_owner = exsistCard.card_owner_name;
                cardDetail.trans_card_number = exsistCard.card_number;
                cardDetail.trans_card_expiry = exsistCard.card_expiry;
                cardDetail.trans_card_cvc = exsistCard.card_cvc;
                cardDetail.trans_card_pincode = exsistCard.card_pincode
                setCardDetail({ ...cardDetail })
                setOpenAccordionCard(false)
            } else {
                sweetErrorHandling({ message: Definer.trans_err2 }).then()
                setOpenAccordionCard(true)
            }
        } else if (e.target.checked && chosenFeature === "extraDebit") {
            cardDetail.exist_card = false
            setCardDetail({ ...cardDetail })
            setOpenAccordionCard(true)
        }
    }
    function handleCardNumber(e: React.ChangeEvent<HTMLInputElement>) {
        e.target.value = e.target.value.replace(/\D/g, '');
    }
    async function handleProceedPayment() {
        try {
            let order_address = cardDetail.exist_address ? verifiedMemberData.mb_address : refs.current.address.value;
            if (cardDetail.exist_card) {
                assert.ok(
                    order_address !== "" &&
                    cardDetail.order_id !== undefined,
                    Definer.input_err1
                )
                props.handleProcessCheckout("FINISHED");
                const transactionServiceApi = new TransactionServiceApi();
                const data = await transactionServiceApi.createTransactionData({
                    exist_card: cardDetail.exist_card,
                    order_address: order_address,
                    order_code: chosenOrder?.order_code,
                    order_id: chosenOrder?._id
                })
                setChosenTargetTransaction(data)
            } else {
                assert.ok(
                    order_address !== "" &&
                    chosenOrder?._id !== undefined &&
                    refs.current.secure.value !== "" &&
                    refs.current.expiry.value !== "" &&
                    refs.current.cardNumber.value !== "" &&
                    refs.current.pincode.value !== '' &&
                    refs.current.cardName.value !== '',
                    Definer.input_err1
                )

                props.handleProcessCheckout("FINISHED");
                const transactionServiceApi = new TransactionServiceApi();
                transactionServiceApi.createTransactionData(
                    {
                        exist_card: cardDetail.exist_card,
                        order_id: chosenOrder._id,
                        order_address: order_address,
                        order_code: chosenOrder.order_code,
                        trans_card_cvc: refs.current.secure.value,
                        trans_card_expiry: refs.current.expiry.value,
                        trans_card_number: refs.current.cardNumber.value,
                        trans_card_pincode: refs.current.pincode.value,
                        trans_owner: refs.current.cardName.value
                    }
                ).then(data => {
                    setChosenTargetTransaction(data)
                })
            }
        } catch (err: any) {
            console.log(err)
            sweetErrorHandling(err).then()
        }
    }
    const handleExpiryCard = async (e: any) => {
        try {
            if ((e.target.value.slice(0, 2) * 1) > 12 || (e.target.value.slice(2) * 1) > 31) {
                e.target.value = ""
                e.target.focus()
                throw new Error(Definer.input_err5)
            } else {
                e.target.value = e.target.value.replace(/\D/g, "")
                if (e.target.value.length === 4) {
                    cardDetail.trans_card_expiry = (e.target.value.substring(0, 2) + "/" + e.target.value.substring(2))
                }
            }
        } catch (err: any) {
            await sweetErrorHandling({ message: err.message })
        }
    }
    function handleSecureCode(e: any) {
        e.target.value = e.target.value.replace(/\D/g, "")
    }
    return (
        <TabPanel value={props.value} index={props.index}>
            {chosenOrder && chosenOrder.order_status === "PROCESS" ? (
                <Stack
                    className="process_checkout"
                    direction={"row"}
                    gap={"20px"}
                >
                    <Box className="delivery_details" style={{ width: "40%" }}>
                        <div className="rounded p-3">
                            <div className="form-check  fs-5">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="flexRadioDefault"
                                    id="flexRadioDefault1"
                                    style={{ opacity: 1, position: "static" }}
                                    onChange={(e) => handleOpenAccordionAddress(e, "yes")}
                                    checked={!openAccordionAddress}
                                />
                                <label className="form-check-label text-dark fw-bold" htmlFor="flexRadioDefault1">
                                    Existed Address on Account
                                </label>
                            </div>
                        </div>
                        <Accordion expanded={openAccordionAddress} className="address_filling">
                            <AccordionSummary>
                                <div className="form-check fs-5">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name="flexRadioDefault"
                                        id="modifyAddress"
                                        style={{ opacity: 1, position: "static" }}
                                        onChange={(e) => handleOpenAccordionAddress(e, "no")}
                                        checked={openAccordionAddress}
                                    />
                                    <label
                                        htmlFor="modifyAddress"
                                        className="text-dark fw-bold form-check-label"
                                    >
                                        Select Different Address
                                    </label>
                                </div>
                            </AccordionSummary>
                            <AccordionDetails className="show">
                                <div className="form-floating">
                                    <input
                                        ref={(ele) => refs.current["address"] = ele}
                                        type="text"
                                        className="form-control p-1"
                                        id="last_name"
                                        placeholder="Last Name"
                                    />
                                    <label htmlFor="last_name">Address</label>
                                </div>
                                <div className="text-danger">Ex: Jeollanam-do Yeosu-si Mipyeong-dong 707-1 102</div>
                            </AccordionDetails>
                        </Accordion>
                        <div className="rounded p-3">
                            <div className="form-check  fs-5">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="debit_card"
                                    id="debit_card"
                                    style={{ opacity: 1, position: "static" }}
                                    onChange={(e) => handleOpenAccordionCard(e, "existDepit")}
                                    checked={!openAccordionCard}
                                />
                                <label className="form-check-label text-dark fw-bold" htmlFor="debit_card">
                                    Use Existed Card On Account
                                </label>
                            </div>
                        </div>
                        <Accordion expanded={openAccordionCard}>
                            <AccordionSummary>
                                <div className="form-check  fs-5">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name="debit_card"
                                        id="debit_card_2"
                                        style={{ opacity: 1, position: "static" }}
                                        onChange={(e) => handleOpenAccordionCard(e, "extraDebit")}
                                        checked={openAccordionCard}
                                    />
                                    <label className="form-check-label text-dark fw-bold" htmlFor="debit_card_2">
                                        <Stack direction={"row"} gap={"30px"}>
                                            <div>Different Debit Card</div>
                                            <div><img src="/icons/credit_cards.jpg" alt="credits" width={"100px"} /></div>
                                        </Stack>
                                    </label>
                                </div>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Stack direction={"row"} alignItems={"center"}>
                                    <div className="card-number form-floating col-11">
                                        <input
                                            ref={(ele) => refs.current["cardNumber"] = ele}
                                            type="text"
                                            placeholder="card Number"
                                            id="cardNumber"
                                            className="form-control"
                                            onChange={handleCardNumber}
                                            maxLength={16}
                                            title="Should contain 16 digit numbers"
                                        />
                                        <label htmlFor="cardNumber">Card Number</label>
                                    </div>
                                    <div className="bg-warning" style={{ padding: "10px" }}>
                                        <i className="fa-regular fa-credit-card"></i>
                                    </div>
                                </Stack>
                                <Stack direction={"row"} gap={"20px"}>
                                    <div className="form-floating">
                                        <input
                                            ref={(ele) => refs.current["expiry"] = ele}
                                            type="text"
                                            id={"expireCard"}
                                            className="form-control"
                                            placeholder="Expiration date(MM/YY)"
                                            onChange={handleExpiryCard}
                                            maxLength={4}
                                            title="Enter, expire of card as shown as MMYY"
                                        />
                                        <label htmlFor="expireCard">Expire (MM/YY)</label>
                                    </div>
                                    <div className="form-floating">
                                        <input
                                            ref={(ele) => refs.current["pincode"] = ele}
                                            type="password"
                                            id={"pin"}
                                            className="form-control"
                                            placeholder="2 PinCode"
                                            onChange={(e) => {
                                                e.target.value = e.target.value.replace(/\D/g, "")
                                            }}
                                            maxLength={2}
                                            title="Please, enter first two digit pincode!"
                                        />
                                        <label htmlFor="pin">PinCode</label>
                                    </div>
                                    <div className="form-floating">
                                        <input
                                            ref={ele => refs.current["secure"] = ele}
                                            type="text"
                                            id={"expireCard"}
                                            className="form-control"
                                            placeholder="Security code"
                                            onChange={handleSecureCode}
                                            maxLength={3}
                                            title="Secure code known as CVC"
                                        />
                                        <label htmlFor="expireCard">Security code</label>
                                    </div>
                                </Stack>
                                <div className="form-floating">
                                    <input
                                        ref={ele => refs.current["cardName"] = ele}
                                        type="text"
                                        placeholder="Name on card"
                                        className="form-control"
                                        id="cardName"
                                        onChange={(e) => {
                                            e.target.value = e.target.value.replace(/\d/g, "")
                                        }}
                                        minLength={4}
                                        title="At least 4 characters, NOT A NUMBER!"
                                    />
                                    <label htmlFor="cardName">Name on card</label>
                                </div>
                            </AccordionDetails>
                        </Accordion>
                    </Box>
                    <Box
                        style={{ width: "60%" }}
                    >
                        <Stack className={"processed_products"}>
                            {
                                chosenOrder.order_items.map((order: OrderItem, index: number) => {
                                    const order_item_pic = order.product_image ? `${serverApi}/${order.product_image}` : "/pictures/products/black_phone.webp"
                                    return (
                                        <Stack
                                            direction={"row"}
                                            alignItems={"center"}
                                            gap={"50px"}
                                            className="border-bottom mb-3 pb-2 ps-4"
                                        >
                                            <div className="processed_product_img position-relative">
                                                <img src={order_item_pic} alt="product" />
                                                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger text-light fs-6">
                                                    {order.item_quantity}
                                                </span>
                                            </div>
                                            <div className="processed_product_info">
                                                <div><b>{order.item_name}</b></div>
                                                <div><span className="pe-2"><b>Color:</b> {order.item_color}</span><span><b>Storage:</b> {order.item_storage < 10 ? order.item_storage + "TB" : order.item_storage + "GB"}</span></div>
                                            </div>
                                            <div className="processed_product_price fw-bold">
                                                {stringSplitterHandler(order.item_quantity * order.item_price, 3, ".")}₩
                                            </div>
                                        </Stack>
                                    )
                                })
                            }
                        </Stack>
                        <Stack className="fs-4 ps-5 pe-5" direction={"row"} justifyContent={"space-between"}>
                            <div>Subtotal</div>
                            <div>{stringSplitterHandler(chosenOrder.order_items.reduce((a: number, b: OrderItem) => a + b.item_price, 0), 3, ".")}₩</div>
                        </Stack>
                        <Stack className="fs-2 ps-5 pe-5 fw-bold" direction={"row"} justifyContent={"space-between"}>
                            <div>Total</div>
                            <div>{stringSplitterHandler(chosenOrder.order_items.reduce((a: number, b: OrderItem) => a + (b.item_price * b.item_quantity), 0), 3, ".")}₩</div>
                        </Stack>
                        <Stack
                            direction={"row"}
                            justifyContent={"center"}
                            gap={"50px"}
                            className="mt-5"
                        >
                            <button className="btn btn-danger" onClick={() => props.handleProcessCheckout("CANCELED")}>Cancel order</button>
                            <button className="btn btn-warning" onClick={() => props.handleProcessCheckout("PAUSED")}>Back to Selection</button>
                            <button className="btn btn-dark " onClick={() => handleProceedPayment()}>Proceed Payment</button>
                        </Stack>
                    </Box>
                </Stack>
            ) : (
                <Box style={{ padding: "0 30px 0 20px" }}>
                    <div
                        className=" text-secondary rounded mt-2 fs-6 p-2 text-center"
                        style={{ backgroundColor: "#DBDDEF", }}
                    >
                        There is no order!
                    </div>
                </Box>
            )}
        </TabPanel>
    )
}

export default OrderProcess