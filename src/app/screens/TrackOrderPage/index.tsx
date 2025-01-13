import React, { useEffect, useState } from "react";
import { Box, Container, Stack, Tab, Tabs } from "@mui/material";
import OrderServiceApi from "../../apiServices/orderServiceApi";
import SwipeableViews from "react-swipeable-views";
import { useTheme } from "@mui/material"
import { stringSplitterHandler } from "../../components/features/stringSplitter";
import { verifiedMemberData } from "../../apiServices/verified";
import OrderPaused from "./orderPaused";
import OrderProcess from "./orderProcess";
import OrderFinished from "./orderFinished";
import TransactionServiceApi from "../../apiServices/transactionServiceApi";
import { DownToUpBtn } from "../../components/features/downToUpBtn";
import { Order } from "../../libs/types/order";
import { Transaction } from "../../libs/types/bank";
import { sweetFailureProvider, sweetTopSmallSuccessAlert } from "../../libs/sweetAlert";
import Definer from "../../libs/Definer";
import "../../css/trackOrderPage.css"

//REDUX
import Moment from "react-moment";
import { createSelector } from "reselect"
import { Dispatch } from "@reduxjs/toolkit";
import { setChosenOrder, setChosenTargetTransaction, setTargetOrders } from "./slice";
import { chosenOrderRetrieve, targetOrdersRetrieve } from "./selector";
import { useDispatch, useSelector } from "react-redux";

//SLICE
const actionDispatch = (dispatch: Dispatch) => ({
    setTargetOrders: (data: Order[]) => dispatch(setTargetOrders(data)),
    setChosenOrder: (data: Order) => dispatch(setChosenOrder(data)),
    setChosenTargetTransaction: (data: Transaction) => dispatch(setChosenTargetTransaction(data))
})

//SELECTOR
const retrieverTargetOrders = createSelector(
    targetOrdersRetrieve,
    (targetOrders) => ({ targetOrders })
)

const retrieverChosenOrder = createSelector(
    chosenOrderRetrieve,
    (chosenOrder) => ({ chosenOrder })
)

