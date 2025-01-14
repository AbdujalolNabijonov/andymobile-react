import { Box, Container, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import ProductServiceApi from "../../apiServices/productServiceApi";
import { allBrandsRetriever, targetProductsRetriever, targetReviewsRetrieve } from "./selector";
import BrandsServiceApi from "../../apiServices/brandsServiceApi";
import { Products } from "./products";
import { ProductFilter } from "../../components/filters/productFilter";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { handleViewItem } from "../../components/features/viewItem";
import ReviewWriting from "./reviewWriting";
import ProductReview from "./productReview";
import CommunityServiceApi from "../../apiServices/communityServiceApi";
import { DownToUpBtn } from "../../components/features/downToUpBtn";
import { Direction } from "../../libs/enums/product";
import { Product, ProductSearchObject } from "../../libs/types/product";
import { Brand } from "../../libs/types/member";
import { Review } from "../../libs/types/review";

//REDUX
import { createSelector } from "reselect"
import { Dispatch } from "@reduxjs/toolkit";
import { setAllBrands, setTargetProducts, setTargetReviews } from "./slice";
import { useDispatch, useSelector } from "react-redux";

//SLICE
const actionDispath = (dispatch: Dispatch) => ({
    setTargetProducts: (data: Product[]) => dispatch(setTargetProducts(data)),
    setAllBrands: (data: Brand[]) => dispatch(setAllBrands(data)),
    setTargetReviews: (data: Review[]) => dispatch(setTargetReviews(data))
})
//SELECTOR
const retrieveTargetProducts = createSelector(
    targetProductsRetriever,
    (targetProducts) => ({ targetProducts })
)

const retrieveAllBrands = createSelector(
    allBrandsRetriever,
    (allBrands) => ({ allBrands })
)

const retrieverTargetReviews = createSelector(
    targetReviewsRetrieve,
    (targetReviews) => ({ targetReviews })
)



const AllProducts = ({ initialInput, ...props }: any) => {
    //Hook intilizations 
    const [boxSize, setBoxSize] = useState<string>("45%");
    const { setTargetProducts, setTargetReviews } = actionDispath(useDispatch());
    const { setAllBrands } = actionDispath(useDispatch());
    const { targetProducts } = useSelector(retrieveTargetProducts)
    const { allBrands } = useSelector(retrieveAllBrands)
    const { targetReviews } = useSelector(retrieverTargetReviews)
    const [rebuild, setRebuild] = useState<Date>(new Date())

    const location = useLocation()
    const history = useHistory()
    const searchQuery = new URLSearchParams(location.search)
    const input = searchQuery.get("input") ?
        JSON.parse(searchQuery.get("input") as string) : {
            page: 1,
            limit: 6,
            order: "product_likes",
            direction: Direction.DESC,
            search: {
                priceRange: {
                    start: 40000,
                    end: 4000000
                },
            }
        }
    const [searchObj, setSearchObj] = useState<ProductSearchObject | any>(input);

    useEffect(() => {
        history.push(`/products/?input=${JSON.stringify(searchObj)}`)
    }, [searchObj])
    //React Hook 
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])
    useEffect(() => {
        //Target Products
        const productServiceApi = new ProductServiceApi();
        productServiceApi.getTargetProducts(searchObj).then(data => setTargetProducts(data)).catch(err => console.log(err))
        if (searchObj.company_id) {
            handleViewItem(searchObj.company_id, "MEMBER")
        }

        //Target Brands
        const brandsServiceApi = new BrandsServiceApi()
        brandsServiceApi.getAllBrands().then(data => setAllBrands(data)).catch(err => console.log(err))

        //Target reviews
        const communityServiceApi = new CommunityServiceApi();
        communityServiceApi.getProductReviews(searchObj.search.company_id).then((data: Review[]) => setTargetReviews(data)).catch(err => console.log(err))
    }, [searchObj, rebuild])

    //Handle 
    function handleBoxSize(size: string) { setBoxSize(size) }
    return (
        <Box className="allProducts">
            <Container className="products">
                <Stack className="pt-3" flexDirection={"row"} justifyContent={"space-between"}>
                    <Stack className="grid_filter" flexDirection={"row"} alignItems={"center"} gap={"10px"}>
                        <button className="btn" onClick={() => handleBoxSize('45%')}>
                            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M120-520v-320h320v320H120Zm0 400v-320h320v320H120Zm400-400v-320h320v320H520Zm0 400v-320h320v320H520ZM200-600h160v-160H200v160Zm400 0h160v-160H600v160Zm0 400h160v-160H600v160Zm-400 0h160v-160H200v160Zm400-400Zm0 240Zm-240 0Zm0-240Z" /></svg>
                        </button>
                        <button className="btn" onClick={() => handleBoxSize("85%")}>
                            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M200-520q-33 0-56.5-23.5T120-600v-160q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v160q0 33-23.5 56.5T760-520H200Zm0-80h560v-160H200v160Zm0 480q-33 0-56.5-23.5T120-200v-160q0-33 23.5-56.5T200-440h560q33 0 56.5 23.5T840-360v160q0 33-23.5 56.5T760-120H200Zm0-80h560v-160H200v160Zm0-400v-160 160Zm0 400v-160 160Z" /></svg>
                        </button>
                    </Stack>
                    <Stack className="" flexDirection={"row"} gap={"20px"} alignItems={"center"}>
                        <Box className="show_items">
                            Showing <span className="border ps-3 pe-3 pt-2 pb-2">{targetProducts.length}</span> products per page
                        </Box>
                        <Box className="order_items">
                            <select
                                className="form-select"
                                id="order_item"
                                onChange={(e) => {
                                    switch (e.target.value) {
                                        case "lowToHigh":
                                            searchObj.order = "product_price";
                                            searchObj.direction = Direction.ASC
                                            break;
                                        case "highToLow":
                                            searchObj.order = "product_price";
                                            searchObj.direction = Direction.DESC
                                            break;
                                        case "newToOld":
                                            searchObj.order = "createdAt";
                                            searchObj.direction = Direction.DESC
                                            break;
                                        case "oldToNew":
                                            searchObj.order = "createdAt";
                                            searchObj.direction = Direction.ASC
                                            break;
                                        default:
                                            searchObj.order = e.target.value
                                            searchObj.direction = Direction.DESC;
                                            break;
                                    }
                                    setSearchObj({ ...searchObj })
                                }}
                            >
                                <option value="product_likes" selected={searchObj.order === "product_likes"}>Best Selling</option>
                                <option value="product_views" selected={searchObj.order === "product_views"}>Popular</option>
                                <option value="createdAt" selected={searchObj.order === "createdAt"}>New</option>
                                <option value="product_discount" selected={searchObj.order === "product_discount"}>Sale</option>
                                <option value="lowToHigh" selected={searchObj.order === "lowToHigh"}>Price, low to high</option>
                                <option value="highToLow" selected={searchObj.order === "highToLow"}>Price, high to low</option>
                                <option value="newToOld" selected={searchObj.order === "newToOld"}>Date, new to old</option>
                                <option value="oldToNew" selected={searchObj.order === "oldToNew"}>Date, old to new</option>
                            </select>
                        </Box>
                        <Box className="search_input">
                            <input
                                type="text"
                                className="pe-3 ps-3 fs-6"
                                placeholder="Search, Product"
                                onKeyUpCapture={(e: any) => {
                                    searchObj.search = e.target.value
                                    setSearchObj({ ...searchObj })
                                }}
                            />
                        </Box>
                    </Stack>
                </Stack>
                <hr />
                <Stack
                    flexDirection={"row"}
                    className="products_body"
                    gap={"30px"}
                >
                    <ProductFilter
                        searchObj={searchObj}
                        setSearchObj={setSearchObj}
                        allBrands={allBrands}
                        company_id={searchObj.search.company_id}
                    />
                    <Products
                        targetProducts={targetProducts}
                        boxSize={boxSize}
                        searchObj={searchObj}
                        setSearchObj={setSearchObj}
                        setRebuild={setRebuild}
                        setAmountRebuild={props.setRebuild}
                    />
                </Stack>
                {
                    searchObj.search?.company_id ? (
                        <Box>
                            <div className="fs-1 fw-bold text-center mt-5 mb-3">Reviewing Company</div>
                            {targetReviews && targetReviews[0] ? (
                                <div className="mb-4">
                                    <ProductReview reviews={targetReviews} />
                                </div>
                            ) : (
                                <div
                                    className=" text-secondary rounded mb-5 fs-5 p-2 text-center"
                                    style={{ backgroundColor: "#DBDDEF" }}
                                >
                                    There is no comments yet!
                                </div>
                            )}
                            <ReviewWriting product_id={searchObj.search?.company_id} item_group={"MEMBER"} setRebuildReview={setRebuild} />
                        </Box>

                    ) : null
                }
            </Container>
            <DownToUpBtn address={"#"} />
        </Box>
    )
}
export default AllProducts;