import React, { useEffect, useState } from "react";
import { defaultUser } from "../utils/defaultStates";
import { User } from "user";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useUserAuthDetailsContext } from "../utils/userAuthContext";
import axios from "axios";
import { API_BASE_URL } from "../config";
import NavBar from "./NavBar";
import {
    Alert,
    Box,
    Button,
    Chip,
    Divider,
    Grow,
    Snackbar,
    TextField,
    Typography,
} from "@mui/material";
import { green, grey } from "@mui/material/colors";

const EditProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const userAuth = useUserAuthDetailsContext();
    const [userId, setUserId] = useState(-1);
    const [userInformation, setUserInformation] = useState<User>(defaultUser);
    const [errorFlag, setErrorFlag] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [checked, setChecked] = useState(false);
    const [snackbarSuccessOpen, setSnackbarSuccessOpen] = useState(false);
    const [snackbarFailOpen, setSnackbarFailOpen] = useState(false);

    const [inputtedUserProfilePhoto, setInputtedUserProfilePhoto] = useState<Blob>(new Blob());
    const [fetchedUserProfilePhoto, setFetchedUserProfilePhoto] = useState("");
    // const [fetchedUserProfilePhoto, setFetchedUserProfilePhoto] = useState<File | null>(null);
    const [hasInputtedPhoto, setHasInputtedPhoto] = useState(false);
    const [fileType, setFileType] = useState("");
    const [inputtedEmail, setInputtedEmail] = useState("");
    const [inputtedCurrentPassword, setInputtedCurrentPassword] = useState("");
    const [inputtedPassword, setInputtedPassword] = useState("");
    const [inputtedFirstName, setInputtedFirstName] = useState("");
    const [inputtedLastName, setInputtedLastName] = useState("");

    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [passwordVisibility, setPasswordVisibility] = useState(true);
    const [imageToRemove, setImageToRemove] = useState(false);

    if (
        userAuth.authUser.userId === -1 ||
        userAuth.authUser.userId !== parseInt(id as string, 10)
    ) {
        navigate("/");
    }

    useEffect(() => {
        setUserId(userAuth.authUser.userId);

        const fetchUserInformation = async () => {
            try {
                const response = await axios.get(API_BASE_URL + "/users/" + id, {
                    headers: {
                        "X-Authorization": userAuth.authUser.token,
                    },
                });
                setErrorFlag(false);
                setErrorMessage("");
                setUserInformation(response.data);
            } catch (error: any) {
                setErrorFlag(true);
                setErrorMessage(error.toString());
            }
        };

        const fetchUserProfileImage = async () => {
            try {
                const response = await axios.get(
                    API_BASE_URL + "/users/" + userAuth.authUser.userId + "/image",
                    {
                        headers: {
                            "X-Authorization": userAuth.authUser.token,
                        },
                        responseType: "blob",
                    },
                );
                const imageUrl = URL.createObjectURL(response.data);
                setFetchedUserProfilePhoto(imageUrl);
                setHasInputtedPhoto(true);
            } catch (error: any) {
                console.error(error.message);
                setErrorFlag(true);
                setErrorMessage(error.message);
            }
        };

        fetchUserInformation();
        fetchUserProfileImage();
        setChecked(true);
    }, []);

    const handleSubmit = async () => {
        try {
            if (inputtedPassword !== inputtedCurrentPassword) {
                throw new Error("Invalid information");
            }

            if (imageToRemove) {
                setImageToRemove(false);
                await removeImageFromServer();
            }

            // Found from https://stackoverflow.com/questions/11704267/in-javascript-how-to-conditionally-add-a-member-to-an-object
            const requestBody = {
                ...(inputtedFirstName !== "" && { firstName: inputtedFirstName }),
                ...(inputtedLastName !== "" && { lastName: inputtedLastName }),
                ...(inputtedEmail !== "" && { email: inputtedEmail }),
                ...(inputtedPassword !== "" && { password: inputtedPassword }),
                ...(inputtedCurrentPassword !== "" && { currentPassword: inputtedCurrentPassword }),
            };

            await axios.patch(API_BASE_URL + "/users/" + id, requestBody, {
                headers: {
                    "X-Authorization": userAuth.authUser.token,
                },
            });

            setInputtedLastName("");
            setInputtedFirstName("");
            setInputtedEmail("");
            setInputtedPassword("");
            setInputtedPassword("");
            setSnackbarSuccessOpen(true);
            localStorage.setItem("DetailsUpdated", "true");
            navigate("/user/profile/" + id);
        } catch (error: any) {
            if (error.response.status === 400) {
                setErrorMessage("Invalid information");
                setSnackbarFailOpen(true);
            } else if (error.response.status === 401) {
                setErrorMessage("Unauthorized or Invalid current password");
                setEmailError(true);
                setSnackbarFailOpen(true);
            } else if (error.response.status === 403) {
                setErrorMessage("Invalid information");
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
        if (!file) {
            return;
        }

        setFileType(file.type);

        const reader = new FileReader();
        reader.onload = async () => {
            try {
                const arrayBuffer = reader.result as ArrayBuffer;
                const uint8Array = new Uint8Array(arrayBuffer);

                await axios.put(
                    API_BASE_URL + "/users/" + userAuth.authUser.userId + "/image",
                    uint8Array,
                    {
                        headers: {
                            "X-Authorization": userAuth.authUser.token,
                            "Content-Type": file.type,
                        },
                    },
                );
                setHasInputtedPhoto(true);
                setFetchedUserProfilePhoto(file);
            } catch (error: any) {
                console.error(error.message);
                setErrorFlag(true);
                setErrorMessage(error.message);
            }
        };
        reader.readAsArrayBuffer(file);
    };

    const validateEmailInput = () => {
        // Note: I did not come out with this expression as it was found online
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regex.test(inputtedEmail) && inputtedEmail.length !== 0) {
            setEmailError(true);
        } else {
            setEmailError(false);
        }
    };

    const validatePasswordInput = () => {
        if (inputtedPassword.length > 0 && inputtedPassword !== inputtedCurrentPassword) {
            setPasswordError(true);
        } else {
            setPasswordError(false);
        }
    };

    const removeImageFromServer = async () => {
        try {
            await axios.delete(API_BASE_URL + "/users/" + id + "/image", {
                headers: {
                    "X-Authorization": userAuth.authUser.token,
                },
            });
        } catch (error: any) {
            // setInputtedProfilePhoto("");
            setHasInputtedPhoto(false);
            if (error.response.status === 401) {
                setErrorMessage("Unauthorized");
                setSnackbarFailOpen(true);
            } else if (error.response.status === 403) {
                setErrorMessage("Can not delete another user's profile photo");
            } else if (error.response.status === 404) {
                setErrorMessage("User Not found");
            } else {
                setErrorMessage(error.response.message);
                setSnackbarFailOpen(true);
            }
        }
    };

    const handleRemoveImage = async () => {
        setImageToRemove(true);
        setHasInputtedPhoto(false);
        // setInputtedProfilePhoto("");
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
                                minWidth: 330,
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
                            {hasInputtedPhoto ? (
                                <img
                                    src={fetchedUserProfilePhoto || "/defaultProfileImage.jpg"}
                                    height={275}
                                    width={275}
                                    alt="owner-photo"
                                    title="owner-photo"
                                    style={{
                                        borderRadius: "50%",
                                        objectFit: "cover",
                                        marginLeft: 27,
                                    }}
                                />
                            ) : (
                                <img
                                    src="/defaultProfileImage.jpg"
                                    height={275}
                                    width={275}
                                    alt="owner-photo"
                                    title="owner-photo"
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
                                <Divider sx={{ marginBottom: 2 }}>
                                    <Chip label="Change User Details" size="small" />
                                </Divider>
                                <TextField
                                    id="firstname"
                                    label="New First Name"
                                    variant="outlined"
                                    value={inputtedFirstName}
                                    onChange={(event) => {
                                        setInputtedFirstName(event.target.value);
                                    }}
                                    sx={{ marginBottom: 2 }}
                                />
                                <TextField
                                    id="lastname"
                                    label="New Last name"
                                    variant="outlined"
                                    value={inputtedLastName}
                                    onChange={(event) => {
                                        setInputtedLastName(event.target.value);
                                    }}
                                    sx={{ marginBottom: 2 }}
                                />
                                <TextField
                                    id="email"
                                    label="New Email"
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
                                <Divider sx={{ marginBottom: 2 }}>
                                    <Chip label="Change Password" size="small" />
                                </Divider>
                                <TextField
                                    id="password"
                                    label="Current Password"
                                    type={"password"}
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
                                    id="confirm-password"
                                    label="New Password"
                                    variant="outlined"
                                    type={"password"}
                                    value={inputtedCurrentPassword}
                                    onBlur={() => {
                                        validatePasswordInput();
                                    }}
                                    error={passwordError}
                                    onChange={(event) => {
                                        setInputtedCurrentPassword(event.target.value);
                                    }}
                                    sx={{ marginBottom: 2 }}
                                    helperText={
                                        passwordError ? "Must be at least 6 characters long" : ""
                                    }
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
                                <Button
                                    component="span"
                                    sx={{ marginBottom: 1 }}
                                    onClick={handleRemoveImage}
                                >
                                    Remove your profile image
                                </Button>
                                <label htmlFor="raised-button-file">
                                    <Button
                                        component="span"
                                        className="imageInput"
                                        sx={{ marginBottom: 2 }}
                                    >
                                        {!hasInputtedPhoto
                                            ? "Upload profile image"
                                            : "Change uploaded image"}
                                    </Button>
                                </label>
                                {hasInputtedPhoto && (
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
                                    Confirm Changes
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
