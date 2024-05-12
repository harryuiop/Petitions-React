import NavBar from "./NavBar";
import PetitionTable from "./PetitionTable";
import {Box} from "@mui/material";

const Home = () => {

    return (
        <div>
            <NavBar/>
            <Box mt={10} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <PetitionTable />
            </Box>
        </div>
    )
}

export default Home
