import { Box, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material"
import { useRef} from "react"
import { stringSplitterHandler } from "../../components/features/stringSplitter"
import { OrderItem } from "../../../libs/types/order"
import { serverApi } from "../../../libs/config"

//Redux
import { createSelector } from "reselect"
import { chosenOrderRetrieve } from "./selector"
import { useSelector } from "react-redux"

//SELECTOR
const retrieveChosenOrder = createSelector(
    chosenOrderRetrieve,
    (chosenOrder) => ({ chosenOrder })
)



const OrderPaused = (props: any) => {
    //Initializations
    const { chosenOrder } = useSelector(retrieveChosenOrder)
    const refs: any = useRef([])
    //Handlers
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
            <Box className={"order_checkout"}>
                <Stack>
                    <Table >
                        <TableHead>
                            <TableRow >
                                <TableCell className="fw-bold">
                                    NO
                                </TableCell >
                                <TableCell align="center" colSpan={2} className="fw-bold">
                                    PRODUCT
                                </TableCell>
                                <TableCell className="fw-bold">
                                    PRICE
                                </TableCell>
                                <TableCell className="fw-bold" align="center">
                                    QUANTITY
                                </TableCell>
                                <TableCell className="fw-bold">
                                    TOTAL
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {chosenOrder && chosenOrder.order_status === "PAUSED" && chosenOrder.order_items[0] ? chosenOrder?.order_items.map((order: OrderItem, index: number) => {
                                const image_url = order.product_image ? `${serverApi}/${order.product_image}` : "/pictures/black_phone.webp"
                                return (
                                    <TableRow>
                                        <TableCell className="fw-bold fs-5" align="center">
                                            {index + 1}
                                        </TableCell>
                                        <TableCell >
                                            <Stack alignItems={"center"}>
                                                <img src={image_url} alt="phone" width={"30px"} />
                                            </Stack>
                                        </TableCell>
                                        <TableCell>
                                            {order.item_name}
                                        </TableCell>
                                        <TableCell>
                                            {stringSplitterHandler(order.item_price, 3, ".")}₩
                                        </TableCell>
                                        <TableCell align="center">
                                            <Stack direction={"row"} gap={"20px"} alignItems={"center"} justifyContent={"center"}>
                                                <span className="fw-bold fs-5" ref={(ele) => refs.current[order._id] = ele}>{order?.item_quantity}</span>
                                            </Stack>
                                        </TableCell>
                                        <TableCell>
                                            {stringSplitterHandler(order.item_price * order.item_quantity, 3, ".")}₩
                                        </TableCell>
                                    </TableRow>
                                )
                            }) : (
                                <TableRow>
                                    <TableCell colSpan={6}>
                                        <div
                                            className=" text-secondary rounded mt-2 fs-6 p-2 text-center"
                                            style={{ backgroundColor: "#DBDDEF" }}
                                        >
                                            There is no order!
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                    <Stack
                        direction={"row"}
                        gap={"20px"}
                        justifyContent={"end"}
                        className="mt-3"
                    >
                        <a href="/products" className="btn btn-info" >Continue Shopping</a>
                        <button className="btn btn-success" onClick={async () => await props.handleProcessCheckout("PROCESS")}>Process Checkout</button>
                    </Stack>
                </Stack>
            </Box>
        </TabPanel>

    )
}

export default OrderPaused