import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import {useState} from "react";
import SearchIcon from '@mui/icons-material/Search';
import axios from "axios";
import {API_BASE_URL} from "../config";
import {PetitionFromGetAll, PetitionFromGetOne} from "petition";
import HandshakeIcon from '@mui/icons-material/Handshake';
import {grey} from "@mui/material/colors";
import {Button} from "@mui/material";

const SearchBar = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [allPetition, setAllPetition] = useState<PetitionFromGetAll>();
    const [errorFlag, setErrorFlag] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [filterPetitions, setFilterPetitions] = useState([])
    // const dataFiltered = filterData(searchQuery, data);

    const getPetitionInformation = () => {
        axios.get(API_BASE_URL + '/petitions')
            .then((response) => {
                setErrorFlag(false);
                setErrorMessage("");
                setAllPetition(response.data);
                collectRelatedPetitions()
            }, (error) => {
                setErrorFlag(true);
                setErrorMessage(error.toString());
            });
    }

    const collectRelatedPetitions = () => {

    }

    // const filterData = (query, data) => {
    //     if (!query) {
    //         return data;
    //     } else {
    //         return data.filter((d: String) => d.toLowerCase().includes(query));
    //     }
    // };

    return (
        <form>
            <TextField
                id="search-bar"
                className="text"
                // onInput={(e) => {
                //     setSearchQuery(e.target.value);
                // }}
                label="Search for a petition"
                variant="outlined"
                placeholder="Search..."
                size="small"
            />
            <IconButton type="submit" aria-label="search">
                <SearchIcon />
            </IconButton>
        </form>
    )
}

export default SearchBar