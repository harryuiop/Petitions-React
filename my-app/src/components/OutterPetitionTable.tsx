import * as React from 'react';
import Box from '@mui/material/Box';
import InnerPetitionTable from "./InnerPetitionTable";
import { FormControl, InputAdornment, InputLabel, MenuItem, Select, Button } from "@mui/material";
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import TextField from "@mui/material/TextField";
import { styled } from '@mui/system';

const options = [
    { value: 'Option 1' },
    { value: 'Option 2' },
    { value: 'Option 3' },
    { value: 'Option 4' },
    { value: 'Option 5' }
    // Add more options as needed
];

const StyledSelect = styled(Select)(({ theme }) => ({
    '& .MuiSelect-select': {
        paddingRight: '1rem', // Add padding to the right of the select
    },
}));

const OutterPetitionTable = ({ searchInput }: { searchInput: String }) => {
    const [selectedOptions, setSelectedOptions] = React.useState([]);
    const [maxSupporterCost, setMaxSupporterCost] = React.useState('');

    const handleChange = (event: any) => {
        const value = event.target.value;
        setSelectedOptions(value);
    };

    const handleReset = () => {
        setSelectedOptions([]);
        setMaxSupporterCost('');
    };

    return (
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", paddingBottom: 4 }}>
            <Box sx={{ minWidth: 200, display: 'flex', gap: 2, marginBottom: 2, alignItems: 'center', maxWidth: 500 }}>
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
                    sx={{ flexGrow: 1 }}
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
                        {options.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.value}
                            </MenuItem>
                        ))}
                    </StyledSelect>
                </FormControl>

                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleReset}
                    >
                        Reset
                    </Button>
                </Box>
            </Box>
            <Box sx={{ width: '100%' }}>
                <InnerPetitionTable searchInput={searchInput} category={0} />
            </Box>
        </Box>
    );
}

export default OutterPetitionTable;