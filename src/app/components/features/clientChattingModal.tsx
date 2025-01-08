import React, { useState } from "react";
import { Box, Button, Stack } from "@mui/material";
import "../../css/chattingBadge.css";


const export_answer = [
    "If you need to help for purchasing a product, please contact with us!",
    "Usually it depends on your location if you live on the island it takes about 2 business days",
    "Yes you can If you don't open product We can take back and 2~3 business day we will transit to your card",
    "We work 24 hours a day in full year, Feel free contact with us"
]

const sender_htmlElement = (answer: any) => {
    return (
        <Stack className="bot_sender_msg" direction={"row"} alignItems={"center"} gap="10px">
            <img src="/icons/bot_img.jpg" alt="" />
            <div>{answer}</div>
        </Stack>
    )
}
const receiver_htmlElement = (question: string) => {
    return (
        <Stack className="sender_question" alignItems={"end"}>
            <div>{question}</div>
        </Stack>
    )
}

const ChattingClient = (props: any) => {
    //Initilizations
    const [msgs, setMsgs] = useState<any[]>([])
    //Handlers
    function handleQuestions(e: any, q_order: number) {
        e.target.style.display = "none"
        setMsgs([...msgs, receiver_htmlElement(e.target.innerText), sender_htmlElement(export_answer[q_order])])
    }
    return (
        <Stack
            data-aos="fade-up"
            data-aos-delay={100}
            className={props.openChat ? "clientChattingPage aos-animate " : "clientChattingPage"}
            style={props.openChat ? { zIndex: 10000 } : {}}
        >
            <Stack direction={"row"} justifyContent={"space-between"} className="chatting-header">
                <Stack
                    className="chatting-title"
                    direction={"row"}
                    gap={"10px"}
                    alignItems={"center"}
                >
                    <div>
                        <img src="/icons/bot_img.jpg" alt="" width={"40px"} />
                    </div>
                    <div>
                        Smart Bot Chatting
                    </div>
                </Stack>
                <div>
                    <Button onClick={props.handleCloseChat}><i className="fa-solid fa-xmark"></i></Button>
                </div>
            </Stack>
            <Box className="chatting-body">
                <Stack className="bot_sender_msg" direction={"row"} alignItems={"center"} gap="10px">
                    <img src="/icons/bot_img.jpg" alt="" />
                    <div id="bot_greet">Hey there! Ask us any question. How can I help?</div>
                </Stack>
                <div className="questions_msg">
                    <div onClick={(e) => handleQuestions(e, 0)}>I need a help to purchase a product</div>
                    <div onClick={(e) => handleQuestions(e, 1)}>When I recieve my product after purchasing it ?</div>
                    <div onClick={(e) => handleQuestions(e, 2)}>Can I return product after delivering ?</div>
                    <div onClick={(e) => handleQuestions(e, 3)}>Service Working hours ?</div>
                </div>
                <Stack>
                    {msgs.map(ele => (
                        ele
                    ))}
                </Stack>
            </Box>
        </Stack>
    )
}

export default ChattingClient;