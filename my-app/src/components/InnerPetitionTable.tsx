import {
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TablePagination,
    TableRow,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config";
import { PetitionFromGetAll, PetitionFromGetOne } from "petition";
import PetitionCard from "./PetitionCard";
import { defaultPetitionFromGetOne, petitionCategory } from "../utils/defaultStates";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import LastPageIcon from "@mui/icons-material/LastPage";
import IconButton from "@mui/material/IconButton";

const InnerPetitionTable = ({
    searchInput,
    selectedOptions,
    maxSupporterCost,
    sortBy,
    givenPetition,
}: {
    searchInput: string;
    selectedOptions: string[];
    maxSupporterCost: string;
    sortBy: string;
    givenPetition: PetitionFromGetOne;
}) => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [allPetitionsFromGetAll, setAllPetitionsFromGetAll] = useState<PetitionFromGetAll[]>([]);
    const [allPetitionsFromGetOne, setAllPetitionsFromGetOne] = useState<PetitionFromGetOne[]>([]);
    const [allFilteredPetitions, setAllFilteredPetitions] = useState<PetitionFromGetOne[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorFlag, setErrorFlag] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const fetchAllPetitions = async () => {
            try {
                setIsLoading(true);
                if (sortBy !== "") {
                    const response = await axios.get(API_BASE_URL + "/petitions/?sortBy=" + sortBy);
                    setAllPetitionsFromGetAll(response.data.petitions);
                } else {
                    const response = await axios.get(
                        API_BASE_URL + "/petitions/?sortBy=CREATED_ASC",
                    );
                    setAllPetitionsFromGetAll(response.data.petitions);
                }
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
    }, [sortBy]);

    useEffect(() => {
        const fetchPetitionDetails = async (petitionIds: number[]) => {
            try {
                const promises = petitionIds.map(async (petitionId: number) => {
                    const response = await axios.get(API_BASE_URL + "/petitions/" + petitionId);
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
        const petitionIds = allPetitionsFromGetAll.map((petition) => petition.petitionId);

        // Fetch details for each petition
        fetchPetitionDetails(petitionIds);
    }, [allPetitionsFromGetAll]);

    useEffect(() => {
        const filteredPetitions = allPetitionsFromGetOne.filter((petition) => {
            const categoryString = petitionCategory[petition.categoryId];

            if (givenPetition !== defaultPetitionFromGetOne) {
                if (petition.petitionId === givenPetition.petitionId) {
                    return false;
                }
            }

            if (givenPetition.ownerId === petition.ownerId) {
                return true;
            }

            if (maxSupporterCost !== "") {
                if (
                    Math.min(...petition.supportTiers.map((obj) => obj.cost)) >
                    parseInt(maxSupporterCost, 10)
                ) {
                    return false;
                }
            }

            if (selectedOptions.includes(categoryString)) {
                return (
                    petition.title.toLowerCase().includes(searchInput.toLowerCase()) ||
                    petition.description.toLowerCase().includes(searchInput.toLowerCase())
                );
            } else if (selectedOptions.length === 0) {
                return (
                    petition.title.toLowerCase().includes(searchInput.toLowerCase()) ||
                    petition.description.toLowerCase().includes(searchInput.toLowerCase())
                );
            } else if (selectedOptions.length === 0) {
                return true;
            }
        });

        setAllFilteredPetitions(filteredPetitions);
    }, [searchInput, selectedOptions, maxSupporterCost, allPetitionsFromGetOne, givenPetition]);

    const handleChangePage = (event: any, newPage: React.SetStateAction<number>) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: { target: { value: string } }) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleFirstPageButtonClick = (event: any) => {
        handleChangePage(event, 0);
    };

    const handleBackButtonClick = (event: any) => {
        handleChangePage(event, page - 1);
    };

    const handleNextButtonClick = (event: any) => {
        handleChangePage(event, page + 1);
    };

    const handleLastPageButtonClick = (event: any) => {
        handleChangePage(
            event,
            Math.max(0, Math.ceil(allFilteredPetitions.length / rowsPerPage) - 1),
        );
    };

    return (
        <Paper sx={{ minWidth: 718, maxWidth: 930 }}>
            <TableContainer>
                <Table aria-label="custom pagination table">
                    <TableBody>
                        {isLoading ? (
                            <></>
                        ) : allPetitionsFromGetOne.length > 0 ? (
                            (rowsPerPage > 0
                                ? allFilteredPetitions.slice(
                                      page * rowsPerPage,
                                      page * rowsPerPage + rowsPerPage,
                                  )
                                : allFilteredPetitions
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
                                <TableCell>{"No petitions available"}</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[10, 25]}
                component="div"
                count={allFilteredPetitions.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                sx={{
                    marginTop: 2,
                    display: "flex",
                    justifyContent: "flex-start",
                }}
                ActionsComponent={() => (
                    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
                        <IconButton
                            onClick={handleFirstPageButtonClick}
                            disabled={page === 0}
                            aria-label="first page"
                        >
                            <FirstPageIcon />
                        </IconButton>
                        <IconButton
                            onClick={handleBackButtonClick}
                            disabled={page === 0}
                            aria-label="previous page"
                        >
                            <KeyboardArrowLeft />
                        </IconButton>
                        <IconButton
                            onClick={handleNextButtonClick}
                            disabled={
                                page >= Math.ceil(allFilteredPetitions.length / rowsPerPage) - 1
                            }
                            aria-label="next page"
                        >
                            <KeyboardArrowRight />
                        </IconButton>
                        <IconButton
                            onClick={handleLastPageButtonClick}
                            disabled={
                                page >= Math.ceil(allFilteredPetitions.length / rowsPerPage) - 1
                            }
                            aria-label="last page"
                        >
                            <LastPageIcon />
                        </IconButton>
                    </Box>
                )}
            />
        </Paper>
    );
};

export default InnerPetitionTable;
