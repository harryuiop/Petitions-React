import NavBar from "./NavBar";
import PetitionTable from "./PetitionTable";
import { Box, Typography } from "@mui/material";
import {grey} from "@mui/material/colors";

const Home = () => {
    return (
        <div>
            <NavBar />
            <Box mt={10}>
                <Typography variant="h4" color={grey[200]} align="center" sx={{ padding: 3 }}>
                    Featured Petitions
                </Typography>
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                    <PetitionTable />
                </Box>
            </Box>
        </div>
    );
};

export default Home;