const TrackOrderPage = (props: any) => {
    //Initilizations
    const [orderStatus, setOderStatus] = useState<string>("PAUSED")
    const [searchObj, setSearchObj] = useState({
        search: "",
    })
    const [rebuild, setRebuild] = useState<Date>(new Date())
    const { setTargetOrders, setChosenOrder, setChosenTargetTransaction } = actionDispatch(useDispatch())
    const { targetOrders } = useSelector(retrieverTargetOrders)
    const { chosenOrder } = useSelector(retrieverChosenOrder)
    const [value, setValue] = useState<number>(0)
    const [orderId, setOrderId] = useState<string>('')
    const theme = useTheme()
    //three circle React Hook
    useEffect(() => {
        const orderServiceApi = new OrderServiceApi();
        if (!verifiedMemberData) {
            sweetFailureProvider(Definer.auth_err1, false, true)
        }
        orderServiceApi.getOrdersData(searchObj).then((orders: Order[]) => {
            setTargetOrders(orders)
        }
        ).catch(err => console.log(err))
    }, [searchObj])

    useEffect(() => {
        const orderServiceApi = new OrderServiceApi();
        const transactionServiceApi = new TransactionServiceApi()
        //calling targetOrders
        orderServiceApi.getOrdersData(searchObj).then((orders: Order[]) => {
            setTargetOrders(orders)
            if (!orderId) {
                handleChooseOrder(orders[orders.length - 1])
            }
        }
        ).catch(err => console.log(err))
        //calling chosenOrder
        orderServiceApi.getChosenOrder(orderId).then(data => setChosenOrder(data)).catch(err => console.log(err))
        transactionServiceApi.getChosenTransaction(chosenOrder?._id).then(data => {
            setChosenTargetTransaction(data)
        }
        ).catch(err => console.log(err))

        //caling targetChosenTransaction 
        transactionServiceApi.getChosenTransaction(orderId).then(data => setChosenTargetTransaction(data)).catch(err => console.log(err))
    }, [rebuild, orderId])

    //Handlers
    function handleChangeView(e: any, index: number) {
        setValue(index)

    }
    function handleChooseOrderByBtn(order: Order) {
        setOderStatus(order.order_status)
        handleChooseOrder(order)
        setRebuild(new Date())
    }
    function handleChooseOrder(order: Order) {
        setOrderId(order._id)
        switch (order.order_status) {
            case "PAUSED":
                setValue(0);
                break;
            case "PROCESS":
                setValue(1);
                break;
            case "FINISHED":
                break;
            case "DELIVERED":
                setValue(2);
                break;
            default:
                break;
        }
    }
    function handleProcess(status: string, index: number) {
        setValue(index)
        setOderStatus(status)
    }
    async function handleProcessCheckout(status: string) {
        if (window.confirm(`Do you agree to ${status}`)) {
            const orderServiceApi = new OrderServiceApi();
            //@ts-ignore
            await orderServiceApi.updateOrderData(chosenOrder?._id, { order_status: status });
            setOderStatus(status)
            switch (status) {
                case "PAUSED":
                    setValue(0);
                    break;
                case "PROCESS":
                    setValue(1);
                    break;
                //@ts-ignore
                case "FINISHED" || "DELIVERED":
                    setValue(2);
                    break;
                default:
                    break;
            }
            setRebuild(new Date())
        }
    }



    async function handleDeleteOrder(id: string) {
        const orderServiceApi = new OrderServiceApi();
        await orderServiceApi.deleteOrderData(id);
        await sweetTopSmallSuccessAlert("Successfully Deleted Order", 500, false)
        setRebuild(new Date())
    }

    function handleSearchOrder(e: any) {
        searchObj.search = e.target.value;
        setSearchObj({ ...searchObj })
    }
    return (
        <Box className={"trackPage"}>
            <Container className="trackPage-main">
                <Box className={"track_order"}>
                    <div className="track_title fw-bold fs-2">
                        Track your Order
                    </div>
                    <hr />
                    <div className="track_order_code fw-bold fs-3">
                        Order Code: {chosenOrder?.order_code}
                    </div>
                    <div className="Tracker_process mt-3 mb-3">
                        <div className="hh-grayBox">
                            <div className="row justify-content-between">
                                <div className="order-tracking completed">
                                    <span className="is-complete">
                                        <i className="fa-brands fa-shopify text-light fs-2"></i>
                                    </span>
                                    <p>Order Sort<br /><b><Moment format="YYYY-MM-DD h:mm">{chosenOrder?.createdAt}</Moment></b></p>
                                </div>
                                <div className={
                                    chosenOrder?.order_status === "PROCESS" ? "order-tracking completed"
                                        : chosenOrder?.order_status === "FINISHED" ? "order-tracking completed" :
                                            chosenOrder?.order_status === "DELIVERED" ? "order-tracking completed" :
                                                "order-tracking"
                                }
                                >
                                    <span className="is-complete">
                                        <i className="fa-solid fa-wallet text-light fs-2"></i>
                                    </span>
                                    <p>Shipping<br />
                                        {chosenOrder?.order_status === "PROCESS" ? (<b><Moment format="YYYY-MM-DD h:mm">{chosenOrder?.order_shipping_time}</Moment></b>)
                                            : chosenOrder?.order_status === "FINISHED" ? (<b><Moment format="YYYY-MM-DD h:mm">{chosenOrder?.order_shipping_time}</Moment></b>) :
                                                chosenOrder?.order_status === "DELIVERED" ? (<b><Moment format="YYYY-MM-DD h:mm">{chosenOrder?.order_shipping_time}</Moment></b>) : (
                                                    <i className="fa-solid fa-spinner fa-spin"></i>
                                                )}
                                    </p>
                                </div>
                                <div className={
                                    chosenOrder?.order_status === "FINISHED" ? "order-tracking completed"
                                        : chosenOrder?.order_status === "DELIVERED" ? "order-tracking completed"
                                            : "order-tracking"}>
                                    <span className="is-complete">
                                        <i className="fa-solid fa-truck-fast text-light fs-2"></i>
                                    </span>
                                    <p>Shipped<br />
                                        {chosenOrder?.order_status === "FINISHED" ? (<b><Moment format="YYYY-MM-DD h:mm">{chosenOrder.order_shipped_time}</Moment></b>) :
                                            chosenOrder?.order_status === "DELIVERED" ? (<b><Moment format="YYYY-MM-DD h:mm">{chosenOrder.order_shipped_time}</Moment></b>) :
                                                (<i className="fa-solid fa-spinner fa-spin"></i>)}
                                    </p>
                                </div>
                                <div className={chosenOrder?.order_status === "DELIVERED" ? "order-tracking completed" : "order-tracking"}>
                                    <span className="is-complete">
                                        <i className="fa-solid fa-clipboard-check text-light fs-2"></i>
                                    </span>
                                    <p>Delivered<br />{chosenOrder?.order_status === "DELIVERED" ? (<b><Moment format="YYYY-MM-DD h:mm">{chosenOrder?.order_delivered_time}</Moment></b>) : (<i className="fa-solid fa-spinner fa-spin"></i>)}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Box >
                        <Stack
                            className={"order_track_controller d-flex justify-content-center"}
                            direction={"row"}
                            justifyContent={"space-between"}
                        >
                            <Tabs value={value}>
                                <Tab className={orderStatus === "PAUSED" ? "btn btn_status" : "btn "} onClick={() => handleProcess("PAUSED", 0)} label="Order Checkout" />
                                <Tab className={orderStatus === "PROCESS" ? "btn btn_status" : "btn "} onClick={() => handleProcess("PROCESS", 1)} label="Process Checkout Details" />
                                <Tab className={orderStatus === "FINISHED" ? "btn btn_status" : "btn "} onClick={() => handleProcess("FINISHED", 2)} label="Delivered Product Confirmation" />
                            </Tabs>
                        </Stack>
                    </Box>
                </Box>
                <Box className="processing_body">
                    <SwipeableViews
                        enableMouseEvents
                        axis={theme.direction === "rtl" ? "x-reverse" : "x"}
                        index={value}
                        value={value}
                        onChangeIndex={handleChangeView}
                    >
                        <OrderPaused
                            index={0}
                            value={value}
                            dir={theme.direction}
                            handleProcessCheckout={handleProcessCheckout}
                            setRebuild={setRebuild}
                            rebuild={rebuild}
                        />
                        <OrderProcess
                            index={1}
                            value={value}
                            dir={theme.direction}
                            chosenOrder={chosenOrder}
                            handleProcessCheckout={handleProcessCheckout}
                        />
                        <OrderFinished
                            index={2}
                            value={value}
                            dir={theme.direction}
                            handleProcessCheckout={handleProcessCheckout}
                        />
                    </SwipeableViews>
                </Box>
                <Box
                    className={"list_of_orders"}
                >
                    <Box>
                        <div className="fw-bold fs-3">All Orders' History</div>
                        <hr />
                        <Stack
                            className="order_filter"
                            direction={"row"}
                            justifyContent={"end"}
                            alignItems={"center"}
                            gap={"20px"}
                        >
                            <input type="text" className="form-control" placeholder="Search Order" onKeyUpCapture={handleSearchOrder} />
                        </Stack>
                        <Box className={"pb-4"} style={{ height: "200px", overflowY: "auto" }}>
                            <table className="table table-hover mt-3">
                                <thead>
                                    <tr>
                                        <th className="fw-bold">
                                            Order Code
                                        </th>
                                        <th className="fw-bold">
                                            Total Price
                                        </th>
                                        <th className="fw-bold">
                                            Delivery Cost
                                        </th>
                                        <th className="fw-bold">
                                            Delivery Status
                                        </th>
                                        <th>
                                            Delete Order
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {targetOrders && targetOrders[0] ? targetOrders.map((order: Order, index: number) => {
                                        const chosen = order?._id === chosenOrder?._id
                                        return (
                                            <tr onClick={() => {
                                                handleChooseOrderByBtn(order)
                                            }} className={"order-table bg-danger"}>
                                                <td style={chosen ? { color: "red" } : {}}>
                                                    {order.order_code}
                                                </td>
                                                <td style={chosen ? { color: "red" } : {}}>
                                                    {stringSplitterHandler(order.order_total_amount, 3, ".")} ₩
                                                </td>
                                                <td style={chosen ? { color: "red" } : {}}>
                                                    {order.order_delivery_cost}
                                                </td>
                                                <td style={chosen ? { color: "red" } : {}}>
                                                    {order.order_status}
                                                </td>
                                                <td>
                                                    <div className="btn btn-danger" onClick={async () => await handleDeleteOrder(order._id)}>Delete</div>
                                                </td>
                                            </tr>
                                        )
                                    }
                                    ) : (
                                        <tr>
                                            <td colSpan={5}>
                                                <div
                                                    className=" text-secondary rounded mt-2 fs-6 p-2 text-center"
                                                    style={{ backgroundColor: "#DBDDEF" }}
                                                >
                                                    There is no order found!
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </Box>
                    </Box>
                </Box>
                <DownToUpBtn address={"#"} />
            </Container>
            <Container>
                <Box className={"notify-warn"}>
                    Mobile version is developing now <br />
                    Enjoy with desktop version untill mobile version is done.
                </Box>
            </Container>
        </Box>
    )
}

export default TrackOrderPage
