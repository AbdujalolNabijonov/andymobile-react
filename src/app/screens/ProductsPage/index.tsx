import React from "react"
import { Route, Switch, useRouteMatch } from "react-router-dom"
import { ChosenProduct } from "./chosenProduct"
import AllProducts from "./allProducts"
import { Box, Container } from "@mui/material"
import "../../css/productPage.css"



const ProductsPage = (props: any) => {
    //initializations
    const location = useRouteMatch().path
    return (
        <Box>
            <Box className="productPage">
                <Switch>
                    <Route path={`${location}/product/:product_id`}>
                        <ChosenProduct
                            handleSaveBasket={props.handleSaveBasket}
                            setAmountRebuild={props.setRebuild}
                        />
                    </Route>
                    <Route path={`${location}`}>
                        <AllProducts setRebuild={props.setRebuild} />
                    </Route>
                </Switch>
            </Box>
            <Container>
                <Box className={"notify-warn"}>
                    Mobile version is developing now <br />
                    Enjoy with desktop version untill mobile version is done.
                </Box>
            </Container>
        </Box>
    )
}

export default ProductsPage