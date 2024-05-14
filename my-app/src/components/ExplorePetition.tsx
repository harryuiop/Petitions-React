import {useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {PetitionFromGetOne, Supporter} from "petition";
import {defaultPetitionFromGetOne, defaultUser} from "../utils/defaultStates";
import axios from "axios";
import {API_BASE_URL} from "../config";
import NavBar from "./NavBar";
import {Box, Grid, Grow, Typography} from "@mui/material";
import {User} from "user";

const ExplorePetition = () => {
    const {id} = useParams();
    const [petition, setPetition] = useState<PetitionFromGetOne>(defaultPetitionFromGetOne);
    const [petitionImage, setPetitionImage] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [petitonOwnerUserInformation, setPetitonOwnerUserInformation] = useState<User>(defaultUser);
    const [petitonOwnerUserImage, setPetitonOwnerUserImage] = useState("");
    const [minSupportTierCost, setMinSupportTierCost] = useState(0);
    const [errorFlag, setErrorFlag] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [checked, setChecked] = useState(false);

    useEffect(() => {
        const getPetitionInformation = async () => {
            await axios.get(API_BASE_URL + '/petitions/' + id)
                .then((response) => {
                    setErrorFlag(false);
                    setErrorMessage("");
                    setPetition(response.data);
                    findMinSupportTierCost(response.data.supportTiers);
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

        const getPetitionOwnerInformation = async () => {
            try {
                const response = await axios.get(API_BASE_URL + '/users/' + id);
                setErrorFlag(false);
                setErrorMessage("");
                setPetitonOwnerUserInformation(response.data);
            } catch (error: any) {
                setErrorFlag(true);
                setErrorMessage(error.toString());
            }
        }

        const getPetitionOwnerImage = async () => {
            try {
                const response = await axios.get(API_BASE_URL + '/users/' + id + '/image', {
                    responseType: 'blob'
                });
                setErrorFlag(false);
                setErrorMessage("");
                const url = URL.createObjectURL(response.data);
                setPetitonOwnerUserImage(url);
            } catch (error: any) {
                setErrorFlag(true);
                setErrorMessage(error.toString());
            }
        }

        const findMinSupportTierCost = (supportTiersInformation: Supporter[]) => {
            const minSupportCost = Math.min(...supportTiersInformation.map(obj => obj.cost));
            setMinSupportTierCost(minSupportCost);
        }

        getPetitionImage();
        getPetitionInformation();
        getPetitionOwnerInformation();
        getPetitionOwnerImage();
        setIsLoading(false);
        setChecked(true);
    }, [id]);

    return (
        <>
            <NavBar callbackSearchInput={() => {
            }} searchInput={""} includeSearchBar={false}/>
            <Grow in={checked} style={{transformOrigin: '0 0 0'}}
                  {...(checked ? {timeout: 350} : {})}>
                <Grid container spacing={2} sx={{paddingTop: 20, paddingLeft: 7}}>
                    <Grid item xs={4}>
                        <img
                            style={{height: 320, width: 320, objectFit: "cover", borderRadius: '15%'}}
                            src={petitionImage}
                            alt="petition-image">
                        </img>
                    </Grid>
                    <Grid item xs={8} sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "flex-start",
                        textAlign: "left"
                    }}>
                        <Typography variant={"h1"} sx={{color: "white", fontSize: 40}}>
                            {petition.title}
                        </Typography>
                        <Typography variant={"h3"} sx={{color: "white", fontSize: 20}}>
                            {petition.description}
                        </Typography>
                    </Grid>
                    <Grid item xs={4}>
                        <Typography variant={"subtitle1"} sx={{color: "white", fontSize: 15}}>
                            Owned By:
                        </Typography>
                        <Typography variant={"h6"} sx={{
                            color: "white",
                            fontSize: 20,
                            display: 'flex',
                            justifyContent: "center",
                            alignItems: 'center',
                            alignContent: "center",
                            marginTop: 2
                        }}>
                            {petitonOwnerUserImage !== "" ? (
                                <img
                                    src={petitonOwnerUserImage}
                                    height={75}
                                    width={75}
                                    alt={"owner-photo"}
                                    title={"owner-photo"}
                                    style={{
                                        borderRadius: '50%',
                                        objectFit: 'cover',
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
                                        borderRadius: '50%',
                                        objectFit: 'cover',
                                    }}
                                />
                            )}
                            <span style={{marginLeft: '8px'}}>
                                {petition.ownerFirstName} {petition.ownerLastName}
                            </span>
                        </Typography>
                        <Typography variant={"subtitle1"} sx={{color: "white", fontSize: 20, paddingTop: 3}}>
                            {"Supporter Count: "}{petition.numberOfSupporters}
                        </Typography>
                        <Typography variant={"subtitle1"} sx={{color: "white", fontSize: 20, paddingTop: 0}}>
                            {"Amount Raised: $"}{petition.moneyRaised}
                        </Typography>
                    </Grid>
                    <Grid item xs={8}>

                    </Grid>
                </Grid>
            </Grow>
        </>
    )
}

export default ExplorePetition