import { Box, Container, Pagination, PaginationItem, Stack } from "@mui/material";
import { Product } from "../../types/product";
import { useEffect, useState } from "react";
import { serverApi } from "../../../lib/config";
import { ArrowBack, ArrowForward, Favorite, RemoveRedEye } from "@mui/icons-material";

export const Products = (props: any) => {
    //Initializations
    const [loaded, setLoaded] = useState<boolean>(false)
    const [chosenColor, setChosenColor] = useState<string>("");
    const [productKey, setPoductKey] = useState<string>("");
    //three circle Hook
    useEffect(() => {
        setLoaded(true)
        return () => {
            setLoaded(false)
        }
    }, [])

    //Handlers
    function handleColor(e: any, key: string) {
        setChosenColor(e.target.value)
        setPoductKey(key)
    }
    return (
        <Stack>
            <Stack
                flexDirection={"row"}
                flexWrap={"wrap"}
                justifyContent={"start"}
                alignItems={"start"}
                alignContent={"start"}
                gap={"10px"}
                className="products"
            >
                {props.targetProducts.map((ele: Product, index: number) => {
                    let image_urls = [ele.product_images[0], ele.product_images[1]]
                    let pictures;
                    if (ele._id == props.productKey) {
                        for (let product of ele.product_related_colors) {
                            if (product.product_color === props.chosenColor) {
                                pictures = product.product_images
                            }
                        }
                    } else {
                        pictures = image_urls
                    }
                    return (
                        <Stack
                            className={loaded ? "product_item mb-3 aos-animate opacity-1" : ""}
                            data-aos="fade-up"
                            data-aos-delay={150 * index}
                            flexDirection={"row"}
                            style={{ width: props.boxSize, transition: "all .3s ease-in-out" }}
                        >
                            <Box
                                className="product_img position-relative product_fade d-flex justify-content-center"
                                style={props.boxSize == "45%" ? { width: "190px" } : { width: '340px' }}
                            >
                                <button className="position-absolute"><Favorite style={{ fill: "red" }} /></button>
                                <img src={`${serverApi}/${pictures[0]}`} alt="phone" className="w-100 product_img_1" />
                                <img src={`${serverApi}/${pictures[1]}`} alt="phone" className="w-100 product_img_2" />
                            </Box>
                            <div
                                className="product_item-info p-2"
                                style={{ width: "50%" }}
                            >
                                <div className="product_name pb-2  fs-5 text-center fw-bold">{ele.product_name}</div>
                                <div className="select_color">
                                    <select className="product_colors form-select" key={ele._id} onChange={(e) => handleColor(e, ele._id)}>
                                        {ele.product_related_colors ? ele.product_related_colors.map((product: Product, index: number) => (
                                            <option value={product.product_color} >{product.product_color}</option>
                                        )) : (<option value={ele.product_color} disabled>{ele.product_color}</option>)}
                                    </select>
                                    <Stack flexDirection={"row"} gap={"3px"}>
                                        {
                                            ele.product_related_colors ? ele.product_related_colors.map((product: Product, index: number) => (
                                                <div style={{
                                                    width: "15px",
                                                    height: "15px",
                                                    borderRadius: '50%',
                                                    boxShadow: "0 0 3px black",
                                                    border: chosenColor == `${product.product_color}` && productKey == ele._id ? "2px solid #D17237" : "",
                                                    backgroundColor: `${product.product_color}`
                                                }}></div>
                                            )) : (
                                                <div style={{
                                                    width: "15px",
                                                    height: "15px",
                                                    borderRadius: '50%',
                                                    boxShadow: "0 0 3px black",
                                                    border: "2px solid #D17237",
                                                    backgroundColor: `${ele.product_color}`
                                                }}></div>
                                            )
                                        }
                                    </Stack>
                                </div>
                                <div className="product_item-info mt-3">
                                    <Stack flexDirection={"row"} alignItems={"center"}>
                                        <div><i className="fa-solid fa-circle-plus p-1 me-2"></i></div>
                                        <div>Actual Price: <b>{ele.product_price}₩</b></div>
                                    </Stack>
                                    {
                                        ele.product_discount > 0 ? (
                                            <Stack flexDirection={"row"} alignItems={"center"}>
                                                <div><i className="fa-solid fa-circle-plus p-1 me-2"></i></div>
                                                <div>With Discount: <b>{Math.floor(ele.product_price - (ele.product_price * (ele.product_discount / 100)))}₩</b></div>
                                            </Stack>
                                        ) : null
                                    }
                                    <Stack flexDirection={"row"} alignItems={'center'}>
                                        <div>
                                            <i className="fa-solid fa-circle-plus p-1 me-2"></i>
                                        </div>
                                        <Box>
                                            <div>Monthly deal: <b>{ele.product_contract} months</b></div>
                                            <div>Each Month: <b>{Math.floor(ele.product_price / ele.product_contract)}₩</b></div>
                                        </Box>
                                    </Stack>
                                    <Stack flexDirection={"row"} alignItems={"center"}>
                                        <div><i className="fa-solid fa-circle-plus p-1 me-2"></i></div>
                                        <div>{ele.product_display} inch display</div>
                                    </Stack>
                                    <Stack flexDirection={"row"} alignItems={"center"}>
                                        <div><i className="fa-solid fa-circle-plus p-1 me-2"></i></div>
                                        <div>{ele.product_camera}MP camera</div>
                                    </Stack>
                                </div>
                                <Stack className="product_statistics" flexDirection={"row"} gap={"15px"}>
                                    <div className="product_review d-flex gap-2">
                                        {ele.product_comments}
                                        <i className="fs-5 fa-solid fa-comment"></i>
                                    </div>
                                    <div className="product_likes d-flex gap-2">
                                        {ele.product_likes}
                                        <Favorite style={{ fill: "gray" }} />
                                    </div>
                                    <div className="product_views d-flex gap-2">
                                        {ele.product_views}
                                        <RemoveRedEye />
                                    </div>
                                </Stack>
                            </div>
                        </Stack>
                    )
                })}
            </Stack>
            <Container className="d-flex">
                <Pagination
                    className="brand_pagination d-flex justify-content-center"
                    page={props.searchObj.page}
                    count={props.searchObj.page >= 3 ? props.searchObj.page + 1 : 3}
                    onChange={(e: any, value: number) => {
                        props.searchObj.page = value;
                        props.setSearchObj({ ...props.searchObj })
                    }}
                    renderItem={(item) => (
                        <PaginationItem
                            components={{
                                previous: ArrowBack,
                                next: ArrowForward
                            }}
                            {...item}
                            color="secondary"
                        />
                    )}
                />
            </Container>
        </Stack>
    )
}