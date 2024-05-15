import {Box, Button, TextField, Typography} from "@mui/material";
import {Link} from "react-router-dom";
import {grey} from "@mui/material/colors";
import {AccountCircle} from "@mui/icons-material";
import LockIcon from '@mui/icons-material/Lock';
import {useUserAuthDetailsContext} from "../utils/userAuthContext";
import {useState} from "react";
import axios from "axios";
import {API_BASE_URL} from "../config";

const SignIn = () => {
    const [inputtedEmail, setInputtedEmail] = useState("");
    const [inputtedPassword, setInputtedPassword] = useState("");

    const handleSign = async () => {
        const response = await axios.post(API_BASE_URL + '/users/login', {
            email: inputtedEmail,
            password: inputtedPassword
        }, {responseType: 'json'});

        // const userAuth = useUserAuthDetailsContext();
    }

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
                    <TextField id="email" label="Email" variant="outlined" value={inputtedEmail} onChange={(event) => {
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
                    <TextField id="password" label="Password" variant="outlined" value={inputtedPassword}
                               onChange={(event) => {
                                   setInputtedPassword(event.target.value)
                               }} sx={{minWidth: 300}}/>
                </Box>
                <Button variant="outlined" color="success" sx={{marginLeft: 5, marginTop: 2, maxWidth: 300}}>
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
        </Box>
    );
};

export default SignIn;
