import {AppBar, Toolbar, IconButton, Typography, Stack, Button, styled, ButtonProps} from "@mui/material";
import {Link, useNavigate} from 'react-router-dom';
import AirlineStopsIcon from '@mui/icons-material/AirlineStops';
import {grey} from "@mui/material/colors";

const NavBar = () => {
    return (
        <AppBar sx={{backgroundColor: grey[100]}}>
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between'}}>
                <Typography variant="h6" color="#1e78d2" component="div">
                    PetitionPoint
                </Typography>
                <Stack direction="row" spacing={2}>
                    <Button> Login </Button>
                    <Button> Browser </Button>
                    <Button> Profile </Button>
                </Stack>
            </Toolbar>
        </AppBar>

    )
}

export default NavBar