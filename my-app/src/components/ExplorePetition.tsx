import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {PetitionFromGetOne} from "petition";
import {defaultPetitionFromGetOne} from "../utils/defaultStates";
import axios from "axios";
import {API_BASE_URL} from "../config";
import NavBar from "./NavBar";
import {Box, Typography} from "@mui/material";
import {grey} from "@mui/material/colors";
import OutterPetitionTable from "./OutterPetitionTable";

const ExplorePetition = () => {
    const {id} = useParams();
    const [petition, setPetition] = useState<PetitionFromGetOne>(defaultPetitionFromGetOne);
    const [errorFlag, setErrorFlag] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const getPetitionInformation = async () => {
            await axios.get(API_BASE_URL + '/petitions/' + id)
                .then((response) => {
                    setErrorFlag(false);
                    setErrorMessage("");
                    setPetition(response.data);
                }, (error) => {
                    setErrorFlag(true);
                    setErrorMessage(error.toString());
                });
        }
        getPetitionInformation()
    }, [id]);

    return(
        <>
            <NavBar callbackSearchInput={()=>{}} searchInput={""} includeSearchBar={false}/>
            <Box mt={10} >

            </Box>
        </>
    )
}

export default ExplorePetition