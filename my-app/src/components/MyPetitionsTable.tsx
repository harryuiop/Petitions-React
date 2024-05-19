import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config";
import { useUserAuthDetailsContext } from "../utils/userAuthContext";
import { PetitionFromGetAll, PetitionFromGetOne } from "petition";
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TablePagination,
    TableRow,
    Typography,
} from "@mui/material";
import PetitionCard from "./PetitionCard";
import { SupporterDirectQuery } from "supporter";

const MyPetitionsTable = () => {
    const userAuth = useUserAuthDetailsContext();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [usersPetitions, setUsersPetitions] = useState<PetitionFromGetOne[]>([]);
    const [usersSupportedPetitions, setUsersSupportedPetitions] = useState<PetitionFromGetOne[]>(
        [],
    );
    const [errorFlag, setErrorFlag] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    const [test, setTest] = useState<number[]>([]);

    useEffect(() => {
        fetchData();
    }, []);

    console.log(test);

    const fetchData = async () => {
        await fetchAllUsersPetition();

        const allPetitions = await getAllPetitions();
        const allSupporters = await getAllSupporters(allPetitions.petitions);

        if (allSupporters) {
            const indexedSupporters = allSupporters.map((supporterArray, index) => ({
                supporterArray,
                index,
            }));

            const filteredSupporters = indexedSupporters.filter((indexedSupporters) =>
                indexedSupporters.supporterArray.some(
                    (supporter) => supporter.supporterId === userAuth.authUser.userId,
                ),
            );
            setTest(filteredSupporters.map((petition) => petition.index));
        }
    };

    const fetchAllUsersPetition = async () => {
        try {
            const result = await axios.get(
                API_BASE_URL + "/petitions?ownerId=" + userAuth.authUser.userId,
            );
            setUsersPetitions(result.data.petitions);

            const ownersPetitionIds = result.data.petitions.map(
                (petition: PetitionFromGetAll) => petition.petitionId,
            );
        } catch (error: any) {
            setErrorFlag(true);
            setErrorMessage(error.toString());
        } finally {
            setIsLoading(false);
        }
    };

    const getAllPetitions = async () => {
        try {
            const response = await axios.get(API_BASE_URL + "/petitions");
            setErrorFlag(false);
            setErrorMessage("");
            return response.data;
        } catch (error: any) {
            setErrorFlag(true);
            setErrorMessage(error.toString());
            return [];
        }
    };

    const getAllSupporters = async (allPetitions: PetitionFromGetOne[]) => {
        try {
            const allSupportersPromises = allPetitions.map(async (petition) => {
                const response = await axios.get(
                    API_BASE_URL + "/petitions/" + petition.petitionId + "/supporters",
                );
                return response.data;
            });

            const allSupporters: SupporterDirectQuery[][] =
                await Promise.all(allSupportersPromises);
            setErrorFlag(false);
            setErrorMessage("");
            return allSupporters;
        } catch (error: any) {
            setErrorFlag(true);
            setErrorMessage(error.toString());
        }
    };

    const handleChangePage = (event: any, newPage: React.SetStateAction<number>) =>
        setPage(newPage);

    const handleChangeRowsPerPage = (event: { target: { value: string } }) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    console.log(test);

    return (
        <>
            <Typography variant={"h3"} sx={{ fontSize: 25, color: "white", paddingBottom: 3 }}>
                My Petitions
            </Typography>
            <Paper>
                <TableContainer>
                    <Table aria-label="custom pagination table">
                        <TableBody>
                            {isLoading ? (
                                <></>
                            ) : usersPetitions.length > 0 ? (
                                (rowsPerPage > 0
                                    ? usersPetitions.slice(
                                          page * rowsPerPage,
                                          page * rowsPerPage + rowsPerPage,
                                      )
                                    : usersPetitions
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
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={usersPetitions.length}
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
        </>
    );
};

export default MyPetitionsTable;
