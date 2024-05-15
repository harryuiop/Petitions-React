import {Box, Button, TextField, Typography} from "@mui/material";
import {green, grey} from "@mui/material/colors";
import {Link} from "react-router-dom";
import classes from "*.module.css";
import {useState} from "react";
import {API_BASE_URL} from "../config";
import axios from "axios";
import {useUserAuthDetailsContext} from "../utils/userAuthContext";

const Register = () => {
    const [inputtedProfilePhoto, setInputtedProfilePhoto] = useState("");
    const [inputtedEmail, setInputtedEmail] = useState("");
    const [inputtedPassword, setInputtedPassword] = useState("");
    const [inputtedFirstName, setInputtedFirstName] = useState("");
    const [inputtedLastName, setInputtedLastName] = useState("");

    const [photoInputted, setPhotoInputted] = useState(false);
    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [firstNameError, setFirstNameError] = useState(false);
    const [lastNameError, setLastNameError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const userAuth = useUserAuthDetailsContext();

    const handleImageChange = (event: any) => {
        const file = event.target.files[0];
        if (file) {
            setInputtedProfilePhoto(file);
        }
    };

    const handleSubmit = async () => {
        try {
             const response = await axios.post(API_BASE_URL + '/users/register', {
                firstName: inputtedFirstName,
                lastName: inputtedLastName,
                email: inputtedEmail,
                password: inputtedPassword
            }, { responseType: 'json' });

            console.log(response.data);
            setInputtedLastName("");
            setInputtedFirstName("");
            setInputtedEmail("");
            setInputtedPassword("");

        } catch (error: any) {
            if (error.message.includes('400 Bad Request')) {
                setErrorMessage('Invalid information');
            } else if (error.message.includes('403 Forbidden')) {
                setErrorMessage('Email already in use');
                setEmailError(true); // Set email error to true to highlight the field
            } else {
                setErrorMessage('Internal Server Error');
            }
        }
    };

    return (
        <Box sx={{display: "flex", justifyContent: "center", alignItems: "center", minHeight: "70vh"}}>
            <Box sx={{display: "flex", flexDirection: "column", maxWidth: 500, padding: 3, minWidth: 100}}>
                <Typography variant="h3" color={grey[200]} sx={{paddingTop: 3, paddingBottom: 4}}>
                    Register
                </Typography>
                <TextField id="email" label="Email" variant="outlined" value={inputtedEmail} onChange={(event) => {
                    setInputtedEmail(event.target.value)
                }} sx={{marginBottom: 2}}/>
                <TextField id="password" label="Password" variant="outlined" value={inputtedPassword}
                           onChange={(event) => {
                               setInputtedPassword(event.target.value)
                           }} sx={{marginBottom: 2}}/>
                <TextField id="firstname" label="First name" variant="outlined" value={inputtedFirstName}
                           onChange={(event) => {
                               setInputtedFirstName(event.target.value)
                           }} sx={{marginBottom: 2}}/>
                <TextField id="lastname" label="Last name" variant="outlined" value={inputtedLastName}
                           onChange={(event) => {
                               setInputtedLastName(event.target.value)
                           }} sx={{marginBottom: 2}}/>
                <input
                    accept="image/*"
                    className="imageInput"
                    style={{display: 'none'}}
                    id="raised-button-file"
                    type="file"
                    onChange={handleImageChange}
                />
                <label htmlFor="raised-button-file">
                    <Button component="span" className="imageInput">
                        Upload profile image
                    </Button>
                </label>
                {photoInputted && (
                    <Typography variant="body2" sx={{color: green[400], marginTop: 1, paddingBottom: 2}}>
                        Image uploaded successfully!
                    </Typography>
                )}
                <Button variant="outlined" color="success" onClick={handleSubmit}>
                    Confirm
                </Button>
                <Typography variant="body1" sx={{marginTop: 2}}>
                    <Link to={"/"} style={{color: grey[200], textDecoration: 'underline'}}>
                        Don't want to register? Return Home
                    </Link>
                </Typography>
                <Typography variant="body1" sx={{marginTop: 2}}>
                    <Link to={"/signin"} style={{color: grey[200], textDecoration: 'underline'}}>
                        Have an account? Return to sign in
                    </Link>
                </Typography>
                <input
                    accept="image/*"
                    className={"imageInput"}
                    style={{display: 'none'}}
                    id="raised-button-file"
                    multiple
                    type="file"
                />
            </Box>
        </Box>
    )
}

export default Register