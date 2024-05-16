import {
    Card,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { PetitionFromGetOne, SupporterTiersGet } from "petition";
import { grey } from "@mui/material/colors";

const SupportTierExploreTable = ({ givenPetition }: { givenPetition: PetitionFromGetOne }) => {
    const [allSupportTiers, setAllSupportTiers] = useState<SupporterTiersGet[]>([]);

    useEffect(() => {
        setAllSupportTiers(givenPetition.supportTiers);
    }, [givenPetition]);

    return (
        <>
            <TableContainer sx={{ maxWidth: 430 }}>
                <Table
                    sx={{ minWidth: 350, maxWidth: 530, border: "none" }}
                    aria-label="simple table"
                >
                    <TableBody>
                        {allSupportTiers.map((supportTier) => (
                            <TableRow key={supportTier.supportTierId}>
                                <TableCell
                                    component="th"
                                    scope="row"
                                    sx={{
                                        border: "none",
                                        padding: 0,
                                        backgroundColor: "transparent",
                                        fontWeight: "normal",
                                        paddingBottom: 2,
                                        maxWidth: 5,
                                    }}
                                >
                                    <Card sx={{ borderRadius: 5 }}>
                                        <Typography
                                            variant="h6"
                                            component="div"
                                            sx={{
                                                backgroundColor: grey[600],
                                                paddingLeft: 2,
                                                paddingRight: 2,
                                                paddingTop: 1.5,
                                                paddingBottom: 1,
                                                fontWeight: "bold",
                                                textAlign: "center",
                                            }}
                                        >
                                            {supportTier.title}
                                        </Typography>
                                        <Typography
                                            color="text.secondary"
                                            sx={{
                                                mb: 1.5,
                                                paddingLeft: 2,
                                                paddingRight: 2,
                                                paddingTop: 2,
                                            }}
                                        >
                                            {"Support for: $"}
                                            {supportTier.cost}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                paddingLeft: 2,
                                                paddingRight: 2,
                                                paddingBottom: 2,
                                            }}
                                        >
                                            {supportTier.description}
                                        </Typography>
                                    </Card>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
};

export default SupportTierExploreTable;
