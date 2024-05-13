import * as React from 'react';
import Box from '@mui/material/Box';
import InnerPetitionTable from "./InnerPetitionTable";
import { Tab, Tabs } from "@mui/material";
import PhoneIcon from '@mui/icons-material/Phone';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PersonPinIcon from '@mui/icons-material/PersonPin';

const OutterPetitionTable = ({ searchInput }: { searchInput: String }) => {
    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        console.log(newValue);
        setValue(newValue);
    };

    return (
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Tabs value={value} onChange={handleChange} aria-label="icon label tabs example">
                <Tab icon={<PhoneIcon />} label="RECENTS" />
                <Tab icon={<FavoriteIcon />} label="FAVORITES" />
                <Tab icon={<PersonPinIcon />} label="NEARBY" />
            </Tabs>
            <InnerPetitionTable searchInput={searchInput} category={value}/>
        </Box>
    );
}

export default OutterPetitionTable;
