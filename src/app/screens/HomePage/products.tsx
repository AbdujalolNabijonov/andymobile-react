import { Box, Container, Stack, Tab } from "@mui/material"
import { useEffect, useState } from "react";
import { TabContext, TabList, TabPanel } from "@mui/lab"
import { SaleProducts } from "./saleProducts";

const HomeProducts = () => {
    const [scrolled, setScrolled] = useState<boolean>(false)
    const [value, setValue] = useState<string>("1")
    useEffect(() => {
        function handleScroll() {
            setScrolled(window.scrollY > 1600)
        }
        window.addEventListener("scroll", handleScroll)
        return()=>{
            window.removeEventListener("scroll", handleScroll)
        }
    }, [value])

    const handleProducts = (order: string) => {
        setValue(order)
    }
    return (
        <Container className="homeProducts">
            <TabContext value={value}>
                <Stack justifyContent={"center"} flexDirection={"row"}>
                    <TabList>
                        <Tab className="tab" value="1" label="SALE" onClick={() => handleProducts('1')} />
                        <Tab className="tab" value="2" label="NEW" onClick={() => handleProducts('2')} />
                        <Tab className="tab" value="3" label="POPULAR" onClick={() => handleProducts('3')} />
                    </TabList>
                </Stack>
                <TabPanel value={"1"}>
                    <SaleProducts scrolled={scrolled} />
                </TabPanel>
                <TabPanel value={"2"}>
                    <SaleProducts scrolled={scrolled} />
                </TabPanel>
                <TabPanel value={"3"}>
                    <SaleProducts scrolled={scrolled} />
                </TabPanel>
            </TabContext>
        </Container>
    )
}

export default HomeProducts;