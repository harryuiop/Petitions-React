import NavBar from "./NavBar";
import { Alert, Box, Snackbar, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
import React, { useEffect, useState } from "react";
import OutterPetitionTable from "./OutterPetitionTable";
import { useUserAuthDetailsContext } from "../utils/userAuthContext";

const Home = () => {
    const userAuth = useUserAuthDetailsContext();
    const [searchInput, setSearchInput] = useState("");
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackMessage, setSnackMessage] = useState("");

    useEffect(() => {
        const isLoggedIn = localStorage.getItem("isLoggedIn");
        const PetitionDeleted = localStorage.getItem("PetitionDeleted");

        if (isLoggedIn === "true") {
            setSnackbarOpen(true);
            setSnackMessage("Successfully logged in");
            localStorage.removeItem("isLoggedIn");
        } else if (PetitionDeleted) {
            setSnackbarOpen(true);
            setSnackMessage("Petition successfully deleted");
            localStorage.removeItem("PetitionDeleted");
        }
    }, [userAuth.authUser.userId]);

    const handleSnackbarClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === "clickaway") {
            return;
        }
        setSnackbarOpen(false);
    };

    return (
        <div>
            <NavBar
                callbackSearchInput={setSearchInput}
                searchInput={searchInput}
                includeSearchBar={true}
            />

            <Box mt={10}>
                <Typography variant="h4" color={grey[200]} align="center" sx={{ padding: 3 }}>
                    Find Petitions
                </Typography>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <OutterPetitionTable searchInput={searchInput} />
                </Box>
            </Box>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={4000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
                <Alert
                    onClose={handleSnackbarClose}
                    severity="success"
                    sx={{ width: "100%", marginRight: 2, marginTop: 10 }}
                >
                    {snackMessage}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default Home;
