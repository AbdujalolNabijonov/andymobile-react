import React from "react";
import { Route, Switch, useLocation, useRouteMatch } from "react-router-dom"
import { OtherPage } from "./otherPage"
import { MyPage } from "./myPage";
import { Box, Container } from "@mui/material";
import "../../css/myPage.css"


const MemberPage = (props: any) => {
    //Initializations
    const member = useRouteMatch(),
        useQuery = () => {
            const { search } = useLocation();
            return React.useMemo(() => (new URLSearchParams(search)), [search])
        },
        chosen_mb_id: string | null = useQuery().get("mb_id") ?? null,
        chosen_art_id: string | null = useQuery().get("art_id") ?? null;
    return (
        <Box>
            <Box className="user-page">
                <Switch >
                    <Route path={`${member.path}/other`}>
                        <OtherPage
                            mb_id={chosen_mb_id}
                            art_id={chosen_art_id}
                            setRebuild={props.setRebuild}
                        />
                    </Route>
                    <Route path={`${member.path}`}>
                        <MyPage
                            reBuild={props.reBuild}
                            setRebuild={props.setRebuild}
                            art_id={chosen_art_id}
                            handleLogOut={props.handleLogOut}
                        />
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

export default MemberPage;

