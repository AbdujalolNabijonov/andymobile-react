import { Box, Container, Pagination, PaginationItem, Stack } from "@mui/material";
import { Product } from "../../../libs/types/product";
import { useEffect, useRef, useState } from "react";
import { serverApi } from "../../../libs/config";
import { ArrowBack, ArrowForward, Favorite, RemoveRedEye } from "@mui/icons-material";
import { stringSplitterHandler } from "../../components/features/stringSplitter";
import { handleLikeItem } from "../../components/features/likeItem";
import { useHistory } from "react-router-dom";


export const Products = (props: any) => {
    //Initializations
    const [loaded, setLoaded] = useState<boolean>(false)
    const [chosenColor, setChosenColor] = useState<string>("");
    const [productKey, setPoductKey] = useState<string>("");
    const history = useHistory()
    const refs: any = useRef([])

    //Life circle
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
    async function handleRequestSingleProduct(product_id: string) {
        history.push(`/products/product/${product_id}`)
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
                    if (ele._id === productKey) {
                        for (let product of ele?.product_related_colors) {
                            if (product.product_color === chosenColor) {
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
                            onClick={() => handleRequestSingleProduct(productKey ? productKey : ele._id)}
                        >
                            <Box
                                className="product_img position-relative product_fade d-flex justify-content-center"
                                style={props.boxSize === "45%" ? { width: "190px" } : { width: '340px' }}
                                onClick={() => { return false }}
                            >
                                <button className="position-absolute" onClick={(e) => {
                                    e.stopPropagation();
                                    handleLikeItem(e, ele, "PRODUCT", refs, props.setAmountRebuild, true)
                                }}>
                                    <Favorite style={ele.me_liked && ele.me_liked[0]?.mb_id ? { fill: "red" } : { fill: "white" }} />
                                </button>
                                <img src={`${serverApi}/${pictures[0]}`} alt="phone" className="product_img_1 w-100" />
                                <img src={`${serverApi}/${pictures[1]}`} alt="phone" className="product_img_2 w-100" />
                            </Box>
                            <div
                                className="product_item-info p-2"
                                style={{ width: "50%" }}
                            >
                                <div className="product_name pb-2  fs-5 text-center fw-bold">{ele.product_name} {ele.product_memory === 1 ? `${ele.product_memory}TB` : `${ele.product_memory}GB`}</div>
                                <div className="select_color" onClick={(e) => e.stopPropagation()}>
                                    <select
                                        className="product_colors form-select"
                                        key={index}
                                        onChange={(e) => {
                                            e.stopPropagation()
                                            handleColor(e, ele._id)
                                        }
                                        }
                                    >
                                        {ele.product_related_colors ? ele.product_related_colors.map((product: Product, index: number) => (
                                            <option value={product.product_color} >{product.product_color}</option>
                                        )) : (<option value={ele.product_color} disabled selected>{ele.product_color}</option>)}
                                    </select>
                                    <Stack
                                        flexDirection={"row"}
                                        gap={"3px"}
                                    >
                                        {
                                            ele.product_related_colors ? ele.product_related_colors.map((product: Product, index: number) => (
                                                <div style={{
                                                    width: "15px",
                                                    height: "15px",
                                                    borderRadius: '50%',
                                                    boxShadow: "0 0 3px black",
                                                    border: chosenColor === `${product.product_color}` && productKey === ele._id ? "2px solid #D17237" : "",
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
                                        <div>Actual Price: <b>{stringSplitterHandler(ele.product_price, 3, ".")}₩</b></div>
                                    </Stack>
                                    {
                                        ele.product_discount > 0 ? (
                                            <Stack flexDirection={"row"} alignItems={"center"}>
                                                <div><i className="fa-solid fa-circle-plus p-1 me-2"></i></div>
                                                <div>With Discount: <b>{stringSplitterHandler(Math.floor(ele.product_price - (ele.product_price * (ele.product_discount / 100))), 3, ".")}₩</b></div>
                                            </Stack>
                                        ) : null
                                    }
                                    {
                                        ele.product_contract <= 0 ? null : (
                                            <Stack flexDirection={"row"} alignItems={'center'}>
                                                <div>
                                                    <i className="fa-solid fa-circle-plus p-1 me-2"></i>
                                                </div>
                                                <Box>
                                                    <div>Monthly deal: <b>{ele?.product_contract} months</b></div>
                                                    <div>Each Month: <b>{stringSplitterHandler(Math.floor(ele.product_price / ele.product_contract), 3, ".")}₩</b></div>
                                                </Box>
                                            </Stack>
                                        )
                                    }
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
                                        <i className="fs-5 fa-solid fa-comment"></i>
                                        <b>{ele.product_comments}</b>
                                    </div>
                                    <div className="product_likes d-flex gap-2" onClick={() => { return false }}>
                                        <Favorite style={{ fill: "gray" }} />
                                        <div >
                                            <b ref={(e) => refs.current[ele._id] = e}>{ele.product_likes}</b>
                                        </div>
                                    </div>
                                    <div className="product_views d-flex gap-2">
                                        <RemoveRedEye />
                                        <b>{ele.product_views}</b>
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
                        window.scrollTo(0, 0)
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