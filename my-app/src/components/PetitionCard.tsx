import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../config";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Box, Card, CardActionArea, CardContent, CardMedia, Skeleton, Typography } from "@mui/material";
import {PetitionFromGetOne, Supporter} from "petition";
import { grey } from "@mui/material/colors";
import SkeletonCard from "./SkeletonCard";
import {defaultPetitionFromGetOne} from "../utils/defaultPetitionState";

const PetitionCard = ({ petitionId }: { petitionId: Number }) => {
    const [id, setId] = useState(petitionId);
    const [petition, setPetition] = useState<PetitionFromGetOne>(defaultPetitionFromGetOne);
    const [petitionImage, setPetitionImage] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [errorFlag, setErrorFlag] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const getPetitionInformation = () => {
            axios.get(API_BASE_URL + '/petitions/' + id)
                .then((response) => {
                    setErrorFlag(false);
                    setErrorMessage("");
                    setPetition(response.data);
                }, (error) => {
                    setErrorFlag(true);
                    setErrorMessage(error.toString());
                });
        }

        const getPetitionImage = async () => {
            try {
                const response = await axios.get(API_BASE_URL + '/petitions/' + id + '/image', {
                    responseType: 'blob'
                });
                setErrorFlag(false);
                setErrorMessage("");
                const url = URL.createObjectURL(response.data);
                setPetitionImage(url);
            } catch (error: any) {
                setErrorFlag(true);
                setErrorMessage(error.toString());
            }
        }

        getPetitionImage();
        getPetitionInformation();
        setIsLoading(false);
    }, [id]);

    return (
        <>
            {isLoading ? (
                <SkeletonCard />
            ) : (
                <Card sx={{ display: 'flex', maxWidth: 900, minWidth: 800, minHeight: 200,
                    transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
                    '&:hover': {
                        backgroundColor: grey[600],
                        boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
                    }, }}>
                    <CardActionArea>
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <CardContent sx={{ flex: '1 0 auto' }}>
                                <Typography component="div" variant="h5">
                                    {petition.title}
                                </Typography>
                                <Typography variant="body2">
                                    {petition.creationDate}
                                </Typography>
                                <Typography variant="body2">
                                    Created by {petition.ownerFirstName} {petition.ownerLastName}
                                </Typography>
                                <Typography variant="body2">
                                    {petition.categoryId}
                                </Typography>
                            </CardContent>
                        </Box>
                    </CardActionArea>
                    <CardMedia
                        component="img"
                        sx={{ height: 200, width: 200, objectFit: "cover" }}
                        src={petitionImage}
                        alt="petition-image"
                    />
                </Card>
            )}
        </>
    );
}

export default PetitionCard;