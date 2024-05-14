import {PetitionFromGetOne} from "petition";
import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow} from "@mui/material";
import React, {useEffect, useState} from "react";
import axios from "axios";
import {API_BASE_URL} from "../config";
import {SupporterDirectQuery} from "supporter";
import PetitionCard from "./PetitionCard";
import {formatTimestamp} from "../utils/timestampFormatting";

const PetitionSignersTable = ({ petitionId }: { petitionId: number }) => {
    const [allSupporters, setAllSupporters] = useState<SupporterDirectQuery[]>([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [errorFlag, setErrorFlag] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const fetchAllSupporters = async () => {
            await axios.get(API_BASE_URL + '/petitions/' + petitionId.toString() + '/supporters')
                .then((response) => {
                    setErrorFlag(false);
                    setErrorMessage("");
                    response.data.map((supporter: SupporterDirectQuery) => {
                        supporter.timestamp = formatTimestamp(supporter.timestamp);
                    })
                    setAllSupporters(response.data);
                }, (error) => {
                    setErrorFlag(true);
                    setErrorMessage(error.toString());
                });
        };

        fetchAllSupporters();
    }, [petitionId]);

    const handleChangePage = (event: any, newPage: React.SetStateAction<number>) => setPage(newPage);

    const handleChangeRowsPerPage = (event: { target: { value: string; }; }) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return(
        <>
            <Paper sx={{minWidth: 718, maxWidth: 930}}>
                <TableContainer>
                    <Table sx={{ minWidth: 350 }} aria-label="custom pagination table">
                        <TableHead>
                            <TableRow>
                                <TableCell width={10}>Signed By</TableCell>
                                <TableCell width={140}>Note</TableCell>
                                <TableCell width={10}>Date Signed</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {allSupporters.map((currentSupporter) => (
                            <TableRow key={currentSupporter.supportId}>
                                <TableCell component="th" scope="row">
                                    {currentSupporter.supporterFirstName} {currentSupporter.supporterLastName}
                                </TableCell>
                                <TableCell component="th" scope="row">
                                    {currentSupporter.message}
                                </TableCell>
                                <TableCell component="th" scope="row">
                                    {currentSupporter.timestamp}
                                </TableCell>
                            </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <TablePagination
                        rowsPerPageOptions={[5]}
                        component="div"
                        count={allSupporters.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        sx={{
                            display: "flex",
                            justifyContent: "flex-start",
                        }}
                    />
                </TableContainer>
            </Paper>
        </>
    )
}

export default PetitionSignersTable