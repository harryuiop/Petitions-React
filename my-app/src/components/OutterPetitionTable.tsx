import * as React from 'react';
import Box from '@mui/material/Box';
import InnerPetitionTable from "./InnerPetitionTable";
import { Tab, Tabs } from "@mui/material";
import PhoneIcon from '@mui/icons-material/Phone';
import AllInclusiveIcon from '@mui/icons-material/AllInclusive';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import SchoolIcon from '@mui/icons-material/School';
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople';

const OutterPetitionTable = ({ searchInput }: { searchInput: String }) => {
    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Tabs value={value} onChange={handleChange} aria-label="icon label tabs example">
                <Tab icon={<AllInclusiveIcon />} label="ALL" />
                <Tab icon={<AccountBalanceIcon />} label="ECONOMICS" />
                <Tab icon={<SchoolIcon />} label="EDUCATION" />
                <Tab icon={<EmojiPeopleIcon />} label="DEVLEOPMENT" />

            </Tabs>
            <InnerPetitionTable searchInput={searchInput} category={value}/>
        </Box>
    );
}

export default OutterPetitionTable;
