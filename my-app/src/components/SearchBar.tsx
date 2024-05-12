import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import React, { useState } from "react";
import SearchIcon from '@mui/icons-material/Search';

const SearchBar = ({ callbackSearchInput, searchInput }: { callbackSearchInput: React.Dispatch<React.SetStateAction<string>>, searchInput: String }) => {

    const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        console.log('SearchInput changed in SearchBar:', inputValue);
        callbackSearchInput(inputValue);
    };

    return (
        <form>
            <TextField
                id="search-bar"
                className="text"
                label="Search for a petition"
                variant="outlined"
                placeholder="Search..."
                size="small"
                value={searchInput}
                onChange={handleSearchInputChange}
            />
            <IconButton type="submit" aria-label="search">
                <SearchIcon />
            </IconButton>
        </form>
    );
};

export default SearchBar;