import { Box, Stack } from "@mui/material";
import Slider, { SliderThumb } from "@mui/material/Slider";
import { styled } from "@mui/material/styles";
import { Brand } from "../../../libs/types/member";
import { serverApi } from "../../../libs/config";
import { useState } from "react";
import { useHistory} from "react-router-dom";

const colorsList = [
    { color: "Black", index: "#000000" },
    { color: "Blue", index: "#0069B4" },
    { color: "Gold", index: "#EFBF00" },
    { color: "Green", index: "#008000" },
    { color: "Grey", index: "#61646A" },
    { color: "Pink", index: "#F366AB" },
    { color: "Purple", index: "#994DA2" },
    { color: "Red", index: "#FF0000" },
    { color: "White", index: "#FFFFFF" },
    { color: "Silver", index: "#C0C0C0" },
    { color: "Yellow", index: "#FEEF00" }
]

export const ProductFilter = (props: any) => {
    //Initializations
    const [chosenBrand, setChosenBrand] = useState<string>("");
    const [priceRange, setPriceRange] = useState<number[]>([400000, 4000000]);
    const [filterChosenColor, setFilterChosenColor] = useState<string>("");
    const [chosenStorage, setChosenStorage] = useState<number>();
    const location = useHistory()
    //Handlers
    function handleBrand(brand: string, id: string) {
        setChosenBrand(brand)
        props.searchObj.company_id = id;
        props.setSearchObj({ ...props.searchObj })
    }
    function handleFilterColor(colorIndex: string, color: string) {
        setFilterChosenColor(colorIndex)
        props.searchObj.color = color;
        props.setSearchObj({ ...props.searchObj })
    }

    function handleStorage(storage: number) {
        setChosenStorage(storage)
        props.searchObj.storage = storage;
        props.setSearchObj({ ...props.searchObj })
    }
    interface AirbnbThumbComponentProps extends React.HTMLAttributes<unknown> { }

    function AirbnbThumbComponent(props: AirbnbThumbComponentProps) {
        const { children, ...other } = props;
        return (
            <SliderThumb {...other}>
                {children}
                <span className="airbnb-bar" />
                <span className="airbnb-bar" />
                <span className="airbnb-bar" />
            </SliderThumb>
        );
    }
    const AirbnbSlider = styled(Slider)(({ theme }) => ({
        color: "#3a8589",
        height: 3,
        padding: "13px 0",
        "& .MuiSlider-thumb": {
            height: 27,
            width: 27,
            backgroundColor: "#fff",
            border: "1px solid currentColor",
            "&:hover": {
                boxShadow: "0 0 0 8px rgba(58, 133, 137, 0.16)",
            },
            "& .airbnb-bar": {
                height: 9,
                width: 1,
                backgroundColor: "currentColor",
                marginLeft: 1,
                marginRight: 1,
            },
        },
        "& .MuiSlider-track": {
            height: 3,
        },
        "& .MuiSlider-rail": {
            color: theme.palette.mode === "dark" ? "#bfbfbf" : "#d8d8d8",
            opacity: theme.palette.mode === "dark" ? undefined : 1,
            height: 3,
        },
    }));
    return (
        <Stack className="filter_product">
            <div className="filter-title fs-2 pb-3">
                <i className="fa fa-sort-amount-desc me-4"></i>
                <span>Filter Phones</span>
            </div>
            <Box className="actual_cost">
                <div className="accordion" id="actual_cost">
                    <div className="accordion-item border-0">
                        <h2 className="accordion-header">
                            <button className="accordion-button fw-bold fs-5" data-bs-toggle="collapse" data-bs-target="#actual_cost_list" aria-expanded="true" aria-controls="collapseOne">
                                Price
                            </button>
                        </h2>
                        <div id="actual_cost_list" className="accordion-collapse collapse " data-bs-parent="#actual_cost">
                            <Stack className="accordion-body" flexDirection={"row"} gap={"10px"}>
                                <AirbnbSlider
                                    valueLabelDisplay="auto"
                                    max={4000000}
                                    min={400000}
                                    step={50000}
                                    slots={{ thumb: AirbnbThumbComponent }}
                                    getAriaLabel={(index) =>
                                        index === 0 ? "Minimum price" : "Maximum price"
                                    }
                                    defaultValue={priceRange}
                                    onChangeCommitted={(e, newValue) => {
                                        const newPriceRange = newValue as number[];
                                        props.searchObj.minPrice = newPriceRange[0]
                                        props.searchObj.maxPrice = newPriceRange[1]
                                        props.setSearchObj({ ...props.searchObj })
                                        setPriceRange(newPriceRange);
                                    }}
                                    sx={{
                                        mt: "10px",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        width: "90%",
                                        color: "#F9D97D", // Bu yordamida track va thumb rangini o'zgartirish mumkin
                                        "& .MuiSlider-thumb": {
                                            backgroundColor: "#F9D97D", // Thumb ning ichki rangini o'zgartiradi
                                        },
                                        "& .MuiSlider-track": {
                                            backgroundColor: "#FFC107", // Trackning rangini o'zgartiradi
                                        },
                                    }}
                                />
                            </Stack>
                            <Stack
                                flexDirection={"row"}
                                justifyContent={"space-between"}
                                className="ps-3 pe-3"
                            >
                                <div>Starting Price: <span><b>{priceRange[0]}₩</b></span></div>
                                <div>Max Price: <span><b>{priceRange[1]}₩</b></span></div>
                            </Stack>
                        </div>
                    </div>
                </div>
            </Box>
            <Box className="monthly_cost">
                <div className="accordion" id="monthly_cost">
                    <div className="accordion-item border-0">
                        <h2 className="accordion-header">
                            <button className="accordion-button fw-bold fs-5" data-bs-toggle="collapse" data-bs-target="#monthly_cost_list" aria-expanded="true" aria-controls="collapseOne">
                                Monthly Price
                            </button>
                        </h2>
                        <div id="monthly_cost_list" className="accordion-collapse collapse" data-bs-parent="#monthly_cost">
                            <Stack className="accordion-body" flexDirection={"row"} gap={"10px"}>
                                <select
                                    name=""
                                    id=""
                                    className="form-select"
                                    onChange={(e: any) => {
                                        props.searchObj.contractMonth = e.target.value;
                                        props.setSearchObj({ ...props.searchObj })
                                    }}
                                >
                                    <option value={["0", "24"]}>Deal month contract</option>
                                    <option value={["0", "6"]}>0 ~ 6 months</option>
                                    <option value={['6', "12"]}>6 ~ 12 months</option>
                                    <option value={["12", "24"]}>12 ~ 24 months</option>
                                </select>
                            </Stack>
                            <div className="text-center text-danger">Monthly fee in Korean currency, Won</div>
                        </div>
                    </div>
                </div>
            </Box>
            {props.company_id ? null : (
                <Box>
                    <div className="accordion" id="brands">
                        <div className="accordion-item border-0">
                            <h2 className="accordion-header">
                                <button className="accordion-button fw-bold fs-5" data-bs-toggle="collapse" data-bs-target="#brands_list" aria-expanded="true" aria-controls="collapseOne">
                                    Brands
                                </button>
                            </h2>
                            <div id="brands_list" className="accordion-collapse collapse" data-bs-parent="#brands">
                                <Stack
                                    className="accordion-body pb-3 pt-3"
                                    flexDirection={"row"}
                                    gap={"7px"}
                                    flexWrap={"wrap"}
                                    justifyContent={"center"}
                                    alignItems={"satrt"}
                                >
                                    {props.allBrands.map((ele: Brand, index: number) => {
                                        const image_url = `${serverApi}/${ele.mb_image}`
                                        return (
                                            <Box
                                                className="brand_box"
                                                style={chosenBrand === index.toString() ? { border: "2px solid black" } : {}}
                                                onClick={() => handleBrand((index.toString()), ele._id)}
                                            >
                                                <div className="brand_img">
                                                    <img src={image_url} alt="apple_logo" className="w-100 rounded" />
                                                </div>
                                                <div className="brand_name_2 ">{ele.mb_nick}</div>
                                            </Box>
                                        )
                                    })}
                                </Stack>
                            </div>
                        </div>
                    </div>
                </Box>
            )}
            <Stack className="colors">
                <div className="accordion" id="colors">
                    <div className="accordion-item border-0">
                        <h2 className="accordion-header">
                            <button className="accordion-button fw-bold fs-5" data-bs-toggle="collapse" data-bs-target="#colors_list" aria-expanded="true" aria-controls="collapseOne">
                                Colours
                            </button>
                        </h2>
                        <div id="colors_list" className="accordion-collapse collapse colors_list" data-bs-parent="#colors" >
                            <Stack
                                className="accordion-body"
                                flexDirection={"row"}
                                flexWrap={"wrap"}
                                gap={"5px"}
                                justifyContent={"start"}
                            >
                                {colorsList.map((ele, index) => (
                                    <Box
                                        className="colour_choose"
                                        onClick={() => handleFilterColor(index.toString(), ele.color)}
                                        style={filterChosenColor === index.toString() ? { border: "3px solid #1978BB" } : {}}
                                    >
                                        <div style={{ backgroundColor: `${ele.index}` }}></div>
                                        <div className="text-center">{ele.color}</div>
                                    </Box>
                                ))}
                            </Stack>
                        </div>
                    </div>
                </div>
            </Stack>
            <Stack className="storage">
                <div className="accordion" id="storage">
                    <div className="accordion-item border-0">
                        <h2 className="accordion-header">
                            <button className="accordion-button fw-bold fs-5" data-bs-toggle="collapse" data-bs-target="#storage_list" aria-expanded="true" aria-controls="collapseOne">
                                Storage
                            </button>
                        </h2>
                        <div id="storage_list" className="accordion-collapse collapse" data-bs-parent="#storage">
                            <Stack
                                className="accordion-body"
                                flexDirection={"row"}
                                flexWrap={"wrap"}
                                gap={"5px"}
                                justifyContent={"start"}
                            >
                                <div
                                    style={chosenStorage === 128 ? { backgroundColor: 'pink' } : {}}
                                    onClick={() => handleStorage(128)}
                                >128Gb</div>
                                <div
                                    style={chosenStorage === 256 ? { backgroundColor: 'pink' } : {}}
                                    onClick={() => handleStorage(256)}
                                >256Gb</div>
                                <div
                                    style={chosenStorage === 512 ? { backgroundColor: 'pink' } : {}}
                                    onClick={() => handleStorage(512)}
                                >512Gb</div>
                                <div
                                    style={chosenStorage === 1 ? { backgroundColor: 'pink' } : {}}
                                    onClick={() => handleStorage(1)}
                                >1Tb</div>
                                <div
                                    style={chosenStorage === 2 ? { backgroundColor: 'pink' } : {}}
                                    onClick={() => handleStorage(2)}
                                >2Tb</div>
                            </Stack>
                        </div>
                    </div>
                </div>
            </Stack>
            <button
                className="filter_reset_btn"
                onClick={() => {
                    if (props.company_id) {
                        location.replace("/products")
                        window.location.reload()
                    } else {
                        const new_search = {
                            limit: 6,
                            company_id: "",
                            order: "createdAt",
                            page: 1,
                            maxPrice: 0,
                            minPrice: 0,
                            contractMonth: [],
                            color: "",
                            storage: null,
                            search: ""
                        }
                        props.setSearchObj({ ...new_search })
                    }
                }}
            >
                Clear Filter
            </button>
        </Stack>
    )
}