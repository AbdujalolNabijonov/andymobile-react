import {Modal } from "@material-ui/core"
import { Backdrop, Box, Stack } from "@mui/material"
import { useState } from "react"
import { OrderItem } from "../../../libs/types/order"
import { serverApi } from "../../../libs/config"
import { stringSplitterHandler } from "../features/stringSplitter"
import { AddCircle, RemoveCircle } from "@mui/icons-material"
import {  sweetFailureProvider } from "../../../libs/sweetAlert"
import OrderServiceApi from "../../apiServices/orderServiceApi"
import { useHistory } from "react-router-dom"
import { verifiedMemberData } from "../../apiServices/verified"
import Definer from "../../../libs/Definer"

export const Basket = (props: any) => {
    //Initializations
    const [checkout, setCheckout] = useState<boolean>(false)
    const history = useHistory()


    //handlers
    function handleCheckout(e: any) { setCheckout(e.target.checked) }
    function handleModifier(num: number, basketItem: OrderItem) {
        const updatedItems = props.addItems.map((ele: OrderItem) => ele.order_id === basketItem.order_id ? { ...ele, item_quantity: ele.item_quantity + num } : ele)
        const fixedItems = updatedItems.filter((ele: OrderItem) => ele.item_quantity !== 0)
        props.setAddItem([...fixedItems])
        props.setOrdersAmount(fixedItems.length)
        localStorage.setItem("basket_items", JSON.stringify(fixedItems))
    }
    function handleRemoveOrder(item: OrderItem) {
        const updatedList = props.addItems.filter((ele: OrderItem) => ele.order_id !== item.order_id);
        props.setAddItem([...updatedList])
        props.setOrdersAmount(updatedList.length)
        localStorage.setItem("basket_items", JSON.stringify(updatedList))
    }

    async function handlePurchaseAll(products: OrderItem[]) {
        try {
            if (!verifiedMemberData) {
                props.handleBasketClose()
                throw new Error(Definer.auth_err1)
            }
            const orderServiceApi = new OrderServiceApi();
            await orderServiceApi.createOrder(products)
            localStorage.setItem("basket_items", JSON.stringify([]))
            props.handleBasketClose()
            history.push("/track-order")
            document.location.reload()
        } catch (err: any) {
            sweetFailureProvider(Definer.auth_err1, false, true)
        }
    }
    return (
        <Box>
            <Modal
                open={props.openBasket}
                onClose={props.handleBasketClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{ timeout: 500 }}

            >
                <Stack
                    className={"bg-light basket_modal"}
                    sx={props.openBasket ? { transform: "translateX(0%)" } : {}}
                >
                    <Stack
                        className="basket_title"
                        justifyContent={"space-between"}
                        flexDirection={"row"}
                        alignItems={"center"}

                    >
                        <div className="fs-3">Cart</div>
                        <div className="close_toggle btn btn-outline-danger" onClick={props.handleBasketClose}><i className="fa-solid fa-xmark"></i></div>
                    </Stack>
                    <Stack
                        className="basket_products "
                        justifyContent={"center"}
                    >
                        {props.addItems.map((basket: OrderItem, index: number) => {
                            const basket_image_url = basket.product_image ? `${serverApi}/${basket.product_image}` : "";
                            const total_price = basket.item_price * basket.item_quantity;
                            return (
                                <Stack
                                    direction={"row"}
                                    justifyContent={"space-between"}
                                    style={{ padding: "20px 10px", borderBottom: "1px solid Black" }}
                                >
                                    <div className="product_img">
                                        <img src={basket_image_url} alt="" />
                                    </div>
                                    <Stack className="product_info ms-2" flexDirection={"row"}>
                                        <Stack className="product_price" flexDirection={"column"} gap="5px">
                                            <div className="product_name fs-5">
                                                {basket.item_name}
                                            </div>
                                            <Stack
                                                className="mt-4"
                                                flexDirection={"row"}
                                                alignItems={"center"}
                                                gap={"7px"}
                                            >
                                                <Stack
                                                    flexDirection={"row"}
                                                    className="product_price fs-5"
                                                    gap={"10px"}
                                                    style={{ borderBottom: "1px solid black", width: "70px", cursor: 'pointer' }}
                                                    justifyContent={"space-between"}
                                                >
                                                    <div className="add_product" onClick={() => handleModifier(-1, basket)}><RemoveCircle /></div>
                                                    <div className="product_amount">{basket.item_quantity}</div>
                                                    <div className="add_product" onClick={() => handleModifier(1, basket)} ><AddCircle /></div>
                                                </Stack>
                                                <div>
                                                    <div><i className="fa-solid fa-equals"></i></div>
                                                </div>
                                                <div className="acctual_price fs-6 fw-bold">
                                                    {stringSplitterHandler(total_price, 3, ".")}₩
                                                </div>
                                            </Stack>
                                        </Stack>
                                    </Stack>
                                    <div className="product_remove_btn btn btn-outline-secondary" onClick={() => handleRemoveOrder(basket)}>
                                        <i className="fa-solid fa-xmark"></i>
                                    </div>
                                </Stack>
                            )
                        })}
                    </Stack>

                    <div className="mt-4 basket-footer">
                        <hr />
                        <Stack flexDirection={"row"} justifyContent={"space-between"} className="fw-bold">
                            <div>Total:</div>
                            <div>{stringSplitterHandler(props.addItems.reduce((a: number, ele: OrderItem, s: number) => ele.item_quantity * ele.item_price + a, 0), 3, ".")}₩</div>
                        </Stack>
                        <hr />
                        <Stack className="terms mt-2 mb-4" flexDirection={"row"} gap={'10px'} alignItems={"center"}>
                            <input id={"terms"} type="checkbox" onChange={handleCheckout} />
                            <label htmlFor="terms">I agree with the terms and conditions</label>
                        </Stack>
                        <button className={!checkout ? "btn btn-danger d-block w-100 mb-3 disabled" : "btn btn-danger d-block w-100 mb-3"} onClick={async () => await handlePurchaseAll(props.addItems)} disabled={!checkout}>ChECKOUT</button>
                        <button className="btn btn-dark d-block w-100">VIEW CART</button>
                    </div>
                </Stack>
            </Modal>
        </Box>
    )
}