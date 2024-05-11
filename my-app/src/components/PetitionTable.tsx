import {Paper, Table, TableBody, TableCell, TableContainer, TableRow} from "@mui/material";
import React, {useEffect, useState} from "react";
import axios from "axios";
import {API_BASE_URL} from "../config";
import {PetitionFromGetAll} from "petition";

const PetitionTable = () => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [allPetitions, setAllPetitions] = useState<PetitionFromGetAll[]>([]);
    const [errorFlag, setErrorFlag] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const fetchAllPetitions = () => {
            axios.get(API_BASE_URL + '/petitions')
                .then((response) => {
                    setErrorFlag(false);
                    setErrorMessage("");
                    setAllPetitions(response.data);
                }, (error) => {
                    setErrorFlag(true);
                    setErrorMessage(error.toString());
                });
        }
        fetchAllPetitions()
    }, []);

    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
                <TableBody>
                    {allPetitions.length > 0 ? (
                        allPetitions.map((currentPetition) => (
                            <TableRow key={currentPetition.title}>
                                <TableCell component="th" scope="row">
                                    {currentPetition.title}
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell>No petitions available</TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

export default PetitionTable
