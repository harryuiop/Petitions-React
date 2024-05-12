import NavBar from "./NavBar";
import PetitionTable from "./PetitionTable";
import { Box, Typography } from "@mui/material";
import {grey} from "@mui/material/colors";
import {useEffect, useState} from "react";

const Home = () => {
    const [searchInput, setSearchInput] = useState("");

    useEffect(() => {
        console.log('searchInput updated in home:', searchInput); // Add this line
    }, [searchInput]);

    return (
        <div>
            <NavBar callbackSearchInput={setSearchInput} searchInput={searchInput}/>
            <Box mt={10}>
                <Typography variant="h4" color={grey[200]} align="center" sx={{ padding: 3 }}>
                    Featured Petitions
                </Typography>
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                    <PetitionTable searchInput={searchInput} />
                </Box>
            </Box>
        </div>
    )
};

export default Home;
