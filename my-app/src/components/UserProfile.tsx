import { useUserAuthDetailsContext } from "../utils/userAuthContext";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Alert, Box, Button, Grid, Grow, Snackbar, Typography } from "@mui/material";
import NavBar from "./NavBar";
import { defaultUser } from "../utils/defaultStates";
import { User } from "user";
import axios from "axios";
import { API_BASE_URL } from "../config";
import MyPetitionsTable from "./MyPetitionsTable";

const UserProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const userAuth = useUserAuthDetailsContext();
    const [userId, setUserId] = useState(-1);
    const [userInformation, setUserInformation] = useState<User>(defaultUser);
    const [userProfilePhoto, setUserProfilePhoto] = useState("");
    const [errorFlag, setErrorFlag] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [checked, setChecked] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackMessage, setSnackMessage] = useState("");
    const [publicIds, setPublicIds] = useState<number[]>([]);

    useEffect(() => {
        fetchAllOwnerIds().then((result: any) => {
            if (userAuth.authUser.userId === -1 || result.contains(userAuth.authUser.userId)) {
                navigate("/");
            }
        });

        setUserId(userAuth.authUser.userId);

        const ProfileEdited = localStorage.getItem("DetailsUpdated");
        if (ProfileEdited === "true") {
            setSnackbarOpen(true);
            setSnackMessage("Details Successfully updated");
            localStorage.removeItem("DetailsUpdated");
        }

        const fetchUserInformation = async () => {
            await axios
                .get(API_BASE_URL + "/users/" + id, {
                    headers: {
                        "X-Authorization": userAuth.authUser.token,
                    },
                })
                .then(
                    (response) => {
                        setErrorFlag(false);
                        setErrorMessage("");
                        setUserInformation(response.data);
                    },
                    (error) => {
                        setErrorFlag(true);
                        setErrorMessage(error.toString());
                    },
                );
        };

        const fetchUserProfileImage = async () => {
            try {
                const response = await axios.get(API_BASE_URL + "/users/" + id + "/image", {
                    headers: {
                        "X-Authorization": userAuth.authUser.token,
                    },
                    responseType: "blob",
                });
                setErrorFlag(false);
                setErrorMessage("");
                const url = URL.createObjectURL(response.data);
                setUserProfilePhoto(url);
            } catch (error: any) {
                setErrorFlag(true);
                setErrorMessage(error.toString());
            }
        };

        fetchUserInformation();
        fetchUserProfileImage();
        setChecked(true);
    }, []);

    const fetchAllOwnerIds = async () => {
        try {
            const petitionOwnersId = await axios.get(API_BASE_URL + "/petitions");
            const petitions = petitionOwnersId.data;

            const filteredOwnerIds = petitionOwnersId.data.map((petition: any) => petition.ownerId);
            const promises = petitions.map(async (petition: any) => {
                const result = await axios.get(
                    API_BASE_URL + "v1/petitions/" + petition.petitionId + "/supporters",
                );
                return result.data.supporterId;
            });

            const supporterIds = await Promise.all(promises);
            const flatSupporterIds = supporterIds.flat();

            return [...filteredOwnerIds, ...flatSupporterIds];
        } catch (error: any) {
            setErrorFlag(true);
            setErrorMessage(error.toString());
        }
    };

    const handleSnackbarClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === "clickaway") {
            return;
        }
        setSnackbarOpen(false);
    };

    return (
        <>
            <NavBar callbackSearchInput={() => {}} searchInput={""} includeSearchBar={false} />
            <Box mt={10} sx={{ marginTop: 10 }}>
                <Grow
                    in={checked}
                    style={{ transformOrigin: "0 0 0" }}
                    {...(checked ? { timeout: 350 } : {})}
                >
                    <Grid
                        container
                        spacing={2}
                        sx={{ paddingTop: 20, paddingLeft: 3, paddingBottom: 4 }}
                    >
                        <Grid item xs={4}>
                            {userProfilePhoto !== "" ? (
                                <img
                                    src={userProfilePhoto}
                                    height={275}
                                    width={275}
                                    alt={"owner-photo"}
                                    title={"owner-photo"}
                                    style={{
                                        borderRadius: "50%",
                                        objectFit: "cover",
                                    }}
                                />
                            ) : (
                                <img
                                    src={"/defaultProfileImage.jpg"}
                                    height={275}
                                    width={275}
                                    alt={"owner-photo"}
                                    title={"owner-photo"}
                                    style={{
                                        borderRadius: "50%",
                                        objectFit: "cover",
                                    }}
                                />
                            )}
                        </Grid>
                        <Grid
                            item
                            xs={8}
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "flex-start",
                                textAlign: "left",
                            }}
                        >
                            <Typography variant={"h3"} sx={{ color: "white" }}>
                                {userInformation.firstName} {userInformation.lastName}
                            </Typography>
                            <Typography variant={"h6"} sx={{ color: "white" }}>
                                {userInformation.email}
                            </Typography>
                        </Grid>

                        <Grid item xs={4}>
                            <Button
                                component={Link}
                                to={"/user/profile/" + id + "/edit"}
                                style={{ textDecoration: "none" }}
                            >
                                Edit Profile
                            </Button>
                        </Grid>
                        <Grid
                            item
                            xs={8}
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "flex-start",
                            }}
                        ></Grid>
                        <Grid
                            item
                            xs={4}
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                            }}
                        ></Grid>
                        <Grid item xs={6} sx={{ maxWidth: 10, textAlign: "left" }}>
                            <Box maxWidth={900}>
                                <MyPetitionsTable userId={id as string} />
                            </Box>
                        </Grid>
                    </Grid>
                </Grow>
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
        </>
    );
};

export default UserProfile;
