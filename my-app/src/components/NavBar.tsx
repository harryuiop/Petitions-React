import {AppBar, Toolbar, Typography, Stack, Button} from "@mui/material";
import {Link, useNavigate} from 'react-router-dom';
import {blue, grey} from "@mui/material/colors";
import React, { useState } from "react";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import TextField from "@mui/material/TextField";
import SearchBar from "./SearchBar";
import HandshakeIcon from "@mui/icons-material/Handshake";

const NavBar = ( { callbackSearchInput, searchInput, includeSearchBar } : { callbackSearchInput : React.Dispatch<React.SetStateAction<string>>, searchInput: string, includeSearchBar: boolean }) => {

    return (
        <AppBar>
            <Toolbar sx={{ marginLeft: 10, marginRight: 10, display: 'flex', justifyContent: 'space-between'}}>
                <Stack direction="row" spacing={2} alignItems="center">
                    <IconButton component={Link} to="/" size="large" edge='start' sx={{ color: blue[300] }}>
                        <HandshakeIcon/>
                    </IconButton>
                    <Typography variant="h6" color={grey[200]} component="div">
                        PetitionPoint
                    </Typography>
                </Stack>
                {includeSearchBar ? <SearchBar callbackSearchInput={callbackSearchInput} searchInput={searchInput}/> : <></>}
                <Stack direction="row" spacing={2}>
                    <Button component={Link} to="/signin"> Sign in </Button>
                    <Button component={Link} to="/register"> Profile </Button>
                </Stack>
            </Toolbar>
        </AppBar>

    )
}

export default NavBar