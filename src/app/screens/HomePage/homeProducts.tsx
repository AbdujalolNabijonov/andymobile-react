import { Box, Pagination, PaginationItem, Stack } from "@mui/material"
import { useEffect, useState } from "react"
import { HomePageProducts } from "../../../libs/types/others"
import { serverApi } from "../../../libs/config"
import { Product } from "../../../libs/types/product"
import { ArrowBack, ArrowForward } from "@mui/icons-material"
import { stringSplitterHandler } from "../../components/features/stringSplitter"
import { useHistory } from "react-router-dom"



export const HomeProducts = (props: HomePageProducts) => {
    //Initializations
    const [loaded, setLoaded] = useState<boolean>(false)
    const history = useHistory()
    //Three circle Hook
    useEffect(() => {
        setLoaded(true)
        return () => {
            setLoaded(false)
        }
    }, [loaded])

    //Handlers
    const handlePaginationChange = (event: any, value: number) => {
        props.searchObjHome.page = value;
        props.setSearchObjHome({ ...props.searchObjHome })
    }
    return (
        <Stack
            className="product_cards"
            flexDirection={"row"}
            flexWrap={"wrap"}
            justifyContent={"start"}
        >
            {props.products.map((ele: Product, index: any) => {
                const image_url_1 = `${serverApi}/${ele.product_images[0]}`
                const image_url_2 = `${serverApi}/${ele.product_images[1]}`
                const brand_pic = `${serverApi}/${ele.owner_data.mb_image}`
                const discount_price = ele.product_price - (ele.product_price * (ele.product_discount / 100))
                return (
                    <Box
                        data-aos="fade-up"
                        data-aos-delay={`${100 * index}`} className={props.scrolled && loaded ? "product_card opacity-1 aos-animate product_fade" : "product_card product_fade"}
                        key={index}
                    >
                        <Stack className="card_img" alignItems={"center"}>
                            <img src={image_url_1} alt="" className="product_img_1 w-100" />
                            <img src={image_url_2} alt="" className="product_img_2 w-100" />
                            <div className="product_badge">{props.searchObjHome.order.toUpperCase()}</div>
                        </Stack>
                        <Box className="card__overlay">
                            <Box className="card__header">
                                <svg className="card__arc" xmlns="http://www.w3.org/2000/svg"><path /></svg>
                                <img className="card__thumb" src={brand_pic} alt="" />
                                <div className="card__header-text">
                                    <h3 className="card__title">{ele.owner_data.mb_nick} Company</h3>
                                    <span className="card__status">{ele.product_name}</span>
                                </div>
                            </Box>
                            <Stack className="card__description">
                                <Stack direction={"row"} gap={"10px"} className="mb-2">
                                    <div><i className="fa-solid fa-database"></i></div>
                                    <div>Storage:</div>
                                    <div className="text-dark">{ele.product_memory} {ele.product_memory === 1 ? "TB" : "GB"}</div>
                                </Stack>
                                <Stack direction={"row"} gap={"10px"} className="mb-2">
                                    <div><i className="fa-solid fa-sack-dollar"></i></div>
                                    <div>Price:</div>
                                    <div className="text-dark">
                                        {ele.product_discount ? (<div>{stringSplitterHandler(discount_price, 3, ".")}₩<span className="text-secondary ms-2"><s>{stringSplitterHandler(ele.product_price, 3, ".")}₩</s></span></div>) : stringSplitterHandler(ele.product_price, 3, ".") + "₩"}
                                    </div>
                                </Stack>
                                <Stack direction={"row"} gap={"5px"} className="mb-2">
                                    <div><i className="fa-regular fa-calendar-check"></i></div>
                                    <div>Contract Month:</div>
                                    <div className="text-dark">{ele.product_contract > 0 ? ele.product_contract + " months" : "no Monthly Fee"}</div>
                                </Stack>
                                <button
                                    className="btn btn-warning text-light"
                                    onClick={() => {
                                        history.push(`/products/product/${ele._id}`)
                                    }}
                                >Purchase</button>
                            </Stack>
                        </Box>
                    </Box>
                )
            })}
            <Pagination
                page={props.searchObjHome.page}
                onChange={handlePaginationChange}
                renderItem={(item) => (
                    <PaginationItem
                        components={{
                            previous: ArrowBack,
                            next: ArrowForward
                        }}
                        {...item}
                        color={"secondary"}
                    />
                )}
                count={props.searchObjHome.page >= 3 ? props.searchObjHome.page + 1 : 3}
                className="d-flex justify-content-center bg-transparent mt-2"
                style={{ boxShadow: "none" }}
            />
        </Stack>
    )
}
