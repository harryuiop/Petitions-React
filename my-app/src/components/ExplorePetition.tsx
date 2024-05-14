import {useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {PetitionFromGetOne, SupporterTiers} from "petition";
import {defaultPetitionFromGetOne, defaultUser, petitionCategory} from "../utils/defaultStates";
import axios from "axios";
import {API_BASE_URL} from "../config";
import NavBar from "./NavBar";
import {Grid, Grow, Typography} from "@mui/material";
import {User} from "user";
import PetitionSignersTable from "./PetitionSignersTable";
import SupportTierExploreTable from "./SupportTierExploreTable";
import InnerPetitionTable from "./InnerPetitionTable";

const ExplorePetition = () => {
    const { id } = useParams();
    const [petition, setPetition] = useState<PetitionFromGetOne>(defaultPetitionFromGetOne);
    const [petitionImage, setPetitionImage] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [petitionOwnerUserInformation, setPetitionOwnerUserInformation] = useState<User>(defaultUser);
    const [petitionOwnerUserImage, setPetitionOwnerUserImage] = useState("");
    const [minSupportTierCost, setMinSupportTierCost] = useState(0);
    const [errorFlag, setErrorFlag] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [checked, setChecked] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [petitionResponse
                      ,imageResponse
                      ,ownerResponse
                      ,ownerImageResponse] = await Promise.all([
                    axios.get(API_BASE_URL + '/petitions/' + id),
                    axios.get(API_BASE_URL + '/petitions/' + id + '/image', { responseType: 'blob' }),
                    axios.get(API_BASE_URL + '/users/' + id),
                    axios.get(API_BASE_URL + '/users/' + id + '/image', { responseType: 'blob' })
                ]);
                setPetition(petitionResponse.data);
                const imageUrl = URL.createObjectURL(imageResponse.data);
                setPetitionImage(imageUrl);
                setPetitionOwnerUserInformation(ownerResponse.data);
                const ownerImageUrl = URL.createObjectURL(ownerImageResponse.data);
                setPetitionOwnerUserImage(ownerImageUrl);
                findMinSupportTierCost(petitionResponse.data.supportTiers);
                setIsLoading(false);
                setChecked(true);
            } catch (error: any) {
                setErrorFlag(true);
                setErrorMessage(error.toString());
            }
        };

        fetchData();
    }, [id]);

    const findMinSupportTierCost = (supportTiersInformation: SupporterTiers[]) => {
        const minSupportCost = Math.min(...supportTiersInformation.map(obj => obj.cost));
        setMinSupportTierCost(minSupportCost);
    }

    return (
        <>
            <NavBar callbackSearchInput={() => { }} searchInput={""} includeSearchBar={false} />
            <Grow in={checked} style={{ transformOrigin: '0 0 0' }} {...(checked ? { timeout: 350 } : {})}>
                <Grid container spacing={2} sx={{ paddingTop: 20, paddingLeft: 7, paddingBottom: 4 }}>
                    <Grid item xs={4}>
                        <img
                            style={{ height: 320, width: 320, objectFit: "cover", borderRadius: '15%' }}
                            src={petitionImage}
                            alt="petition-image"
                        />
                    </Grid>
                    <Grid item xs={8} sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "flex-start",
                        textAlign: "left"
                    }}>
                        <Typography variant={"h1"} sx={{ color: "white", fontSize: 40 }}>
                            {petition.title}
                        </Typography>
                        <Typography variant={"h3"} sx={{ color: "white", fontSize: 20, marginBottom: "1rem", maxWidth: 600 }}>
                            {petition.description}
                        </Typography>

                    </Grid>
                    <Grid item xs={4}>
                        <Typography variant={"subtitle1"} sx={{ color: "white", fontSize: 15 }}>
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
                            {petitionOwnerUserImage !== "" ? (
                                <img
                                    src={petitionOwnerUserImage}
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
                            <span style={{ marginLeft: '8px' }}>
                                {petitionOwnerUserInformation.firstName} {petitionOwnerUserInformation.lastName}
                            </span>
                        </Typography>

                    </Grid>
                    <Grid item xs={8} sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start"

                    }}>
                        {!isLoading && (
                            <PetitionSignersTable petitionId={petition.petitionId} />
                        )}
                    </Grid>
                    <Grid item xs={4} sx={{
                        display: "flex",
                        flexDirection: "column",
                    }}>
                        <Typography variant={"h3"} sx={{ color: "white", fontSize: 20, marginBottom: "1rem", alignItems: "flex-end" }}>
                            {"Support Tiers"}
                        </Typography>
                        <SupportTierExploreTable givenPetition={petition}/>
                    </Grid>
                    <Grid item xs={6} maxWidth={150}>
                        <Typography variant={"h3"} sx={{ color: "white", fontSize: 20, marginBottom: "1rem", alignItems: "flex-start" }}>
                            {"Related Petitions"}
                        </Typography>
                        <InnerPetitionTable
                            searchInput={""}
                            selectedOptions={[petitionCategory[petition.categoryId]]}
                            maxSupporterCost={""}
                            sortBy={""}
                            givenPetition={petition}
                        />
                    </Grid>
                </Grid>
            </Grow>
        </>
    );
}

export default ExplorePetition;
