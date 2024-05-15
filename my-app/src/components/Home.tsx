import NavBar from "./NavBar";
import InnerPetitionTable from "./InnerPetitionTable";
import {Alert, Box, Snackbar, Typography} from "@mui/material";
import { grey } from "@mui/material/colors";
import React, { useEffect, useState } from "react";
import OutterPetitionTable from "./OutterPetitionTable";
import {useUserAuthDetailsContext} from "../utils/userAuthContext";

const Home = () => {
    const userAuth = useUserAuthDetailsContext();
    const [searchInput, setSearchInput] = useState("");
    const [loginSnackbarOpen, setLoginSnackbarOpen] = useState(false);

    useEffect(() => {

        const isLoggedIn = localStorage.getItem("isLoggedIn");
        if (isLoggedIn === "true") {
            setLoginSnackbarOpen(true);
            localStorage.removeItem("isLoggedIn");
        }
    }, []);

    const handleSnackbarClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setLoginSnackbarOpen(false);
    };

    return (
        <div>
            <NavBar callbackSearchInput={setSearchInput} searchInput={searchInput} includeSearchBar={true} />
            <Box mt={10} >
                <Typography variant="h4" color={grey[200]} align="center" sx={{ padding: 3 }}>
                    Find Petitions
                </Typography>
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <OutterPetitionTable searchInput={searchInput} />
                </Box>
            </Box>

            <Snackbar
                open={loginSnackbarOpen}
                autoHideDuration={4000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%', marginRight: 2, marginTop: 10 }}>
                    {"Successfully logged in"}
                </Alert>
            </Snackbar>
        </div>
    )
};

export default Home;
