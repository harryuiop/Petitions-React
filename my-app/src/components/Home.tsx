import NavBar from "./NavBar";
import InnerPetitionTable from "./InnerPetitionTable";
import { Box, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
import { useEffect, useState } from "react";
import OutterPetitionTable from "./OutterPetitionTable";

const Home = () => {
    const [searchInput, setSearchInput] = useState("");

    return (
        <div>
            <NavBar callbackSearchInput={setSearchInput} searchInput={searchInput} />
            <Box mt={10} >
                <Typography variant="h4" color={grey[200]} align="center" sx={{ padding: 3 }}>
                    Find Petitions
                </Typography>
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <OutterPetitionTable searchInput={searchInput} />
                </Box>
            </Box>
        </div>
    )
};

export default Home;
