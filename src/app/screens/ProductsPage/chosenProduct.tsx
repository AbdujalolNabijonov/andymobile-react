import { Box, Rating, Stack, Tab, Tabs } from "@mui/material"
import { useHistory, useParams } from "react-router-dom"
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { useEffect, useState } from "react";
import { TabContext, TabPanel } from "@mui/lab";
import ProductDescription from "./ProductDescription";
import ProductReview from "./productReview";
import ReviewWriting from "./reviewWriting";
import ChattingClient from "../../components/features/clientChattingModal";
import ProductServiceApi from "../../apiServices/productServiceApi";
import ReactImageMagnify from "react-image-magnify"
import { stringSplitterHandler } from "../../components/features/stringSplitter"
import CommunityServiceApi from "../../apiServices/communityServiceApi";
import { NewProducts } from "../HomePage/releasedProducts";
import { AddCircle, Favorite, RemoveCircle } from "@mui/icons-material";
import { handleViewItem } from "../../components/features/viewItem";
import { handleLikeItem } from "../../components/features/likeItem";
import { handleBuyProduct } from "../../components/features/handleBuySingleItem";
import { DownToUpBtn } from "../../components/features/downToUpBtn";
import { Product } from "../../libs/types/product";
import { Review } from "../../libs/types/review";
import { kakaoSecretKey, serverApi } from "../../libs/config";
import assert from "assert";
import Definer from "../../libs/Definer";
import { BasketItem } from "../../libs/types/order";
import { sweetErrorHandling } from "../../libs/sweetAlert";
import 'react-inner-image-zoom/lib/InnerImageZoom/styles.min.css';

//REDUX
import { Dispatch } from "@reduxjs/toolkit"
import { createSelector } from "reselect"
import { useDispatch, useSelector } from "react-redux"
import { setChosenProduct, setProductReview } from "./slice";
import { chosenProductRetriever, productReviewRetriever } from "./selector";


//KAKAO
import KakaoMap from "../../components/features/kakaoMap";
import { Direction } from "../../libs/enums/product";
import { RelatedProducts } from "./relatedProduct";

//SLICE
const actionDispatch = (dispatch: Dispatch) => ({
    setChosenProduct: (data: Product) => dispatch(setChosenProduct(data)),
    setProductReview: (data: Review[]) => dispatch(setProductReview(data))
})
//SELECTOR
const chosenProductRetrieve = createSelector(
    chosenProductRetriever,
    (chosenProduct) => ({ chosenProduct })
)

const productReviewRetrieve = createSelector(
    productReviewRetriever,
    (productReview) => ({ productReview })
)

