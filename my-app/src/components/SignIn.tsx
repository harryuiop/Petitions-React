import { Box, Button, TextField, Typography } from "@mui/material";
import {Link} from "react-router-dom";
import {grey} from "@mui/material/colors";

const SignIn = () => {
    return (
        <Box sx={{display: "flex", justifyContent: "center", alignItems: "center", minHeight: "70vh"}}>
            <Box sx={{ display: "flex", flexDirection: "column", maxWidth: 500, marginTop: 8, minWidth: 100 }}>
                <Typography variant="h3" color={grey[200]} sx={{ marginBottom: 5 }}>
                    Sign in
                </Typography>
                <TextField id="email" label="Email" variant="outlined" sx={{ marginBottom: 2 }} />
                <TextField id="password" label="Password" variant="outlined" />
                <Button variant="outlined" color="success" sx={{ marginTop: 2 }}>
                    Confirm
                </Button>
                <Typography variant="body1" sx={{ marginTop: 2 }}>
                    <Link to={"/"} style={{ color: grey[200], textDecoration: 'underline' }}>
                        Don't want to sign in? Return Home
                    </Link>
                </Typography>
                <Typography variant="body1" sx={{ marginTop: 2 }}>
                    <Link to={"/register"} style={{ color: grey[200], textDecoration: 'underline' }}>
                        Don't have an account? Sign up
                    </Link>
                </Typography>
            </Box>
        </Box>
    );
};

export default SignIn;
