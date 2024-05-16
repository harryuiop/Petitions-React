import { AppBar, Button, Stack, Toolbar, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { blue, grey } from "@mui/material/colors";
import React from "react";
import IconButton from "@mui/material/IconButton";
import SearchBar from "./SearchBar";
import HandshakeIcon from "@mui/icons-material/Handshake";
import { useUserAuthDetailsContext } from "../utils/userAuthContext";

const NavBar = ({
    callbackSearchInput,
    searchInput,
    includeSearchBar,
}: {
    callbackSearchInput: React.Dispatch<React.SetStateAction<string>>;
    searchInput: string;
    includeSearchBar: boolean;
}) => {
    const userAuth = useUserAuthDetailsContext();

    return (
        <AppBar>
            <Toolbar
                sx={{
                    marginLeft: 10,
                    marginRight: 10,
                    display: "flex",
                    justifyContent: "space-between",
                }}
            >
                <Stack direction="row" spacing={2} alignItems="center">
                    <IconButton
                        component={Link}
                        to="/"
                        size="large"
                        edge="start"
                        sx={{ color: blue[300] }}
                    >
                        <HandshakeIcon />
                    </IconButton>
                    <Typography variant="h6" color={grey[200]} component="div">
                        PetitionPoint
                    </Typography>
                </Stack>
                {includeSearchBar ? (
                    <SearchBar
                        callbackSearchInput={callbackSearchInput}
                        searchInput={searchInput}
                    />
                ) : (
                    <></>
                )}
                <Stack direction="row" spacing={2}>
                    {userAuth.authUser.loggedIn ? (
                        <>
                            <Button component={Link} to={"/petition/create"}>
                                Create Petition
                            </Button>
                            <Button
                                component={Link}
                                to={"/user/profile/" + userAuth.authUser.userId}
                            >
                                Profile
                            </Button>
                            <Button onClick={() => userAuth.handleLogout()}> Log Out </Button>
                        </>
                    ) : (
                        <Button component={Link} to="/signin">
                            Sign in
                        </Button>
                    )}
                </Stack>
            </Toolbar>
        </AppBar>
    );
};

export default NavBar;
