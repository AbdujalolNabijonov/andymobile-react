import { Box, Stack, Typography } from "@mui/material"
import { stringSplitterHandler } from "../../components/features/stringSplitter";
import { OrderItem } from "../../../libs/types/order";
import { serverApi } from "../../../libs/config";

//REDUX
import { useSelector } from "react-redux";
import { createSelector } from "reselect"
import { chosenOrderRetrieve, chosenTargetTransactionRetrieve } from "./selector";

import Moment from "react-moment";
import { sweetTopSmallSuccessAlert } from "../../../libs/sweetAlert";


//SELECTOR
const retrieverChosenOrder = createSelector(
    chosenOrderRetrieve,
    (chosenOrder) => ({ chosenOrder })
)

const retrieverChosenTargetTransaction = createSelector(
    chosenTargetTransactionRetrieve,
    (chosenTargetTransaction) => ({ chosenTargetTransaction })
)

const OrderFinished = (props: any) => {
    //Initializations
    const { chosenOrder } = useSelector(retrieverChosenOrder)
    const { chosenTargetTransaction } = useSelector(retrieverChosenTargetTransaction)
    async function handleDelivered() {
        await props.handleProcessCheckout("DELIVERED")
        await sweetTopSmallSuccessAlert("Thank you for bealive!", 500, false)
    }
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
    return (
        <TabPanel value={props.value} index={props.index}>
            {
                chosenOrder && (chosenOrder.order_status === "FINISHED" || chosenOrder?.order_status === "DELIVERED") ? (
                    <Box className="finished_orders">
                        <div className="order_info">
                            <div className="text-center fw-bold mb-3 fs-3">Order Transaction Info</div>
                            <Stack className="order_code" direction={"row"} justifyContent={"space-between"}>
                                <Stack flexDirection={"row"} gap={"5px"} alignItems={"center"}>
                                    <i className="fa-solid fa-key"></i>
                                    <div className="fw-bold fs-5">Order Code</div>
                                </Stack>
                                <div className="fw-bold text-warning fs-6">{chosenOrder?.order_code}</div>
                            </Stack>
                            <Stack className="order_code" direction={"row"} justifyContent={"space-between"}>
                                <Stack flexDirection={"row"} gap={"5px"} alignItems={"center"}>
                                    <i className="fa-solid fa-cash-register"></i>
                                    <div className="fw-bold fs-5">Subtotal</div>
                                </Stack>
                                <div className="fw-bold text-warning fs-6">{stringSplitterHandler(chosenOrder?.order_items?.reduce((a: number, current: OrderItem) => a + current.item_price, 0) ?? 0, 3, ".")}₩</div>
                            </Stack>
                            <Stack className="order_code" direction={"row"} justifyContent={"space-between"}>
                                <Stack flexDirection={"row"} gap={"5px"} alignItems={"center"}>
                                    <i className="fa-solid fa-wallet"></i>
                                    <div className="fw-bold fs-5">Total Price</div>
                                </Stack>
                                <div className="fw-bold text-warning fs-6">{stringSplitterHandler(chosenOrder?.order_items?.reduce((a: number, current: OrderItem) => a + current.item_price * current.item_quantity, 0) ?? 0, 3, ".")}₩</div>
                            </Stack>
                            <Stack className="order_code" direction={"row"} justifyContent={"space-between"}>
                                <Stack flexDirection={"row"} gap={"5px"} alignItems={"center"}>
                                    <i className="fa-solid fa-user"></i>
                                    <div className="fw-bold fs-5">Transaction Owner</div>
                                </Stack>
                                <div className="fw-bold text-warning fs-6">{chosenTargetTransaction?.trans_owner}</div>
                            </Stack>
                            <Stack className="order_code" direction={"row"} justifyContent={"space-between"}>
                                <Stack flexDirection={"row"} gap={"5px"} alignItems={"center"}>
                                    <i className="fa-regular fa-credit-card"></i>
                                    <div className="fw-bold fs-5">Card Number</div>
                                </Stack>
                                <div className="fw-bold text-warning fs-6">{stringSplitterHandler(chosenTargetTransaction?.trans_card_number ?? 0, 4, "  ")}</div>
                            </Stack>
                            <Stack className="order_code" direction={"row"} justifyContent={"space-between"}>
                                <Stack flexDirection={"row"} gap={"5px"} alignItems={"center"}>
                                    <i className="fa-solid fa-truck-fast"></i>
                                    <div className="fw-bold fs-5">Shipped to</div>
                                </Stack>
                                <div className="fw-bold text-warning fs-6">{chosenTargetTransaction?.order_address}</div>
                            </Stack>
                            <Stack className="order_code" direction={"row"} justifyContent={"space-between"}>
                                <Stack flexDirection={"row"} gap={"5px"} alignItems={"center"}>
                                    <i className="fa-solid fa-clock"></i>
                                    <div className="fw-bold fs-5">Transaction Date</div>
                                </Stack>
                                <div className="fw-bold text-warning fs-6"><Moment format="YYYY-MM-DD HH:mm">{chosenTargetTransaction?.createdAt}</Moment></div>
                            </Stack>
                            <div className="float-end mt-2">
                                <button className="btn btn-success" onClick={handleDelivered}>Pruduct Delivered</button>
                            </div>
                        </div>
                        <div className="purchased_products">
                            <Box
                                className={"processed_products"}
                                style={{ height: "100%", width: "100%" }}
                            >
                                {
                                    (chosenOrder?.order_status === "FINISHED" || chosenOrder?.order_status === "DELIVERED") && chosenOrder?.order_items?.map((order: OrderItem) => {
                                        const image_url = order.product_image ? `${serverApi}/${order.product_image}` : "/pictures/products/black_phone.webp"
                                        return (
                                            <Stack
                                                direction={"row"}
                                                alignItems={"center"}
                                                gap={"40px"}
                                                className="border-bottom mb-3 pb-2"
                                            >
                                                <div className="processed_product_img position-relative">
                                                    <img src={image_url} alt="product" />
                                                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger text-light fs-6">
                                                        {order.item_quantity}
                                                    </span>
                                                </div>
                                                <div className="processed_product_info">
                                                    <div>{order.item_name}</div>
                                                    <div><span className="pe-2"><b>color:</b> {order.item_color}</span><span><b>storage:</b> {order.item_storage < 10 ? order.item_storage + "TB" : order.item_storage + "GB"}</span></div>
                                                </div>
                                                <div className="processed_product_price fw-bold">
                                                    {stringSplitterHandler(order.item_price * order.item_quantity, 3, ".")}₩
                                                </div>
                                            </Stack>
                                        )
                                    })
                                }
                            </Box>
                        </div>
                    </Box>
                ) : (
                    <div
                        className=" text-secondary rounded mt-2 fs-6 p-2 text-center"
                        style={{ backgroundColor: "#DBDDEF" }}
                    >
                        There is no order!
                    </div>
                )
            }

        </TabPanel>
    )
}

export default OrderFinished