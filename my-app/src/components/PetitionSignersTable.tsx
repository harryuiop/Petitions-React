import { PetitionFromGetOne } from "petition";
import {
    Avatar,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config";
import { SupporterDirectQuery } from "supporter";
import { formatTimestamp } from "../utils/timestampFormatting";
import moment from "moment";
import * as supporter from "supporter";

const PetitionSignersTable = ({ petitionId }: { petitionId: number }) => {
    const [allSupporters, setAllSupporters] = useState<SupporterDirectQuery[]>([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [errorFlag, setErrorFlag] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [currentSignerProfilePhoto, setCurrentSignerProfilePhoto] = useState("");
    const [petitionSupportTiers, setPetitionSupportTiers] = useState();

    useEffect(() => {
        const fetchAllSupporters = async () => {
            try {
                const response = await axios.get(
                    API_BASE_URL + "/petitions/" + petitionId.toString() + "/supporters",
                );
                setErrorFlag(false);
                setErrorMessage("");
                const sortedByDate: SupporterDirectQuery[] = response.data.sort(
                    (a: SupporterDirectQuery, b: SupporterDirectQuery) => {
                        return moment(a["timestamp"]).diff(moment(b["timestamp"]));
                    },
                );
                sortedByDate.map((supporter: SupporterDirectQuery) => {
                    supporter.timestamp = formatTimestamp(supporter.timestamp);
                });
                setAllSupporters(sortedByDate);
            } catch (error: any) {
                setErrorFlag(true);
                setErrorMessage(error.toString());
            }
        };

        fetchAllSupporters();
    }, [petitionId]);

    const fetchSignerImage = async (currentSupporter: SupporterDirectQuery) => {
        try {
            const result = await axios.get(
                API_BASE_URL + "/users/" + currentSupporter.supporterId + "/image",
            );
            return result.data;
        } catch (error: any) {
            setErrorFlag(true);
            setErrorMessage(error.toString());
            return "";
        }
    };

    const handleChangePage = (event: any, newPage: React.SetStateAction<number>) =>
        setPage(newPage);

    const handleChangeRowsPerPage = (event: { target: { value: string } }) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <>
            <Paper sx={{ minWidth: 718, maxWidth: 930 }}>
                <TableContainer>
                    <Table sx={{ minWidth: 350 }} aria-label="custom pagination table">
                        <TableHead>
                            <TableRow>
                                <TableCell width={5}></TableCell>
                                <TableCell width={10}>Signed By</TableCell>
                                <TableCell width={140}>Note</TableCell>
                                <TableCell width={10}>Tier Supported</TableCell>
                                <TableCell width={10}>Date Signed</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {allSupporters.map((currentSupporter) => (
                                <TableRow key={currentSupporter.supportId}>
                                    <TableCell
                                        component="th"
                                        scope="row"
                                        sx={{ paddingRight: 0, paddingLeft: 3 }}
                                    >
                                        <Avatar
                                            src={`${API_BASE_URL}/users/${currentSupporter.supporterId}/image`}
                                            alt={currentSupporter.supporterFirstName}
                                            style={{
                                                height: 45,
                                                width: 45,
                                                borderRadius: "50%",
                                                objectFit: "cover",
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell
                                        component="th"
                                        scope="row"
                                        sx={{ paddingLeft: 0, paddingRight: 3 }}
                                    >
                                        <>
                                            {currentSupporter.supporterFirstName}{" "}
                                            {currentSupporter.supporterLastName}
                                        </>
                                    </TableCell>
                                    <TableCell component="th" scope="row">
                                        {currentSupporter.message}
                                    </TableCell>
                                    <TableCell component="th" scope="row">
                                        {currentSupporter.supportTierId}
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
    );
};

export default PetitionSignersTable;
