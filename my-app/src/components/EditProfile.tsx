import React, { useEffect, useState } from "react";
import { defaultUser } from "../utils/defaultStates";
import { User } from "user";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useUserAuthDetailsContext } from "../utils/userAuthContext";
import axios from "axios";
import { API_BASE_URL } from "../config";
import NavBar from "./NavBar";
import { Alert, Box, Button, Grow, Snackbar, TextField, Typography } from "@mui/material";
import { green, grey } from "@mui/material/colors";

const EditProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const userAuth = useUserAuthDetailsContext();
    const [userId, setUserId] = useState(-1);
    const [userInformation, setUserInformation] = useState<User>(defaultUser);
    const [userProfilePhoto, setUserProfilePhoto] = useState("");
    const [errorFlag, setErrorFlag] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [checked, setChecked] = useState(false);
    const [snackbarSuccessOpen, setSnackbarSuccessOpen] = useState(false);
    const [snackbarFailOpen, setSnackbarFailOpen] = useState(false);

    const [inputtedProfilePhoto, setInputtedProfilePhoto] = useState("");
    const [inputtedEmail, setInputtedEmail] = useState("");
    const [inputtedCurrentPassword, setInputtedCurrentPassword] = useState("");
    const [inputtedPassword, setInputtedPassword] = useState("");
    const [inputtedFirstName, setInputtedFirstName] = useState("");
    const [inputtedLastName, setInputtedLastName] = useState("");

    const [photoInputted, setPhotoInputted] = useState(false);
    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [firstNameError, setFirstNameError] = useState(false);
    const [lastNameError, setLastNameError] = useState(false);
    const [passwordVisibility, setPasswordVisibility] = useState(true);

    if (userAuth.authUser.userId === -1) {
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
        // console.log(userInformation);
        setChecked(true);
    }, []);

    const handleSubmit = async () => {
        try {
            if (inputtedPassword !== inputtedCurrentPassword) {
                // do something
            }

            const response = await axios.patch(API_BASE_URL + "/users/" + id, {
                firstName: inputtedFirstName,
                lastName: inputtedLastName,
                email: inputtedEmail,
                password: inputtedPassword,
                currentPassword: inputtedCurrentPassword,
            });

            setInputtedLastName("");
            setInputtedFirstName("");
            setInputtedEmail("");
            setInputtedPassword("");
            setInputtedPassword("");
            setSnackbarSuccessOpen(true);
            localStorage.setItem("isLoggedIn", "true");
            navigate("/profile/" + id);
        } catch (error: any) {
            if (error.response.status === 400) {
                setErrorMessage("Invalid information");
                setSnackbarFailOpen(true);
            } else if (error.response.status === 401) {
                setErrorMessage(error.response.message);
                setEmailError(true);
                setSnackbarFailOpen(true);
            } else if (error.response.status === 403) {
                setErrorMessage(error.response.message);
                setEmailError(true);
                setSnackbarFailOpen(true);
            } else {
                setErrorMessage(error.response.message);
                setSnackbarFailOpen(true);
            }
            setInputtedLastName("");
            setInputtedFirstName("");
            setInputtedEmail("");
            setInputtedPassword("");
        }
    };

    const handleImageChange = (event: any) => {
        const file = event.target.files[0];
        if (file) {
            setInputtedProfilePhoto(file);
            setPhotoInputted(true);
        }
    };

    const validateEmailInput = () => {
        // Note: I did not come out with this expression
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regex.test(inputtedEmail) && inputtedEmail.length !== 0) {
            setEmailError(true);
        } else {
            setEmailError(false);
        }
    };

    const validatePasswordInput = () => {
        if (inputtedPassword.length > 0 && inputtedPassword.length < 6) {
            setPasswordError(true);
        } else {
            setPasswordError(false);
        }
    };

    const handlePasswordVisibility = () => {
        setPasswordVisibility(!passwordVisibility);
    };

    const handleSnackbarClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === "clickaway") {
            return;
        }
        setSnackbarSuccessOpen(false);
        setSnackbarFailOpen(false);
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
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            minHeight: "70vh",
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                maxWidth: 500,
                                padding: 3,
                                minWidth: 100,
                            }}
                        >
                            <Typography
                                variant="h3"
                                color={grey[200]}
                                sx={{
                                    paddingTop: 3,
                                    paddingBottom: 4,
                                    marginRight: 2,
                                }}
                            >
                                Edit Profile
                            </Typography>
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
                                        marginLeft: 27,
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
                                        marginLeft: 27,
                                    }}
                                />
                            )}

                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    maxWidth: 500,
                                    padding: 3,
                                    minWidth: 100,
                                }}
                            >
                                <TextField
                                    id="email"
                                    label="Email"
                                    variant="outlined"
                                    onBlur={() => {
                                        validateEmailInput();
                                    }}
                                    value={inputtedEmail}
                                    onChange={(event) => {
                                        setInputtedEmail(event.target.value);
                                    }}
                                    sx={{ marginBottom: 2 }}
                                    error={emailError}
                                    helperText={
                                        emailError ? "Must contain an @ and a top-level domain" : ""
                                    }
                                />
                                <TextField
                                    id="password"
                                    label="Password"
                                    type={passwordVisibility ? "password" : ""}
                                    variant="outlined"
                                    value={inputtedPassword}
                                    onBlur={() => {
                                        validatePasswordInput();
                                    }}
                                    error={passwordError}
                                    onChange={(event) => {
                                        setInputtedPassword(event.target.value);
                                    }}
                                    sx={{ marginBottom: 2 }}
                                    helperText={
                                        passwordError ? "Must be at least 6 characters long" : ""
                                    }
                                />

                                <TextField
                                    id="password"
                                    label="Password"
                                    variant="outlined"
                                    value={inputtedPassword}
                                    onBlur={() => {
                                        validatePasswordInput();
                                    }}
                                    error={passwordError}
                                    onChange={(event) => {
                                        setInputtedPassword(event.target.value);
                                    }}
                                    sx={{ marginBottom: 2 }}
                                    helperText={
                                        passwordError ? "Must be at least 6 characters long" : ""
                                    }
                                />

                                <TextField
                                    id="firstname"
                                    label="First name"
                                    variant="outlined"
                                    value={inputtedFirstName}
                                    onChange={(event) => {
                                        setInputtedFirstName(event.target.value);
                                    }}
                                    sx={{ marginBottom: 2 }}
                                />
                                <TextField
                                    id="lastname"
                                    label="Last name"
                                    variant="outlined"
                                    value={inputtedLastName}
                                    onChange={(event) => {
                                        setInputtedLastName(event.target.value);
                                    }}
                                    sx={{ marginBottom: 2 }}
                                />
                                <input
                                    accept="image/*"
                                    className="imageInput"
                                    style={{ display: "none" }}
                                    id="raised-button-file"
                                    type="file"
                                    onChange={handleImageChange}
                                />

                                {/* ToDo: Finish the photo implementation */}
                                <label htmlFor="raised-button-file">
                                    <Button
                                        component="span"
                                        className="imageInput"
                                        sx={{ marginBottom: 2 }}
                                    >
                                        {!photoInputted
                                            ? "Upload profile image"
                                            : "Change uploaded image"}
                                    </Button>
                                </label>
                                {photoInputted && (
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: green[400],
                                            marginTop: 0,
                                            paddingBottom: 2,
                                        }}
                                    >
                                        Image uploaded successfully!
                                    </Typography>
                                )}
                                <Button variant="outlined" color="success" onClick={handleSubmit}>
                                    Confirm
                                </Button>
                                <Button
                                    component={Link}
                                    to={"/user/profile/" + id}
                                    variant="outlined"
                                    color="error"
                                    sx={{ marginTop: 1 }}
                                >
                                    Cancel
                                </Button>
                                <input
                                    accept="image/*"
                                    className={"imageInput"}
                                    style={{ display: "none" }}
                                    id="raised-button-file"
                                    multiple
                                    type="file"
                                />
                            </Box>
                            <Snackbar
                                open={snackbarSuccessOpen}
                                autoHideDuration={6000}
                                onClose={handleSnackbarClose}
                                anchorOrigin={{
                                    vertical: "top",
                                    horizontal: "center",
                                }}
                            >
                                <Alert
                                    onClose={handleSnackbarClose}
                                    severity="success"
                                    sx={{ width: "100%" }}
                                >
                                    {"Account Created"}
                                </Alert>
                            </Snackbar>
                            <Snackbar
                                open={snackbarFailOpen}
                                autoHideDuration={6000}
                                onClose={handleSnackbarClose}
                                anchorOrigin={{
                                    vertical: "top",
                                    horizontal: "center",
                                }}
                            >
                                <Alert
                                    onClose={handleSnackbarClose}
                                    severity="error"
                                    sx={{ width: "100%" }}
                                >
                                    {errorMessage}
                                </Alert>
                            </Snackbar>
                        </Box>
                    </Box>
                </Grow>
            </Box>
        </>
    );
};

export default EditProfile;
