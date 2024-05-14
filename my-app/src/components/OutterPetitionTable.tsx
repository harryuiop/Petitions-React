import * as React from 'react';
import Box from '@mui/material/Box';
import InnerPetitionTable from "./InnerPetitionTable";
import {
    FormControl,
    InputAdornment,
    InputLabel,
    MenuItem,
    Select,
    Button,
    TextField
} from "@mui/material";
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { useState } from "react";
import { styled } from '@mui/system';
import {defaultPetitionFromGetOne} from "../utils/defaultStates";

const categoryOptions = [
    { value: "Wildlife" },
    { value: "Environmental Causes" },
    { value: "Animal Rights" },
    { value: "Health and Wellness" },
    { value: "Education" },
    { value: "Human Rights" },
    { value: "Arts and Culture" },
    { value: "Technology and Innovation" },
    { value: "Community Development" },
    { value: "Economic Empowerment" },
    { value: "Science and Research" },
    { value: "Sports and Recreation" }
];

const sortByCategorys: { searchQuery: string, code: string; desc: string }[] = [
    { searchQuery: "ALPHABETICAL_ASC", code: "A to Z", desc: "Alphabetically by title, A-Z" },
    { searchQuery: "ALPHABETICAL_DESC", code: "Z to A", desc: "Alphabetically by title, Z-A" },
    { searchQuery: "COST_ASC", code: "Cost High->Low", desc: "By cost of cheapest support tier ascending" },
    { searchQuery: "COST_DESC", code: "Cost Low->High", desc: "By cost of cheapest support tier descending" },
    { searchQuery: "CREATED_ASC", code: "Created Old->New", desc: "Chronologically in order of creation date oldest-newest" },
    { searchQuery: "CREATED_DESC", code: "Created New->Old", desc: "Chronologically in order of creation date newest-oldest" }
];

const StyledSelect = styled(Select)(({ theme }) => ({
    '& .MuiSelect-select': {
        paddingRight: '1rem',
    },
}));

const OutterPetitionTable = ({ searchInput }: { searchInput: string }) => {
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [maxSupporterCost, setMaxSupporterCost] = useState('');
    const [sortBy, setSortBy] = useState<string>('');

    const handleChange = (event: any) => {
        const value = event.target.value;
        setSelectedOptions(value);
    };

    const handleReset = () => {
        setSelectedOptions([]);
        setMaxSupporterCost('');
        setSortBy('');
    };

    const handleChangeSortBy = (event: any) => {
        const value = event.target.value as string;
        const selectedOption = sortByCategorys.find(option => option.code === value);
        if (selectedOption) {
            setSortBy(selectedOption.searchQuery);
        }
    };

    return (
        <Box sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            paddingBottom: 4
        }}>
            <Box sx={{
                minWidth: 200,
                display: 'flex',
                gap: 2,
                marginBottom: 2,
                alignItems: 'center',
                maxWidth: 680
            }}>
                <TextField
                    label="Max Support Cost"
                    variant="outlined"
                    value={maxSupporterCost}
                    onChange={(e) => setMaxSupporterCost(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <AttachMoneyIcon />
                            </InputAdornment>
                        ),
                    }}
                    sx={{ flexGrow: 1, minWidth: 130 }}
                />

                <FormControl fullWidth>
                    <InputLabel id="select-label">Select Categories</InputLabel>
                    <StyledSelect
                        labelId="select-label"
                        multiple
                        value={selectedOptions}
                        onChange={handleChange}
                        renderValue={(selected: any) => selected.join(', ')}
                        sx={{ minWidth: 200, maxWidth: 320 }}
                    >
                        {categoryOptions.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.value}
                            </MenuItem>
                        ))}
                    </StyledSelect>
                </FormControl>

                <FormControl fullWidth>
                    <InputLabel id="sortby-label">Sort By</InputLabel>
                    <StyledSelect
                        labelId="sortby-label"
                        value={sortBy}
                        onChange={(event) => handleChangeSortBy(event)}
                        renderValue={(selected: any) => selected}
                        sx={{ minWidth: 100, maxWidth: 300 }}
                    >

                    {sortByCategorys.map((option) => (
                            <MenuItem key={option.code} value={option.code}>
                                {option.desc}
                            </MenuItem>
                        ))}
                    </StyledSelect>
                </FormControl>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: 2 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleReset}
                        sx={{ textTransform: 'none', borderRadius: '20px', padding: '10px 20px', marginBottom: 2 }}
                    >
                        Reset
                    </Button>
                </Box>
            </Box>
            <Box sx={{ width: '100%' }}>
                <InnerPetitionTable
                    searchInput={searchInput}
                    selectedOptions={selectedOptions}
                    maxSupporterCost={maxSupporterCost}
                    sortBy={sortBy}
                    givenPetition={defaultPetitionFromGetOne}
                />
            </Box>
        </Box>
    );
}

export default OutterPetitionTable;
