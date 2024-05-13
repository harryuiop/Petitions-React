import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    TablePagination,
} from "@mui/material";
import React, {useEffect, useState, useMemo} from "react";
import axios from "axios";
import { API_BASE_URL } from "../config";
import {PetitionFromGetAll, PetitionFromGetOne} from "petition";
import PetitionCard from "./PetitionCard";
import SkeletonCard from './SkeletonCard';

const InnerPetitionTable = ({ searchInput, category }: { searchInput: String, category: number } ) => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [allPetitionsFromGetAll, setAllPetitionsFromGetAll] = useState<PetitionFromGetAll[]>([]);
    const [allPetitionsFromGetOne, setAllPetitionsFromGetOne] = useState<PetitionFromGetOne[]>([]);
    const [filteredPetitions, setFilteredPetitions] = useState<PetitionFromGetAll[]>([]);
    const [errorFlag, setErrorFlag] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAllPetitions = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get(API_BASE_URL + '/petitions');
                setAllPetitionsFromGetAll(response.data.petitions);
                setErrorFlag(false);
                setErrorMessage("");
            } catch (error: any) {
                setErrorFlag(true);
                setErrorMessage(error.toString());
            } finally {
                setIsLoading(false);
            }
        };
        fetchAllPetitions();
    }, []);

    useEffect(() => {
        const fetchPetitionDetails = async (petitionIds: number[]) => {
            try {
                const promises = petitionIds.map(async (petitionId: number) => {
                    const response = await axios.get(API_BASE_URL + '/petitions/' + petitionId);
                    return response.data;
                });
                const petitionDetails = await Promise.all(promises);
                setAllPetitionsFromGetOne(petitionDetails);
            } catch (error: any) {
                setErrorFlag(true);
                setErrorMessage(error.toString());
            }
        };

        // Extracting petition ids from allPetitionsFromGetAll
        const petitionIds = allPetitionsFromGetAll.map(petition => petition.petitionId);

        // Fetch details for each petition
        fetchPetitionDetails(petitionIds);
    }, [allPetitionsFromGetAll]);


    const handleChangePage = (event: any, newPage: React.SetStateAction<number>) => {
        setPage(newPage);
    }

    const handleChangeRowsPerPage = (event: { target: { value: string; }; }) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    }

    return (
            <Paper sx={{minWidth: 700, maxWidth: 930}}>
            <TableContainer>
                <Table aria-label="custom pagination table">
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell component="th" scope="row">
                                    <SkeletonCard/>
                                </TableCell>
                            </TableRow>
                        ) : allPetitionsFromGetOne.length > 0 ? (
                            // ToDo: Be able to recognise descriptions
                            (rowsPerPage > 0
                                    ? allPetitionsFromGetOne
                                        .filter((petition) => petition.title
                                                .toLowerCase()
                                                .includes(searchInput.toLowerCase()) ||
                                                petition.description
                                                .toLowerCase()
                                                .includes(searchInput.toLowerCase())
                                        )
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    : allPetitionsFromGetOne.filter((petition) => petition.title
                                            .toLowerCase()
                                            .includes(searchInput.toLowerCase()) ||
                                            petition.description
                                            .toLowerCase()
                                            .includes(searchInput.toLowerCase())
                                    )
                            ).map((currentPetition) => (
                                <TableRow key={currentPetition.title}>
                                    <TableCell component="th" scope="row">
                                        <PetitionCard
                                            key={currentPetition.petitionId}
                                            petitionId={currentPetition.petitionId}/>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell>{'No petitions available'}</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={allPetitionsFromGetAll.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                sx={{
                    marginTop: 2,
                    display: "flex",
                    justifyContent: "flex-start",
                }}/>
        </Paper>
    )
}

export default InnerPetitionTable;
