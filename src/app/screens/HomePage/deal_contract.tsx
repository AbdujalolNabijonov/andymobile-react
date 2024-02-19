import { Box, Stack, Container } from "@mui/material"

export const DealContract = () => {
    return (
        <Box className="deal-contract">
            <Container className="mt-5">
                <Stack flexDirection={"row"} gap={"50px"} alignItems={"center"}>
                    <div className="deal_img">
                        <img src="/icons/monthly_payment.jpg" alt="" />
                    </div>
                    <div className="deal_info">
                        <div className="deal_title fs-1">
                            Now, You can even pay monthly.
                        </div>
                        <p className="text-secondary fs-6">We offer to our trustfull clients to buy product for monthly payment.</p>
                        <Stack flexDirection={"row"} alignItems={"center"} gap={"20px"}>
                            <div className="deal_learn">
                                <a href=""> <span>LEARN MORE</span><i className="fa-solid ms-1 fa-arrow-up-right-from-square"></i></a>
                            </div>
                            <button className="btn btn-outline-secondary rounded-pill">Buy Now</button>
                        </Stack>
                    </div>
                </Stack>
            </Container>
        </Box>
    )
}