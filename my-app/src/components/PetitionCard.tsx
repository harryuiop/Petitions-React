import React, {useEffect, useState} from "react";
import {defaultPetition} from "../utils/defaultPetitionState";
import {API_BASE_URL} from "../config";
import axios from "axios";
import {useParams} from "react-router-dom";
import {Box, Button, Card, CardActionArea, CardActions, CardContent, CardMedia, Typography} from "@mui/material";
import {PetitionFromGetOne} from "petition";


const PetitionCard = () => {
    const {id} = useParams();
    const [petition, setPetition] = useState<PetitionFromGetOne>(defaultPetition);
    const [petitionImage, setPetitionImage] = useState("");
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

        const getPetitionImage = () => {
            axios.get(API_BASE_URL + '/petitions/' + id + '/image', { responseType: 'arraybuffer' })
                .then((response) => {
                    setErrorFlag(false);
                    setErrorMessage("");
                    const base64Image = btoa(
                        new Uint8Array(response.data).reduce(
                            (data, byte) => data + String.fromCharCode(byte),
                            ''
                        )
                    );
                    const imageDataUrl = `data:image/jpeg;base64,${base64Image}`;
                    setPetitionImage(imageDataUrl);
                })
                .catch((error) => {
                    setErrorFlag(true);
                    setErrorMessage(error.toString());
                });
        }

        getPetitionImage()
        getPetitionInformation()
        }, [id]);


    return (
            <Card sx={{ display: 'flex', maxWidth: 500,
                transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                    backgroundColor: '#f0f0f0', // Change background color on hover
                    boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)', // Add box shadow on hover
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
                            // ToDo: supporting cost (of the minimum tier)
                            {petition.categoryId}
                        </Typography>
                    </CardContent>
                </Box>
                </CardActionArea>

                <CardMedia
                    component="img"
                    sx={{ width: 151 }}
                    image={petitionImage}
                    alt="Petition image"
                />
            </Card>
        );
    }

export default PetitionCard