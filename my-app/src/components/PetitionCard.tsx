import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../config";
import axios from "axios";
import { Link } from "react-router-dom";
import { Box, Card, CardActionArea, CardContent, CardMedia, Grow, Typography } from "@mui/material";
import { PetitionFromGetOne, SupporterTiersGet } from "petition";
import { grey } from "@mui/material/colors";
import { defaultPetitionFromGetOne, defaultUser, petitionCategory } from "../utils/defaultStates";
import { User } from "user";
import { formatTimestamp } from "../utils/timestampFormatting";

const PetitionCard = ({ petitionId }: { petitionId: Number }) => {
    const [petition, setPetition] = useState<PetitionFromGetOne>(defaultPetitionFromGetOne);
    const [petitionImage, setPetitionImage] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [petitonOwnerUserInformation, setPetitonOwnerUserInformation] =
        useState<User>(defaultUser);
    const [petitonOwnerUserImage, setPetitonOwnerUserImage] = useState("");
    const [minSupportTierCost, setMinSupportTierCost] = useState(0);
    const [errorFlag, setErrorFlag] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [checked, setChecked] = useState(false);

    useEffect(() => {
        getPetitionInformation();
    }, [petitionId]);

    const findMinSupportTierCost = (supportTiersInformation: SupporterTiersGet[]) => {
        const minSupportCost = Math.min(...supportTiersInformation.map((obj) => obj.cost));
        setMinSupportTierCost(minSupportCost);
    };

    const getPetitionInformation = async () => {
        try {
            if (petitionId !== 0) {
                const response = await axios.get(API_BASE_URL + "/petitions/" + petitionId);
                setErrorFlag(false);
                setErrorMessage("");
                response.data.creationDate = formatTimestamp(response.data.creationDate);
                setPetition(response.data);
                findMinSupportTierCost(response.data.supportTiers);

                await getPetitionOwnerInformation(response.data.ownerId);
                await getPetitionImage(response.data.petitionId);
                await getPetitionOwnerImage(response.data.ownerId);
                setIsLoading(false);
                setChecked(true);
            }
        } catch (error: any) {
            setErrorFlag(true);
            setErrorMessage(error.toString());
        }
    };

    const getPetitionOwnerInformation = async (ownerId: string) => {
        try {
            const response = await axios.get(API_BASE_URL + "/users/" + ownerId);
            setErrorFlag(false);
            setErrorMessage("");
            setPetitonOwnerUserInformation(response.data);
        } catch (error: any) {
            setErrorFlag(true);
            setErrorMessage(error.toString());
        }
    };

    const getPetitionImage = async (petitionId: string) => {
        try {
            const response = await axios.get(API_BASE_URL + "/petitions/" + petitionId + "/image", {
                responseType: "blob",
            });
            setErrorFlag(false);
            setErrorMessage("");
            const url = URL.createObjectURL(response.data);
            setPetitionImage(url);
        } catch (error: any) {
            setErrorFlag(true);
            setErrorMessage(error.toString());
        }
    };

    const getPetitionOwnerImage = async (ownerId: string) => {
        try {
            const response = await axios.get(API_BASE_URL + "/users/" + ownerId + "/image", {
                responseType: "blob",
            });
            setErrorFlag(false);
            setErrorMessage("");
            const url = URL.createObjectURL(response.data);
            setPetitonOwnerUserImage(url);
        } catch (error: any) {
            setErrorFlag(true);
            setErrorMessage(error.toString());
        }
    };

    return (
        <>
            {isLoading ? (
                // <SkeletonCard />
                <></>
            ) : (
                <Grow
                    in={checked}
                    style={{ transformOrigin: "0 0 0" }}
                    {...(checked ? { timeout: 1200 } : {})}
                >
                    <Link to={"/petition/" + petitionId} style={{ textDecoration: "none" }}>
                        <Card
                            sx={{
                                display: "flex",
                                maxWidth: 900,
                                minWidth: 600,
                                minHeight: 200,
                                transition: "background-color 0.3s ease, box-shadow 0.3s ease",
                                "&:hover": {
                                    backgroundColor: grey[600],
                                    boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
                                },
                            }}
                        >
                            <CardActionArea>
                                <Box sx={{ display: "flex", flexDirection: "column" }}>
                                    <CardContent sx={{ flex: "1 0 auto" }}>
                                        <Typography component="div" variant="h5">
                                            {petition.title}
                                        </Typography>
                                        <Typography variant="body2">
                                            {"Created "}
                                            {petition.creationDate}
                                        </Typography>
                                        <Typography variant="body2">
                                            {"Minimum Support Cost: $"}
                                            {minSupportTierCost}
                                        </Typography>
                                        <Typography variant="body2">
                                            {petitionCategory[petition.categoryId] ||
                                                "Unknown Category"}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                marginTop: 2,
                                            }}
                                        >
                                            {petitonOwnerUserImage !== "" ? (
                                                <img
                                                    src={petitonOwnerUserImage}
                                                    height={75}
                                                    width={75}
                                                    alt={"owner-photo"}
                                                    title={"owner-photo"}
                                                    style={{
                                                        borderRadius: "50%",
                                                        objectFit: "cover",
                                                    }}
                                                />
                                            ) : (
                                                <img
                                                    src={"/defaultProfileImage.jpg"}
                                                    height={75}
                                                    width={75}
                                                    alt={"owner-photo"}
                                                    title={"owner-photo"}
                                                    style={{
                                                        borderRadius: "50%",
                                                        objectFit: "cover",
                                                    }}
                                                />
                                            )}
                                            <span style={{ marginLeft: "8px" }}>
                                                {petition.ownerFirstName} {petition.ownerLastName}
                                            </span>
                                        </Typography>
                                    </CardContent>
                                </Box>
                            </CardActionArea>
                            <CardMedia
                                component="img"
                                sx={{
                                    height: 230,
                                    width: 230,
                                    objectFit: "cover",
                                    borderRadius: "15%",
                                }}
                                src={petitionImage}
                                alt="petition-image"
                            />
                        </Card>
                    </Link>
                </Grow>
            )}
        </>
    );
};

export default PetitionCard;
