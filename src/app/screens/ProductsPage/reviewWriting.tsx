import { Box, Stack } from "@mui/material";
import { useRef, useState } from "react";

//Rating
import { styled } from '@mui/material/styles';
import Rating, { IconContainerProps } from '@mui/material/Rating';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import SentimentSatisfiedIcon from '@mui/icons-material/SentimentSatisfied';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAltOutlined';
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied';
import CommunityServiceApi from "../../apiServices/communityServiceApi";
import { verifiedMemberData } from "../../apiServices/verified";
import assert from "assert";
import { sweetErrorHandling, sweetTopSmallSuccessAlert } from "../../libs/sweetAlert";
import Definer from "../../libs/Definer";

const customIcons: {
    [index: string]: {
        icon: React.ReactElement;
        label: string;
    };
} = {
    1: {
        icon: <SentimentVeryDissatisfiedIcon color="error" />,
        label: 'Very Dissatisfied',
    },
    2: {
        icon: <SentimentDissatisfiedIcon color="error" />,
        label: 'Dissatisfied',
    },
    3: {
        icon: <SentimentSatisfiedIcon color="warning" />,
        label: 'Neutral',
    },
    4: {
        icon: <SentimentSatisfiedAltIcon color="success" />,
        label: 'Satisfied',
    },
    5: {
        icon: <SentimentVerySatisfiedIcon color="success" />,
        label: 'Very Satisfied',
    },
};
const StyledRating = styled(Rating)(({ theme }) => ({
    '& .MuiRating-iconEmpty .MuiSvgIcon-root': {
        color: theme.palette.action.disabled,
    },
}));
const ReviewWriting = (props: any) => {
    //Initializations
    const [characters, setCharacters] = useState<number>(1500);
    const [value, setValue] = useState<number>(2);
    const [context, setContext] = useState<string>("");
    const refs: any = useRef([])
    //Handlers
    function handleCharacterLimit(e: any) {
        setContext(e.target.value)
        setCharacters(1500 - e.target.value.length)
    }
    async function handleSubmitReview() {
        try {
            if (!context) {
                throw new Error(Definer.input_err1);
            }
            assert.ok(verifiedMemberData, Definer.auth_err1)
            const communityServiceApi = new CommunityServiceApi()
            await communityServiceApi.createReview(
                {
                    review_stars: value,
                    review_context: context,
                    review_target_id: props.product_id,
                    review_group: props.item_group,
                }
            )
            await sweetTopSmallSuccessAlert("Successfully submitted!", 500, false)
            props?.setRebuildReview(new Date())
            refs.current["context"].value = ""
        } catch (err: any) {
            console.log(err)
            await sweetErrorHandling(err)
        }
    }
    function handleIconContainer(props: IconContainerProps) {
        const { value, ...other } = props;
        return <span {...other} >{customIcons[value].icon}</span>;
    }
    return (
        <Box className={"reviewPage"}>
            <div className="review_body">
                {
                    props.title_enabled ? (
                        <div className="mb-2"><span className="fs-4 text-secondary fw-bold">Body of Review </span><span className={characters < 0 ? "fs-5 text-danger" : "fs-5"}>({characters})</span></div>
                    ) : null
                }
                <Stack
                    flexDirection={"row"}
                    alignItems={"center"}
                    gap={"15px"}
                    className="mb-3"
                >
                    <div className="fw-bold fs-5">Rating:</div>
                    <StyledRating
                        name="highlight-selected-only"
                        defaultValue={value}
                        IconContainerComponent={handleIconContainer}
                        getLabelText={(value: number) => customIcons[value].label}
                        highlightSelectedOnly
                        onChange={(e, newValue: any) => (setValue(newValue))}
                        className="select_rating"
                    />
                </Stack>
                <textarea
                    ref={(ele) => refs.current["context"] = ele}
                    className="form-control p-2 mt-2"
                    style={{ position: "relative", zIndex: "2" }}
                    placeholder="Write your comment from here"
                    cols={40}
                    onChange={handleCharacterLimit}
                ></textarea>
            </div>
            <Stack>
                <button
                    className="btn btn-warning rounded"
                    onClick={handleSubmitReview}
                >SUBMIT REVIEW</button>
            </Stack>
        </Box>
    )
}

export default ReviewWriting;