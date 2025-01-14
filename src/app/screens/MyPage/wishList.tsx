import { useHistory } from "react-router-dom";
import { Box, Stack, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import { MemberServiceApi } from "../../apiServices/memberServiceApi";
import { stringSplitterHandler } from "../../components/features/stringSplitter";
import { AddCircle, RemoveCircle } from "@mui/icons-material";
import { wishListItemsRetrieve } from "./selector";
import { handleBuyProduct } from "../../components/features/handleBuySingleItem";
import OrderServiceApi from "../../apiServices/orderServiceApi";
import { WishListItem } from "../../libs/types/others";
import { sweetErrorHandling, sweetTopSmallSuccessAlert } from "../../libs/sweetAlert";
import { OrderItem } from "../../libs/types/order";
import { serverApi } from "../../libs/config";


//REDUX 
import { createSelector } from "reselect"
import { useSelector } from "react-redux";
import { useEffect, useRef } from "react";
import Definer from "../../libs/Definer";

//SELECTOR
const retrieveWishListItems = createSelector(
    wishListItemsRetrieve,
    (wishListItems) => ({ wishListItems })
)

const WishList = (props: any) => {
    //Initialization
    const { wishListItems } = useSelector(retrieveWishListItems);
    const refs: any = useRef([]);
    const history = useHistory();


    //Handle
    async function handleChangeQnt(e: any, product: WishListItem, modifier: number) {
        try {
            //fixed_price
            const fixed_price = product.product_discount > 0 ?
                product.product_price - (product.product_price * (product.product_discount / 100)) :
                product.product_price
            //Editing
            const memberServiceApi = new MemberServiceApi();
            await memberServiceApi.editWishListItem({ modifier: modifier, product_id: product.product_id })

            if (modifier < 0 && refs.current[product.product_id].innerHTML === 1) {
                await memberServiceApi.removeWishListItem(product.product_id)
                await memberServiceApi.likenItem(product.product_id, "PRODUCT")
                refs[product.product_name].remove()
            } else if (modifier > 0) {
                refs.current[product.product_id].innerHTML++
            } else {
                refs.current[product.product_id].innerHTML--
            }
            refs.current[product.product_image].innerHTML = stringSplitterHandler(refs.current[product.product_id].innerHTML * fixed_price, 3, ".") + "₩"
            props.setRebuild(new Date())
        } catch (err) {
            await sweetErrorHandling(err)
        }
    }
    async function handleRemoveChosenItem(product: WishListItem) {
        try {
            const memberServiceApi = new MemberServiceApi();
            await memberServiceApi.removeWishListItem(product.product_id)
            sweetTopSmallSuccessAlert("successfully Deleted", 300)
        } catch (err: any) {
            await sweetErrorHandling(err)
        }
    }
    async function handleRemoveAll(products: WishListItem[]) {
        try {
            const memberServiceApi = new MemberServiceApi();
            await Promise.all(products.map(ele => memberServiceApi.removeWishListItem(ele.product_id)))
            sweetTopSmallSuccessAlert("Successfully Removed", 300)
        } catch (err) {
            await sweetErrorHandling(err)
        }
    }
    async function handleBuySingleItem(product: WishListItem) {
        try {
            const memberServiceApi = new MemberServiceApi();
            await handleBuyProduct(product, { item_quantity: product.product_qnt })
            await memberServiceApi.removeWishListItem(product.product_id)
            history.push("/track-order")
            window.location.reload()

        } catch (err) {
            sweetErrorHandling(err)
        }
    }

    async function handleBuyAll(items: any[]) {
        try {
            const orderServiceApi = new OrderServiceApi();
            const memberServiceApi = new MemberServiceApi()
            const newList: OrderItem[] = items.map((item: WishListItem) => {
                return {
                    _id: item.product_id,
                    item_quantity: item.product_qnt,
                    item_name: item.product_name,
                    item_price: item.product_price,
                    order_id: "",
                    item_color: item.product_color,
                    item_storage: item.product_memory,
                    product_image: item.product_image
                };
            });

            await orderServiceApi.createOrder(newList)
            for (let item of items) {
                await memberServiceApi.removeWishListItem(item.product_id)
            }
            history.push("track-order")
        } catch (err) {
            console.log(err)
            await sweetErrorHandling(err)
        }
    }

    return (
        <Box className={"wishList"}>
            <div className="wish_list_title text-start text-warning fw-bold fs-3 mb-4">
                Wishlist Products
            </div>
            {
                wishListItems && wishListItems[0] ? (
                    <Box>
                        <div className="wish_list mt-5">
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="center" colSpan={2} className="fw-bold">
                                            PRODUCT
                                        </TableCell>
                                        <TableCell align="center" className="fw-bold">
                                            PRICE
                                        </TableCell>
                                        <TableCell align="center" className="fw-bold">
                                            QUANTITY
                                        </TableCell>
                                        <TableCell className="fw-bold">
                                            TOTAL
                                        </TableCell>
                                        <TableCell className="fw-bold" align="center">
                                            CHOICE
                                        </TableCell>
                                    </TableRow>
                                </TableHead>

                                <TableBody>
                                    {wishListItems.map((product: WishListItem, index: number) => {
                                        const image_url = `${serverApi}/${product.product_image}`
                                        const actual_price: number = product.product_price
                                        let fixed_price: any = product.product_discount > 1 ?
                                            product.product_price - (product.product_price * (product.product_discount / 100)) :
                                            0;
                                        return (
                                            <TableRow key={index} ref={(ele) => refs[product.product_name] = ele}>
                                                <TableCell
                                                    align="center"
                                                    style={{
                                                        display: "flex",
                                                        justifyContent: "center",
                                                        alignItems: "center"
                                                    }}
                                                >
                                                    <img
                                                        src={image_url}
                                                        alt="image"
                                                        style={{ height: "100px", width: "50px" }}
                                                        aria-label="Image product"
                                                        aria-hidden="true"
                                                    />
                                                </TableCell>
                                                <TableCell align="center" className=" fs-6">
                                                    {product.product_name} {product.product_memory < 10 ? product.product_memory + "TB" : product.product_memory + "GB"}
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    {fixed_price ? (<Stack flexDirection={"row"} gap={"5px"}>
                                                        <s className="text-secondary ms-2">{stringSplitterHandler(actual_price, 3, ".")}₩</s>
                                                        <span className="fw-bold">{stringSplitterHandler(fixed_price, 3, ".")}₩</span>
                                                    </Stack>) : (<span>{actual_price}₩</span>)}
                                                </TableCell>
                                                <TableCell >
                                                    <Stack
                                                        flexDirection={"row"}
                                                        gap={"25px"}
                                                    >
                                                        <div
                                                            onClick={(e) => handleChangeQnt(e, product, -1)}
                                                            className="btn btn-outline-secondary fw-bold d-flex justify-content-center align-items-center"
                                                            style={{
                                                                width: "30px",
                                                                height: "30px",
                                                            }}
                                                        ><RemoveCircle /></div>
                                                        <div
                                                            className="fs-5 fw-bold"
                                                            ref={(ele) => (refs.current[product.product_id] = ele)}
                                                        >{product.product_qnt}</div>
                                                        <div
                                                            onClick={(e) => handleChangeQnt(e, product, 1)}
                                                            className="btn btn-outline-secondary fw-bold d-flex justify-content-center align-items-center"
                                                            style={{
                                                                width: "30px",
                                                                height: "30px",
                                                            }}
                                                        ><AddCircle /></div>
                                                    </Stack>
                                                </TableCell>
                                                <TableCell
                                                    ref={(ele) => refs.current[product.product_image] = ele}
                                                    style={{ fontWeight: "bold" }}
                                                >
                                                    {fixed_price ?
                                                        stringSplitterHandler(fixed_price * product.product_qnt, 3, ".") + "₩" :
                                                        stringSplitterHandler(product.product_price * product.product_qnt, 3, ".") + "₩"
                                                    }
                                                </TableCell>
                                                <TableCell>
                                                    <Stack
                                                        flexDirection={"row"}
                                                        gap="20px"
                                                    >
                                                        <div
                                                            className="bg-danger p-2 text-white rounded"
                                                            style={{ cursor: "pointer" }}
                                                            onClick={(e) => handleRemoveChosenItem(product)}
                                                        >
                                                            Remove
                                                        </div>
                                                        <div
                                                            style={{ cursor: "pointer" }}
                                                            className="bg-success p-2 text-white rounded"
                                                            onClick={async () => handleBuySingleItem(product)}
                                                        >
                                                            CheckOut
                                                        </div>
                                                    </Stack>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                        <Stack
                            className="mt-4"
                            flexDirection={"row"}
                            justifyContent={"end"}
                            gap={"30px"}
                        >
                            <button
                                className="btn btn-danger fw-bold"
                                onClick={() => { handleRemoveAll(wishListItems) }}
                            >
                                Remove All
                            </button>
                            <button className="btn btn-success fw-bold" onClick={() => { history.push("/products") }}>
                                Continue Shopping
                            </button>
                            <button
                                className="btn btn-secondary fw-bold"
                                onClick={() => handleBuyAll(wishListItems)}
                            >
                                CheckOut All
                            </button>
                        </Stack>
                    </Box>
                ) : (
                    <div
                        className="text-secondary rounded mt-2 fs-6 p-2 text-center fw-bold"
                        style={{ backgroundColor: "#DBDDEF" }}
                    >
                        There is no order!
                    </div>
                )
            }
        </Box>
    )
}

export default WishList;