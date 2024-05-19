import { useUserAuthDetailsContext } from "../utils/userAuthContext";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Box, Button, Grid, Grow, Typography } from "@mui/material";
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

    if (
        userAuth.authUser.userId === -1 ||
        userAuth.authUser.userId !== parseInt(id as string, 10)
    ) {
        navigate("/");
    }

    useEffect(() => {
        setUserId(userAuth.authUser.userId);

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
        console.log(userAuth.authUser.userId);
        // console.log(userInformation);
        setChecked(true);
    }, []);

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
                            <MyPetitionsTable />
                        </Grid>
                    </Grid>
                </Grow>
            </Box>
        </>
    );
};

export default UserProfile;