export const ChosenProduct = (props: any) => {
    //Initilizations
    const { product_id } = useParams<{ product_id: string }>(),
        [chosenColor, setChosenColor] = useState<string>(""),
        [value, setValue] = useState<number>(1),
        [scrolled, setScrolled] = useState<boolean>(false),
        [termsAgree, setTermsAgree] = useState<boolean>(false),
        [openChat, setOpenChat] = useState<boolean>(false),
        { chosenProduct } = useSelector(chosenProductRetrieve),
        { productReview } = useSelector(productReviewRetrieve),
        { setChosenProduct, setProductReview } = actionDispatch(useDispatch()),
        [magnifyImg, setMagnifyImg] = useState<string>(""),
        [chosenProductImgIndex, setChosenProductImgIndex] = useState<number>(0),
        [reBuild, setRebuild] = useState<Date>(new Date()),
        [disabledBtn, setDisabledBtn] = useState<boolean>(false),
        main_img = magnifyImg ? magnifyImg : `${serverApi}/${chosenProduct?.product_images[0]}`,
        [coords, setCoords] = useState<{ lat: any, lng: any }>({ lat: 3123, lng: 122 }),
        styleColor = {
            borderColor: "#0066AE",
            color: chosenColor,
            borderWidth: "2px"
        },
        [productObj, setProductObj] = useState(
            {
                item_quantity: 1,
                product_price: 0,
                costumize_product_contract: 0,
            }
        ),
        history = useHistory()
    //3 circle React Hook
    useEffect(() => {
        window.scrollTo(0, 0)
        function handleScroll() { setScrolled(window.scrollY > 500) }
        window.addEventListener("scroll", handleScroll);
        //Chosen Product
        const productServiceApi = new ProductServiceApi();
        productServiceApi.getChosenProduct(product_id)
            .then(data => {
                setChosenProduct(data)
                handleViewItem(data._id, "PRODUCT")
            })
            .catch(err => console.log(err))

        //Product related Reviews
        const communityServiceApi = new CommunityServiceApi();
        communityServiceApi.getProductReviews(product_id)
            .then(data => setProductReview(data))
            .catch(err => console.log(err))
        return () => {
            window.removeEventListener("scroll", handleScroll)
        }
    }, [reBuild])
    //lifecirle
    useEffect(() => {
        if (!kakaoSecretKey) {
            console.error('Kakao secret key is missing!');
            return;
        }

        if (window.kakao && window.kakao.maps) {
            // Wait until Kakao Maps API is fully ready
            window.kakao.maps.load(() => {
                if (chosenProduct?.company_data?.mb_address) {
                    const geocoder = new window.kakao.maps.services.Geocoder();
                    const addressToSearch = chosenProduct.company_data.mb_address;

                    geocoder.addressSearch(addressToSearch, (result, status) => {
                        if (status === window.kakao.maps.services.Status.OK) {
                            const newcoords = {
                                lat: parseFloat(result[0].y),
                                lng: parseFloat(result[0].x),
                            };
                            setCoords(newcoords);
                        } else {
                            console.error('Address search failed:', status);
                        }
                    });
                }
            });
        } else {
            console.error('Kakao Maps API is not fully loaded!');
        }
    }, [chosenProduct]);

    //Handlers
    function handleOpenChat() { setOpenChat(true) };
    function handleCloseChat() { setOpenChat(false) };
    function handleValue(e: any, newValue: number) { setValue(newValue) }
    function handleChosenColor(color: string, id: string) {
        setChosenColor(color)
        window.location.replace(`/products/product/${id}`)
    }
    function hadleTermsUse(e: any) { setTermsAgree(e.target.checked) }
    function handleSelectImage(e: any, img: string, index: number) {
        setMagnifyImg(img)
        setChosenProductImgIndex(index)
    }
    function handleOverallRating(productReview: Review[]) {
        let rating_product: number = 0;
        productReview.map((ele) => (rating_product += ele.review_stars))
        return Math.floor(rating_product / productReview.length)
    }
    async function handleAddToCard() {
        try {
            assert.ok(chosenProduct, Definer.general_err1)
            const cartItem: BasketItem = {
                _id: chosenProduct._id,
                item_quantity: productObj.item_quantity,
                product_price: productObj.product_price ? productObj.product_price : chosenProduct.product_price,
                product_color: chosenProduct.product_color,
                product_memory: chosenProduct.product_memory,
                product_name: chosenProduct.product_name,
                product_images: chosenProduct.product_images,
                costumize_product_contract: productObj.costumize_product_contract,
                product_discount: chosenProduct.product_discount
            }
            props.handleSaveBasket(cartItem)
        } catch (err) {
            await sweetErrorHandling(err)
        }
    }
    return (
        <Box className="chosen_product">
            <ChattingClient openChat={openChat} handleCloseChat={handleCloseChat} />
            <Stack
                onClick={handleOpenChat}
                className={scrolled ? "product_assistant aos-animate" : "product_assistant"}
                direction={"row"}
                gap={"10px"}
                alignItems={"center"}
                data-aos="fade-right"
                data-delay-aos={100}
                style={openChat ? { display: "none" } : {}}
            >

                <div className="assistant_img">
                    <img src="/icons/bot_img.jpg" alt="assitant" width={"60px"} />
                </div>
                <div className="assitant_text">
                    Talk with <b>A smart bot</b>
                </div>
            </Stack>
            <Stack
                className="container"
                flexDirection={"row"}
                gap="50px"
            >
                <Stack
                    className={"product_imgs"}
                    flexDirection={"row"}
                >
                    <Swiper
                        slidesPerView={5}
                        navigation={true}
                        modules={[Navigation]}
                        className="product_swiper pe-3"
                        direction="vertical"
                        key={chosenProduct?._id}
                    >
                        {chosenProduct?.product_images.map((ele: string, index: number) => {
                            const image_url = `${serverApi}/${ele}`
                            return (
                                <SwiperSlide
                                    style={{ marginTop: "30px" }}
                                    className="p-4 mb-4"
                                    onClick={(e) => handleSelectImage(e, image_url, index)}
                                    key={index}
                                >
                                    <Box
                                        className={chosenProductImgIndex === index ? "product_swiper_item chosen_product_img" : "product_swiper_item"}
                                    >
                                        <img src={image_url} key={index} aria-label="Product Image" />
                                    </Box>
                                </SwiperSlide>
                            )
                        })}
                    </Swiper>
                    <Box className="main_pic_box">
                        <ReactImageMagnify

                            {...{
                                smallImage: {
                                    alt: "Wristwatch by Ted Baker London",
                                    isFluidWidth: true,
                                    src: main_img,
                                },
                                largeImage: {
                                    src: main_img,
                                    width: 900,
                                    height: 900,
                                },
                                enlargedImageContainerStyle: {
                                    zIndex: "1500",
                                },
                            }}
                        />
                    </Box>

                </Stack>
                <Stack className="product_info">
                    <div className="product_name fs-3 mb-3 fw-bold">
                        {chosenProduct?.product_name}  <span className="text-secondary fs-4">{chosenProduct?.product_memory === 1 ? `${chosenProduct?.product_memory}TB` : `${chosenProduct?.product_memory}GB`}</span>
                    </div>
                    <Stack className="product_review mb-3" flexDirection={"row"} gap={"10px"}>
                        <Stack flexDirection={"row"} gap={"3px"} alignItems={"center"} className="text-warning">
                            <Rating
                                name="single-controlled"
                                value={handleOverallRating(productReview)}
                                readOnly
                            />
                        </Stack>
                        <div className="review_count text-secondary">
                            {chosenProduct?.product_comments} reviews
                        </div>
                    </Stack>
                    <Stack
                        className="product_price fs-6 mb-4"
                        flexDirection={"row"}
                        gap={"8px"}
                        alignItems={"center"}
                    >
                        <Stack
                            flexDirection={"row"}
                            gap={"5px"}
                        >
                            <div><i className="fa-solid fa-sack-dollar"></i></div>
                            <div className="text-secondary fw-bold fs-6">Product Price:</div>
                        </Stack>
                        {chosenProduct?.product_discount ? (
                            <Stack
                                className="fw-bold"
                                flexDirection={"row"}
                                alignItems={"center"}
                                gap={"5px"}
                            >
                                <div>
                                    {
                                        stringSplitterHandler(Math.floor(chosenProduct?.product_price - (chosenProduct?.product_price * (chosenProduct.product_discount / 100))), 3, ".")
                                    }₩
                                </div>
                                <div className="text-secondary"><s>
                                    {
                                        stringSplitterHandler(chosenProduct?.product_price, 3, ".")
                                    }₩
                                </s></div>
                                <span className="btn btn-dark rounded-pill">Save -{chosenProduct.product_discount}%</span>
                            </Stack>
                        ) : (
                            <Stack
                                flexDirection={"row"}
                                className="fw-bold"
                            >
                                <div>
                                    {
                                        stringSplitterHandler(chosenProduct?.product_price || 0, 3, ".")
                                    }₩
                                </div>
                            </Stack>
                        )}
                    </Stack>
                    <Stack className="product_shipping mb-4" flexDirection={"row"} gap={"50px"}>
                        <Stack className="sipping" flexDirection={"row"} gap={"10px"} alignItems={"center"}>
                            <i className="fa-solid fa-truck-fast text-success fs-5"></i>
                            <div className="fw-bold link_inquery" >Shipping 24/7</div>
                        </Stack>
                        <Stack className="ask_about" flexDirection={"row"} gap={"10px"} alignItems={"center"}>
                            <i className="fa-regular fa-envelope fs-5 text-info"></i>
                            <div className="fw-bold link_inquery" onClick={() => history.push("/faq")}>Ask About Delivery</div>
                        </Stack>
                    </Stack>
                    <Stack
                        className="mb-4"
                        flexDirection={"row"}
                        gap={"15px"}
                        alignItems={"center"}
                    >
                        <Stack
                            flexDirection={"row"}
                            gap={"10px"}
                        >
                            <div><i className="fa-solid fa-database"></i></div>
                            <div className="text-secondary fw-bold">Memory Size:</div>
                        </Stack>
                        <div className="fw-bold">{chosenProduct?.product_memory === 1 ? `${chosenProduct?.product_memory}TB` : `${chosenProduct?.product_memory}GB`}</div>
                    </Stack>
                    <Stack
                        className="mb-4"
                        flexDirection={"row"}
                        gap={"15px"}
                        alignItems={"center"}
                    >
                        <Stack
                            flexDirection={"row"}
                            gap={"10px"}
                        >
                            <div><i className="fa-solid fa-palette"></i></div>
                            <div className="text-secondary fw-bold">Color:</div>
                        </Stack>
                        <Stack
                            flexDirection={"row"}
                            gap={"10px"}
                        >{
                                chosenProduct?.product_related.map((product: Product) => {
                                    const product_color = product.product_color.toLowerCase()
                                    return (
                                        <Box>
                                            <Box
                                                className="product_color"
                                                style={chosenColor === product_color || chosenProduct.product_color.toLowerCase() === product_color ? styleColor : {}}
                                                onClick={() => handleChosenColor(product_color, product._id)}
                                            >
                                                <img
                                                    src={`/pictures/products/${product_color}_phone.webp`}
                                                    alt="" className="w-50"
                                                    title={product.product_color}
                                                />
                                            </Box>
                                        </Box>
                                    )
                                })
                            }
                        </Stack>
                    </Stack>
                    <Stack
                        className="product_quantity mb-4"
                        flexDirection={"row"}
                        gap={"30px"}
                        alignItems={"center"}
                    >
                        <Stack
                            flexDirection={"row"}
                            gap={"10px"}
                        >
                            <div><i className="fa-solid fa-calculator"></i></div>
                            <div className="text-secondary fw-bold">Quantity:</div>
                        </Stack>
                        <Stack
                            flexDirection={"row"}
                            gap={"25px"}
                        >
                            <div
                                onClick={(e) => {
                                    if (!disabledBtn && productObj.item_quantity >= 2) {
                                        productObj.item_quantity--
                                        setProductObj({ ...productObj })
                                    }
                                }}
                                className="btn btn-outline-secondary fw-bold d-flex justify-content-center align-items-center"
                                style={{
                                    width: "30px",
                                    height: "30px",
                                }}
                            ><RemoveCircle /></div>
                            <div className={disabledBtn ? "fs-5 fw-bold text-secondary" : "fs-5 fw-bold"}><u>{productObj.item_quantity}</u></div>
                            <div
                                onClick={(e) => {
                                    if (!disabledBtn)
                                        productObj.item_quantity++
                                    setProductObj({ ...productObj })
                                }}
                                className="btn btn-outline-secondary fw-bold d-flex justify-content-center align-items-center"
                                style={{
                                    width: "30px",
                                    height: "30px",
                                }}
                            ><AddCircle /></div>
                        </Stack>
                    </Stack>
                    {
                        productObj.costumize_product_contract > 0 ? (
                            <div className="animate-warning mb-2">You can only buy 1 product with contract based payment!. Sale is not for contract product</div>
                        ) : null
                    }
                    <Stack
                        className="mb-5"
                        flexDirection={"row"}
                        gap={"5px"}
                        alignItems={"center"}
                    >
                        <select className="form-select w-50" id="" onChange={(e) => {
                            if (parseInt(e.target.value) > 0) {
                                productObj.costumize_product_contract = parseInt(e.target.value)
                                productObj.item_quantity = 1
                                //@ts-ignore
                                productObj.product_price = Math.floor(chosenProduct?.product_price / parseInt(e.target.value))
                                setDisabledBtn(true);
                                setProductObj({ ...productObj })
                            } else {
                                setDisabledBtn(false)
                            }
                        }}>
                            <option>Not Monthly contract</option>
                            {
                                Array.from({ length: chosenProduct ? chosenProduct?.product_contract : 0 + 1 }).map((ele, index: number) => {
                                    if (index % 3 === 0 && index !== 0) {
                                        return (<option value={index}>{index} months contract</option>)
                                    }
                                })
                            }
                        </select>
                        <button className="btn btn-dark" onClick={handleAddToCard}>ADD TO CART</button>
                        <button className="btn btn-light" onClick={(e) => handleLikeItem(e, chosenProduct, "PRODUCT", null, props.setAmountRebuild, true)}>
                            <Favorite style={chosenProduct?.me_liked && chosenProduct.me_liked[0]?.mb_id ? { fill: "red" } : { fill: "gray" }} />
                        </button>
                    </Stack>
                    <Stack className="buy_terms mb-1" flexDirection={"row"} gap={"10px"}>
                        <input type="checkbox" id="buy_terms" onChange={hadleTermsUse} />
                        <label htmlFor="buy_terms">I agree with the terms and conditions</label>
                    </Stack>
                    <button
                        className={termsAgree ? "btn btn-warning mb-3" : "btn btn-warning mb-3 disabled"}
                        //@ts-ignore
                        onClick={async () => {
                            await handleBuyProduct(chosenProduct, productObj, "/track-order")
                        }}
                    >
                        BUY IT NOW
                    </button>
                    <hr />
                    <Stack direction={"row"} gap={"20px"} className="payment_guarantee ">
                        <div>Guaranteed safe checkout:</div>
                        <img src="https://lezada-demo.myshopify.com/cdn/shop/files/pay_1024x1024.png?v=1613763989" className="w-50" alt="gurantee" />
                    </Stack>
                    <Stack className="product_share mt-3" flexDirection={"row"} gap={"30px"} alignItems={"center"}>
                        <div className="fs-5">Share via: </div>
                        <Stack flexDirection={"row"} gap={"10px"}>
                            <a href="http://instagram.com" className="nav-link fs-4">
                                <i className="fa-brands fa-instagram"></i>
                            </a>
                            <a href="http://facebook.com" className="nav-link fs-4">
                                <i className="fa-brands fa-facebook"></i>
                            </a>
                            <a href="http://twitter.com" className="nav-link fs-4">
                                <i className="fa-brands fa-square-twitter"></i>
                            </a>
                        </Stack>
                    </Stack>
                </Stack>
            </Stack>
            <hr />
            <Box className={"container"}>
                <TabContext value={String(value)}>
                    <Stack alignItems={"center"}>
                        <Tabs className={"mt-5s"} onChange={handleValue}>
                            <Tab value={1} className={value === 1 ? "chosen_product_tab text-dark fw-bold" : "chosen_product_tab"} label="Description" />
                            <Tab value={2} className={value === 2 ? "chosen_product_tab text-dark fw-bold" : "chosen_product_tab"} label="Review" />
                            <Tab value={3} className={value === 3 ? "chosen_product_tab text-dark fw-bold" : "chosen_product_tab"} label="Leave A REVIEW" />
                        </Tabs>
                    </Stack>
                    <TabPanel value={"1"}>
                        <ProductDescription description={chosenProduct?.product_description} />
                    </TabPanel>
                    <TabPanel value={"2"}>
                        {
                            productReview[0] ? (
                                <ProductReview
                                    reviews={productReview}
                                    setRebuild={setRebuild}
                                />
                            ) : (
                                <div
                                    className="p-2 rounded text-center fw-bold text-secondary"
                                    style={{ backgroundColor: "#EAEAEA" }}
                                >
                                    This Product has not been reviewed yet. Be First and leave a comment
                                </div>
                            )
                        }
                    </TabPanel>
                    <TabPanel value={"3"}>
                        <ReviewWriting product_id={chosenProduct?._id} title_enabled={true} item_group={"PRODUCT"} setRebuildReview={setRebuild} />
                    </TabPanel>
                </TabContext>
                <Box>
                    <div className="fw-bold fs-3 text-center pt-3 pb-3">Visit Our Self-Pickup Center</div>
                    <KakaoMap
                        coords={coords}
                        title={chosenProduct?.company_data?.mb_nick}
                    />
                </Box>
                <RelatedProducts/>
            </Box>
            <DownToUpBtn address={"#"} />
        </Box>
    )
}