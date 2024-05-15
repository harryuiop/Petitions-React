import {Box, Button, TextField, Typography} from "@mui/material";
import {Link, useNavigate} from "react-router-dom";
import {grey} from "@mui/material/colors";
import {AccountCircle} from "@mui/icons-material";
import LockIcon from '@mui/icons-material/Lock';
import { Snackbar, Alert } from "@mui/material";
import {useUserAuthDetailsContext} from "../utils/userAuthContext";
import React, {useEffect, useState} from "react";
import {API_BASE_URL} from "../config";
import axios from "axios";

const SignIn = () => {
    const navigate = useNavigate();
    const userAuth = useUserAuthDetailsContext();
    const [inputtedEmail, setInputtedEmail] = useState("");
    const [inputtedPassword, setInputtedPassword] = useState("");
    const [receivedUserId, setReceiveUserId] = useState(-1);
    const [receivedToken, setReceivedToken] = useState("");
    const [invalidInformationError, setInvalidInformationError] = useState(false);
    const [UnauthorizedError, setUnauthorizedError] = useState(false);
    const [serverError, setServerError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [errorSnackbarOpen, setErrorSnackbarOpen] = useState(false);
    const [registerSnackbarOpen, setRegisterSnackbarOpen] = useState(false);


    if (userAuth.loggedIn) {
        navigate("/");
    }

    useEffect(() => {

        const isLoggedIn = localStorage.getItem("isLoggedIn");
        if (isLoggedIn === "true") {
            setRegisterSnackbarOpen(true);
            localStorage.removeItem("isLoggedIn");
        }
    }, []);

    const setLocalStorage = () => {
        localStorage.setItem('userId', userAuth.authUser.userId.toString());
        localStorage.setItem('token', userAuth.authUser.token);
        setInputtedEmail("");
        setInputtedPassword("");
    }

    const getLoginResponse = async () => {
        try {
            const response = await axios.post(API_BASE_URL + '/users/login', {
                email: inputtedEmail,
                password: inputtedPassword
            }, {responseType: 'json'});
            return response;
        } catch (error: any) {
            setErrorMessage(error.response.message);
            setInputtedEmail("");
            setInputtedPassword("");
            if (error.response.status === 400) {
                setInvalidInformationError(true);
                console.error('Server responded with error status:', error.response.status);
                setErrorSnackbarOpen(true);
                return null;
            } else if (error.response.status === 401) {
                setUnauthorizedError(true);
                console.error('Server responded with error status:', error.response.status);
                setErrorSnackbarOpen(true);
                return null;
            } else {
                setServerError(true);
                console.error('Error occurred while making the request:', error.message);
                setErrorSnackbarOpen(true);
                return null;
            }
        }
    }

    const handleSignIn = async () => {
        const response = await getLoginResponse();
        if (response !== null) {
            userAuth.handleLogin({userId: response.data.userId, token: response.data.token, loggedIn: true});
            setLocalStorage();
            localStorage.setItem("isLoggedIn", "true")
            navigate("/");
        }
    }

    const handleSnackbarClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setErrorSnackbarOpen(false);
        setRegisterSnackbarOpen(false);
    };

    return (
        <Box sx={{display: "flex", justifyContent: "center", alignItems: "center", minHeight: "70vh"}}>
            <Box sx={{display: "flex", flexDirection: "column", maxWidth: 500, marginTop: 8, minWidth: 100}}>
                <Typography variant="h3" color={grey[200]} sx={{marginBottom: 5, marginLeft: 3}}>
                    Sign in
                </Typography>
                <Box sx={{display: 'flex', alignItems: "center", marginBottom: 1}}>
                    <AccountCircle sx={{
                        bottomMargin: 2,
                        color: "white",
                        paddingLeft: 1,
                        marginRight: 1,
                        marginTop: 0.5,
                        paddingBottom: 1
                    }}/>
                    <TextField id="email" label="Email" variant="outlined" error={invalidInformationError} value={inputtedEmail} onChange={(event) => {
                        setInputtedEmail(event.target.value)
                    }} sx={{minWidth: 300}}/>
                </Box>
                <Box sx={{display: 'flex', alignItems: "center"}}>
                    <LockIcon sx={{
                        bottomMargin: 2,
                        color: "white",
                        marginLeft: 1,
                        marginRight: 1,
                        marginTop: 0.5,
                        marginBottom: 0.5
                    }}/>
                    <TextField id="password" label="Password" variant="outlined" error={invalidInformationError} value={inputtedPassword}
                               onChange={(event) => {
                                   setInputtedPassword(event.target.value)
                               }} sx={{minWidth: 300}}/>
                </Box>
                <Button variant="outlined" color="success" onClick={handleSignIn} sx={{marginLeft: 5, marginTop: 2, maxWidth: 300}}>
                    Confirm
                </Button>
                <Typography variant="body1" sx={{marginTop: 2, marginLeft: 6}}>
                    <Link to={"/"} style={{color: grey[200], textDecoration: 'underline'}}>
                        Don't want to sign in? Return Home
                    </Link>
                </Typography>
                <Typography variant="body1" sx={{marginTop: 2, marginLeft: 6}}>
                    <Link to={"/register"} style={{color: grey[200], textDecoration: 'underline'}}>
                        Don't have an account? Sign up
                    </Link>
                </Typography>
            </Box>
            <Snackbar
                open={errorSnackbarOpen}
                autoHideDuration={4000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={handleSnackbarClose} severity="error" sx={{ width: '100%' }}>
                    {UnauthorizedError ? "Incorrect username or password" : "Invalid user details"}
                </Alert>
            </Snackbar>
            <Snackbar
                open={registerSnackbarOpen}
                autoHideDuration={4000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
                    {"Account successfully registered"}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default SignIn
