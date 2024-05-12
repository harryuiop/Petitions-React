import {Box, Button, TextField, Typography} from "@mui/material";
import {grey} from "@mui/material/colors";
import {Link} from "react-router-dom";

const Register = () => {

    return (
        <Box sx={{display: "flex", justifyContent: "center", alignItems: "center", minHeight: "70vh"}}>
            <Box sx={{ display: "flex", flexDirection: "column", maxWidth: 500, padding: 3, minWidth: 100 }}>
                <Typography variant="h3" color={grey[200]} sx={{ paddingTop: 3, paddingBottom: 4 }}>
                    Register
                </Typography>
                <TextField id="email" label="Email" variant="outlined" sx={{ marginBottom: 2 }} />
                <TextField id="password" label="Password" variant="outlined" sx={{ marginBottom: 2 }} />
                <TextField id="firstname" label="First name" variant="outlined" sx={{ marginBottom: 2 }} />
                <TextField id="lastname" label="Last name" variant="outlined" sx={{ marginBottom: 2 }} />
                <Button variant="outlined" color="success">
                    Confirm
                </Button>
                <Typography variant="body1" sx={{ marginTop: 2 }}>
                    <Link to={"/"} style={{ color: grey[200], textDecoration: 'underline' }}>
                        Don't want to register? Return Home
                    </Link>
                </Typography>
                <Typography variant="body1" sx={{ marginTop: 2 }}>
                    <Link to={"/signin"} style={{ color: grey[200], textDecoration: 'underline' }}>
                        Have an account? Return to sign in
                    </Link>
                </Typography>
            </Box>
        </Box>
    )
}

export default Register