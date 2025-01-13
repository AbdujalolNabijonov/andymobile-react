import { Box, Stack } from "@mui/material"
import { Dispatch } from "@reduxjs/toolkit"
import TransactionServiceApi from "../../apiServices/transactionServiceApi"
import { stringSplitterHandler } from "../../components/features/stringSplitter"
import { Bank } from "../../libs/types/bank"
import Definer from "../../libs/Definer"
import { sweetErrorHandling, sweetTopSmallSuccessAlert } from "../../libs/sweetAlert"

//Redux
import { createSelector } from "reselect"
import { useDispatch, useSelector } from "react-redux"
import { useEffect, useRef, useState } from "react"
import { setChosenBank } from "./slice"
import { chosenBankCardRetrieve } from "./selector"

//Slice
const actionDispatch = (dispatch: Dispatch) => ({
    setChosenBankCard: (data: Bank) => dispatch(setChosenBank(data))
})

//Selector
const retrieveChosenBank = createSelector(
    chosenBankCardRetrieve,
    (chosenBankCard) => ({ chosenBankCard })
)
const BankTransition = () => {
    //Initializations
    const { setChosenBankCard } = actionDispatch(useDispatch());
    const { chosenBankCard } = useSelector(retrieveChosenBank);
    const [bankName, setBankName] = useState<string>('');
    const [bankNumber, setBankNumber] = useState<string>("");
    const [bankExpiry, setBankExpiry] = useState<string>('');
    const [bankCvc, setBankCvc] = useState<string>('');
    const [bankPin, setBankPin] = useState<string>('');
    const [rebuild, setRebuild] = useState<Date>(new Date())
    const refs: any = useRef([])
    //React Hook
    useEffect(() => {
        //Chosen Bank Card
        const transactionServiceApi = new TransactionServiceApi()
        transactionServiceApi.getChosenBankCard()
            .then(data => setChosenBankCard(data))
            .catch(err => console.log(err))
    }, [rebuild])

    //Handlers
    const handleCardName = (e: any) => {
        setBankName(e.target.value)
    }
    const handleBankNumber = (e: any) => {
        e.target.value = e.target.value.replace(/\D/g, "")
        setBankNumber(stringSplitterHandler(e.target.value, 4, " "))
    }

    const handleCardExpiry = async (e: any) => {
        try {
            if ((e.target.value.slice(0, 2) * 1) > 12 || (e.target.value.slice(2) * 1) > 31) {
                e.target.value = ""
                e.target.focus()
                throw new Error(Definer.input_err5)
            } else {
                e.target.value = e.target.value.replace(/\D/g, "")
                if (e.target.value.length === 4) {

                    setBankExpiry(e.target.value.substring(0, 2) + "/" + e.target.value.substring(2))
                }
            }
        } catch (err: any) {
            await sweetErrorHandling({ message: err.message })
        }
    }

    const handleCardCvc = (e: any) => {
        e.target.value = e.target.value.replace(/\D/g, "")
        if (e.target.value.length === 3) {
            setBankCvc(e.target.value)
        }
    }
    const handleCardPin = (e: any) => {
        e.target.value = e.target.value.replace(/\D/g, "")
        if (e.target.value.length === 2) {
            setBankPin(e.target.value)
        }
    }
    const handleSaveBankCard = async () => {
        try {
            const data = {
                card_owner_name: bankName,
                card_number: bankNumber,
                card_expiry: bankExpiry,
                card_cvc: bankCvc,
                card_pincode: bankPin
            }
            //Saving Bank Card
            const transactionServiceApi = new TransactionServiceApi();
            await transactionServiceApi.createBankCard(data)
            await sweetTopSmallSuccessAlert("Successfully saved!", 700, false)
            refs.current["name"].value = ""
            refs.current["number"].value = ""
            refs.current["expiry"].value = ""
            refs.current["cvc"].value = ""
            refs.current["pin"].value = ""
            setRebuild(new Date())
        } catch (err: any) {
            await sweetErrorHandling(err)
        }
    }
    return (
        <Stack alignItems={"center"}>
            <Box className="bank_card">
                <div className="owner_name_hide"></div>
                <div className="owner_name">
                    {bankName ? bankName : chosenBankCard?.card_owner_name ? chosenBankCard?.card_owner_name : "No name provided"}
                </div>
                <div className="hide_info_card"></div>
                <div className="card_number">
                    {bankNumber ? bankNumber : stringSplitterHandler(chosenBankCard?.card_number ?? 1000000000000000, 4, " ")}
                </div>
                <div className="card_expire">
                    {bankExpiry ? bankExpiry : chosenBankCard?.card_expiry ? chosenBankCard.card_expiry : "N/A"}
                </div>
                <div className="hide_info"></div>
                <div className="bank_cvc">
                    {bankCvc ? bankCvc : chosenBankCard?.card_cvc ? chosenBankCard?.card_cvc : "N/A"}
                </div>
            </Box>
            <div className="card_title mt-3 fw-bold fs-3 text-center">
                Bank Deposit Card
            </div>
            <Stack id="card_add" alignItems={"center"}>
                <Box className="card_add">
                    <Box className="card_owner">
                        <label htmlFor="owner fs-5 fw-bold">Card Owner</label>
                        <input
                            ref={(ele) => refs.current["name"] = ele}
                            className="ps-2 pe-2"
                            type="text"
                            placeholder={chosenBankCard?.card_owner_name ?? "E.X John Carter"}
                            onChange={handleCardName}
                            maxLength={35}
                            key={35}
                        />
                    </Box>
                    <Box className="card_number">
                        <label htmlFor="owner fs-5 fw-bold">Card Number</label>
                        <input
                            ref={(ele) => refs.current["number"] = ele}
                            className="ps-2 pe-2"
                            type="text"
                            placeholder={`${chosenBankCard?.card_number ?? 1000000000000000}`}
                            maxLength={16}
                            key={16}
                            onChange={handleBankNumber}
                        />
                    </Box>
                    <Stack
                        flexDirection={"row"}
                        justifyContent={"space-between"}
                        gap={"20px"}
                    >
                        <Box className="card_owner">
                            <label htmlFor="owner fs-5 fw-bold">Expiry Date</label>
                            <input
                                ref={(ele) => refs.current["expiry"] = ele}
                                className="ps-2 pe-2"
                                type="text"
                                placeholder={chosenBankCard?.card_expiry ?? "N/A"}
                                onChange={handleCardExpiry}
                                maxLength={4}
                                key={4}
                            />
                        </Box>
                        <Box className="card_owner">
                            <label htmlFor="owner fs-5 fw-bold">CVC</label>
                            <input
                                ref={(ele) => refs.current["cvc"] = ele}
                                className="ps-2 pe-2"
                                type="text"
                                placeholder={`${chosenBankCard?.card_cvc ?? "N/A"}`}
                                maxLength={3}
                                key={3}
                                onChange={handleCardCvc}
                            />
                        </Box>
                        <Box className="card_owner">
                            <label htmlFor="owner fs-5 fw-bold">PinCode</label>
                            <input
                                ref={(ele) => refs.current["pin"] = ele}
                                className="ps-2 pe-2"
                                type="password"
                                placeholder={"**"}
                                maxLength={2}
                                key={2}
                                onChange={handleCardPin}
                            />
                            <div className="text-danger ps-2" style={{ fontSize: "10px" }}>Please, Enter first 2 numbers of pincode</div>
                        </Box>
                    </Stack>
                    <Stack className="mt-3" alignItems={"center"}>
                        <button
                            className="w-50 btn btn-outline-success"
                            onClick={handleSaveBankCard}
                        >
                            Save
                        </button>
                    </Stack>
                </Box>
            </Stack>
        </Stack>
    )
}

export default BankTransition