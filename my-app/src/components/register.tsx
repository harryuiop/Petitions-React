import { Alert, Box, Button, InputAdornment, Snackbar, TextField, Typography } from "@mui/material";
import { green, grey } from "@mui/material/colors";
import { Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { API_BASE_URL } from "../config";
import axios from "axios";
import { useUserAuthDetailsContext } from "../utils/userAuthContext";
import IconButton from "@mui/material/IconButton";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

const Register = () => {
    const navigate = useNavigate();
    const [snackbarSuccessOpen, setSnackbarSuccessOpen] = useState(false);
    const [snackbarFailOpen, setSnackbarFailOpen] = useState(false);

    const [inputtedProfilePhoto, setInputtedProfilePhoto] = useState("");
    const [inputtedEmail, setInputtedEmail] = useState("");
    const [inputtedPassword, setInputtedPassword] = useState("");
    const [inputtedFirstName, setInputtedFirstName] = useState("");
    const [inputtedLastName, setInputtedLastName] = useState("");

    const [photoInputted, setPhotoInputted] = useState(false);
    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [passwordVisibility, setPasswordVisibility] = useState(true);

    const userAuth = useUserAuthDetailsContext();

    if (userAuth.loggedIn) {
        navigate("/");
    }

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

    const handleSubmit = async () => {
        try {
            const response = await axios.post(
                API_BASE_URL + "/users/register",
                {
                    firstName: inputtedFirstName,
                    lastName: inputtedLastName,
                    email: inputtedEmail,
                    password: inputtedPassword,
                },
                { responseType: "json" },
            );

            // ToDo: Make the user auto sign in and go to home page
            setInputtedLastName("");
            setInputtedFirstName("");
            setInputtedEmail("");
            setInputtedPassword("");
            setSnackbarSuccessOpen(true);
            localStorage.setItem("isLoggedIn", "true");
            navigate("/SignIn");
        } catch (error: any) {
            if (error.response.status === 400) {
                setErrorMessage("Invalid information");
                setSnackbarFailOpen(true);
            } else if (error.response.status === 403) {
                setErrorMessage("Email already in use");
                setEmailError(true);
                setSnackbarFailOpen(true);
            } else {
                setErrorMessage("Internal Server Error");
                setSnackbarFailOpen(true);
            }
            setInputtedLastName("");
            setInputtedFirstName("");
            setInputtedEmail("");
            setInputtedPassword("");
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
                    sx={{ paddingTop: 3, paddingBottom: 4, marginRight: 2 }}
                >
                    Register
                </Typography>
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
                    helperText={emailError ? "Must contain an @ and a top-level domain" : ""}
                />
                <TextField
                    id="password"
                    label="Password"
                    type={passwordVisibility ? "password" : ""}
                    variant="outlined"
                    value={inputtedPassword}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    onClick={handlePasswordVisibility}
                                    sx={{ marginLeft: 2 }}
                                >
                                    {passwordVisibility ? (
                                        <RemoveRedEyeIcon />
                                    ) : (
                                        <VisibilityOffIcon />
                                    )}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                    onBlur={() => {
                        validatePasswordInput();
                    }}
                    error={passwordError}
                    onChange={(event) => {
                        setInputtedPassword(event.target.value);
                    }}
                    sx={{ marginBottom: 2 }}
                    helperText={passwordError ? "Must be at least 6 characters long" : ""}
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
                    <Button component="span" className="imageInput" sx={{ marginBottom: 2 }}>
                        {!photoInputted ? "Upload profile image" : "Change uploaded image"}
                    </Button>
                </label>
                {photoInputted && (
                    <Typography
                        variant="body2"
                        sx={{ color: green[400], marginTop: 0, paddingBottom: 2 }}
                    >
                        Image uploaded successfully!
                    </Typography>
                )}
                <Button variant="outlined" color="success" onClick={handleSubmit}>
                    Confirm
                </Button>
                <Typography variant="body1" sx={{ marginTop: 2 }}>
                    <Link to={"/"} style={{ color: grey[200], textDecoration: "underline" }}>
                        Don't want to register? Return Home
                    </Link>
                </Typography>
                <Typography variant="body1" sx={{ marginTop: 2 }}>
                    <Link to={"/signin"} style={{ color: grey[200], textDecoration: "underline" }}>
                        Have an account? Return to sign in
                    </Link>
                </Typography>
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
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
                <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: "100%" }}>
                    {"Account Created"}
                </Alert>
            </Snackbar>
            <Snackbar
                open={snackbarFailOpen}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
                <Alert onClose={handleSnackbarClose} severity="error" sx={{ width: "100%" }}>
                    {errorMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default Register;
