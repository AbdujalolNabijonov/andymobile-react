import {Container, Stack, Tab } from "@mui/material"
import { useEffect, useState } from "react";
import { TabContext, TabList, TabPanel } from "@mui/lab"
import { HomeProducts } from "./homeProducts";

//REDUX
import { createSelector } from "reselect";
import { Dispatch } from "@reduxjs/toolkit";
import { Product } from "../../../libs/types/product";
import { setTargetHomeProducts } from "./slice";
import { retrieveTargetHomeProducts } from "./selector";
import { useDispatch, useSelector } from "react-redux";
import ProductServiceApi from "../../apiServices/productServiceApi";
import { searchObjHome } from "../../../libs/types/others";

//Slice
const actionDispatch = (dispatch: Dispatch) => (
    {
        setTargetHomeProducts: (data: Product[]) => (dispatch(setTargetHomeProducts(data)))
    }
)
//Selector
const targetProductsRetrieve = createSelector(
    retrieveTargetHomeProducts,
    (targetHomeProducts) => ({ targetHomeProducts })
)

const HomeSortProducts = (props: any) => {
    //Initializations
    const [scrolled, setScrolled] = useState<boolean>(false);
    const [value, setValue] = useState<string>("1");
    const { setTargetHomeProducts } = actionDispatch(useDispatch());
    const { targetHomeProducts } = useSelector(targetProductsRetrieve);
    const [searchObjHome, setSearchObjHome] = useState<searchObjHome>({
        limit: 4,
        page: 1,
        order: "sale",
        homeProduct: "Y",
        contractMonth: []

    })
    //three circle hook
    useEffect(() => {
        //Fetching Data
        const productServiceApi = new ProductServiceApi();
        productServiceApi.getTargetProducts(searchObjHome).then(data => setTargetHomeProducts(data)).catch(err => console.log(err))
        //handlers
        function handleScroll() {
            setScrolled(window.scrollY > 2400)
        }
        window.addEventListener("scroll", handleScroll)
        return () => {
            window.removeEventListener("scroll", handleScroll)
        }
    }, [value, searchObjHome])

    //handlers
    const handleProducts = (order: string, status: string) => {
        const newSearchObj = { ...searchObjHome }
        newSearchObj.order = status
        newSearchObj.page = 1
        setSearchObjHome(newSearchObj)
        setValue(order)
    }
    return (
        <Container className="homeProducts">
            <TabContext value={value}>
                <Stack justifyContent={"center"} flexDirection={"row"}>
                    <TabList>
                        <Tab className="tab" value="1" label="SALE" onClick={() => handleProducts('1', "sale")} />
                        <Tab className="tab" value="2" label="NEW" onClick={() => handleProducts('2', "new")} />
                        <Tab className="tab" value="3" label="POPULAR" onClick={() => handleProducts('3', "popular")} />
                    </TabList>
                </Stack>
                <TabPanel value={"1"}>
                    <HomeProducts
                        scrolled={scrolled}
                        products={targetHomeProducts}
                        searchObjHome={searchObjHome}
                        setSearchObjHome={setSearchObjHome}
                    />
                </TabPanel>
                <TabPanel value={"2"}>
                    <HomeProducts
                        scrolled={scrolled}
                        products={targetHomeProducts}
                        searchObjHome={searchObjHome}
                        setSearchObjHome={setSearchObjHome}
                    />
                </TabPanel>
                <TabPanel value={"3"}>
                    <HomeProducts
                        scrolled={scrolled}
                        products={targetHomeProducts}
                        searchObjHome={searchObjHome}
                        setSearchObjHome={setSearchObjHome}
                    />
                </TabPanel>
            </TabContext>
        </Container>
    )
}

export default HomeSortProducts;