import {Container, Stack, Tab } from "@mui/material"
import { useEffect, useState } from "react";
import { TabContext, TabList, TabPanel } from "@mui/lab"
import { HomeProducts } from "./homeProducts";

//REDUX
import { createSelector } from "reselect";
import { Dispatch } from "@reduxjs/toolkit";
import { setTargetHomeProducts } from "./slice";
import { retrieveTargetHomeProducts } from "./selector";
import { useDispatch, useSelector } from "react-redux";
import ProductServiceApi from "../../apiServices/productServiceApi";
import { Direction } from "../../libs/enums/product";
import { Product, ProductSearchObject } from "../../libs/types/product";

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
    const [searchObj, setSearchObj] = useState<ProductSearchObject>({
        page: 1,
        limit: 4,
        order: "product_discount",
        direction:Direction.DESC,
        search:{
        }

    })
    //three circle hook
    useEffect(() => {
        //Fetching Data
        const productServiceApi = new ProductServiceApi();
        productServiceApi.getTargetProducts(searchObj).then(data => setTargetHomeProducts(data)).catch(err => console.log(err))
        //handlers
        function handleScroll() {
            setScrolled(window.scrollY > 2400)
        }
        window.addEventListener("scroll", handleScroll)
        return () => {
            window.removeEventListener("scroll", handleScroll)
        }
    }, [value, searchObj])

    //handlers
    const handleProducts = (e:React.MouseEvent<HTMLElement>, status: string) => {
        searchObj.order = status
        setSearchObj({...searchObj})
    }
    const handleChangeValue=(e:any,value:number)=>{
        setValue(String(value))
    }
    return (
        <Container className="homeProducts">
            <TabContext value={value}>
                <Stack justifyContent={"center"} flexDirection={"row"}>
                    <TabList onChange={handleChangeValue}>
                        <Tab className="tab" value="1" label="SALE" onClick={(e) => handleProducts(e,"product_discount")} />
                        <Tab className="tab" value="2" label="NEW" onClick={(e) => handleProducts(e, "createdAt")} />
                        <Tab className="tab" value="3" label="POPULAR" onClick={(e) => handleProducts(e, "product_views")} />
                    </TabList>
                </Stack>
                <TabPanel value={"1"}>
                    <HomeProducts
                        scrolled={scrolled}
                        products={targetHomeProducts}
                        searchObj={searchObj}
                        setSearchObj={setSearchObj}
                    />
                </TabPanel>
                <TabPanel value={"2"}>
                    <HomeProducts
                        scrolled={scrolled}
                        products={targetHomeProducts}
                        searchObj={searchObj}
                        setSearchObj={setSearchObj}
                    />
                </TabPanel>
                <TabPanel value={"3"}>
                    <HomeProducts
                        scrolled={scrolled}
                        products={targetHomeProducts}
                        searchObj={searchObj}
                        setSearchObj={setSearchObj}
                    />
                </TabPanel>
            </TabContext>
        </Container>
    )
}

export default HomeSortProducts;