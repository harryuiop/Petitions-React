import { Paper, Table, TableBody, TableCell, TableContainer, TableFooter, TableRow, TablePagination } from "@mui/material";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config";
import { PetitionFromGetAll } from "petition";
import PetitionCard from "./PetitionCard";
import SkeletonCard from './SkeletonCard';

const PetitionTable = ( { searchInput }: { searchInput: String } ) => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [allPetitions, setAllPetitions] = useState<PetitionFromGetAll[]>([]);
    const [errorFlag, setErrorFlag] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(true); // Add this line

    useEffect(() => {
        const fetchAllPetitions = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get(API_BASE_URL + '/petitions');
                setAllPetitions(response.data.petitions);
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
    }, [searchInput]);

    const handleChangePage = (event: any, newPage: React.SetStateAction<number>) => {
        setPage(newPage);
    }

    const handleChangeRowsPerPage = (event: { target: { value: string; }; }) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    }

    return (
        <Paper sx={{ minWidth: 700, maxWidth: 930 }}>
            <TableContainer>
                <Table aria-label="custom pagination table">
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell component="th" scope="row">
                                    <SkeletonCard />
                                </TableCell>
                            </TableRow>
                        ) : allPetitions.length > 0 ? (
                            (rowsPerPage > 0
                                    ? allPetitions
                                        .filter((petition) =>
                                            petition.title
                                                .toLowerCase()
                                                .includes(searchInput.toLowerCase())
                                        )
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    : allPetitions.filter((petition) =>
                                        petition.title
                                            .toLowerCase()
                                            .includes(searchInput.toLowerCase())
                                    )
                            ).map((currentPetition) => (
                                <TableRow key={currentPetition.title}>
                                    <TableCell component="th" scope="row">
                                        <PetitionCard
                                            key={currentPetition.petitionId}
                                            petitionId={currentPetition.petitionId}
                                        />
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
                count={allPetitions.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                sx={{
                    marginTop: 2,
                    display: "flex",
                    justifyContent: "flex-start",
                }}
            />
        </Paper>
    )
}

export default PetitionTable;
