import { Link, useNavigate, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { PetitionFromGetOne, SupporterTiersGet } from "petition";
import { defaultPetitionFromGetOne, defaultUser, petitionCategory } from "../utils/defaultStates";
import axios from "axios";
import { API_BASE_URL } from "../config";
import NavBar from "./NavBar";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Grid,
    Grow,
    Typography,
} from "@mui/material";
import { User } from "user";
import PetitionSignersTable from "./PetitionSignersTable";
import SupportTierExploreTable from "./SupportTierExploreTable";
import InnerPetitionTable from "./InnerPetitionTable";
import { formatTimestamp } from "../utils/timestampFormatting";
import { useUserAuthDetailsContext } from "../utils/userAuthContext";

const ExplorePetition = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const userAuth = useUserAuthDetailsContext();
    const [petition, setPetition] = useState<PetitionFromGetOne>(defaultPetitionFromGetOne);
    const [petitionImage, setPetitionImage] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [petitionOwnerUserInformation, setPetitionOwnerUserInformation] =
        useState<User>(defaultUser);
    const [petitionOwnerUserImage, setPetitionOwnerUserImage] = useState("");
    const [openModal, setOpenModal] = useState(false);
    const [minSupportTierCost, setMinSupportTierCost] = useState(0);
    const [errorFlag, setErrorFlag] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [checked, setChecked] = useState(false);

    const handleOpenModal = () => setOpenModal(true);
    const handleCloseModal = () => setOpenModal(false);

    useEffect(() => {
        fetchData();
    }, [id]);

    const fetchData = async () => {
        try {
            const response = await axios.get(API_BASE_URL + "/petitions/" + id);
            response.data.creationDate = formatTimestamp(response.data.creationDate);
            setPetition(response.data);
            findMinSupportTierCost(response.data.supportTiers);
            setIsLoading(false);
            setChecked(true);
            await fetchPetitionOwnerData(response.data.ownerId);
            await fetchPetitionOwnerImage(response.data.ownerId);
            await fetchPetitionImage(response.data.petitionId);
        } catch (error: any) {
            setErrorFlag(true);
            setErrorMessage(error.toString());
        }
    };

    const fetchPetitionOwnerData = async (ownerId: string) => {
        try {
            const response = await axios.get(API_BASE_URL + "/users/" + ownerId);
            console.log(response);
            setPetitionOwnerUserInformation(response.data);
        } catch (error: any) {
            setErrorFlag(true);
            setErrorMessage(error.toString());
        }
    };

    const fetchPetitionImage = async (petitionId: string) => {
        try {
            const petitionImage = await axios.get(
                API_BASE_URL + "/petitions/" + petitionId + "/image",
                {
                    responseType: "blob",
                },
            );
            const imageUrl = URL.createObjectURL(petitionImage.data);
            setPetitionImage(imageUrl);
        } catch (error: any) {
            setErrorFlag(true);
            setErrorMessage(error.toString());
        }
    };

    const fetchPetitionOwnerImage = async (ownerId: string) => {
        try {
            const response = await axios.get(API_BASE_URL + "/users/" + ownerId + "/image", {
                responseType: "blob",
            });
            setErrorFlag(false);
            setErrorMessage("");
            const url = URL.createObjectURL(response.data);
            setPetitionOwnerUserImage(url);
        } catch (error: any) {
            setErrorFlag(true);
            setErrorMessage(error.toString());
        }
    };

    const handleDeletePetition = () => {
        try {
            const response = axios.delete(API_BASE_URL + "/petitions/" + id, {
                headers: {
                    "X-Authorization": userAuth.authUser.token,
                },
            });
            navigate("/");
        } catch (error: any) {
            setErrorFlag(true);
            setErrorMessage(error.toString());
        }
    };

    const findMinSupportTierCost = (supportTiersInformation: SupporterTiersGet[]) => {
        const minSupportCost = Math.min(...supportTiersInformation.map((obj) => obj.cost));
        setMinSupportTierCost(minSupportCost);
    };

    return (
        <>
            <NavBar callbackSearchInput={() => {}} searchInput={""} includeSearchBar={false} />
            <Grow
                in={checked}
                style={{ transformOrigin: "0 0 0" }}
                {...(checked ? { timeout: 350 } : {})}
            >
                <Grid
                    container
                    spacing={2}
                    sx={{ paddingTop: 20, paddingLeft: 7, paddingBottom: 4 }}
                >
                    <Grid item xs={4}>
                        <img
                            style={{
                                height: 320,
                                width: 320,
                                objectFit: "cover",
                                borderRadius: "15%",
                            }}
                            src={petitionImage === "" ? "/defaultProfileImage.jpg" : petitionImage}
                            alt="petition-image"
                        />
                    </Grid>
                    <Grid
                        item
                        xs={8}
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "flex-start",
                            textAlign: "left",
                        }}
                    >
                        <Typography variant={"h1"} sx={{ color: "white", fontSize: 40 }}>
                            {petition.title}
                        </Typography>
                        <Typography
                            variant={"h3"}
                            sx={{
                                color: "white",
                                fontSize: 20,
                                marginBottom: "3rem",
                                maxWidth: 600,
                            }}
                        >
                            {petition.description}
                        </Typography>
                        <Typography
                            variant={"body2"}
                            sx={{ color: "white", fontSize: 15, maxWidth: 600 }}
                        >
                            {"Created "}
                            {petition.creationDate}
                        </Typography>
                        <Typography
                            variant={"body2"}
                            sx={{ color: "white", fontSize: 15, maxWidth: 600 }}
                        >
                            {"Money raised: $"}
                            {petition.moneyRaised}
                        </Typography>
                        <Typography
                            variant={"body2"}
                            sx={{
                                color: "white",
                                fontSize: 15,
                                marginBottom: "1rem",
                                maxWidth: 600,
                            }}
                        >
                            {"Number of supporters: "}
                            {petition.numberOfSupporters}
                        </Typography>
                    </Grid>
                    <Grid
                        item
                        xs={4}
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                        }}
                    >
                        <Typography variant={"subtitle1"} sx={{ color: "white", fontSize: 15 }}>
                            Owned By:
                        </Typography>
                        <Typography
                            variant={"h6"}
                            sx={{
                                color: "white",
                                fontSize: 20,
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                alignContent: "center",
                                marginTop: 2,
                            }}
                        >
                            {petitionOwnerUserImage !== "" ? (
                                <img
                                    src={petitionOwnerUserImage}
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
                                    alt={"owner-default-photo"}
                                    title={"owner-default-photo"}
                                    style={{
                                        borderRadius: "50%",
                                        objectFit: "cover",
                                    }}
                                />
                            )}
                            <span style={{ marginLeft: "8px" }}>
                                {petitionOwnerUserInformation.firstName}{" "}
                                {petitionOwnerUserInformation.lastName}
                            </span>
                        </Typography>
                        {petition.ownerId === userAuth.authUser.userId ? (
                            <>
                                <Box
                                    sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        maxWidth: 300,
                                    }}
                                >
                                    <Button
                                        component={Link}
                                        to={"/petition/" + id + "/edit"}
                                        sx={{ marginTop: 3 }}
                                    >
                                        Edit Petition
                                    </Button>
                                    <Button onClick={handleOpenModal} sx={{ marginTop: 1 }}>
                                        Delete Petition
                                    </Button>
                                </Box>
                            </>
                        ) : (
                            <></>
                        )}
                    </Grid>
                    <Grid
                        item
                        xs={8}
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-start",
                        }}
                    >
                        {!isLoading && <PetitionSignersTable petitionId={petition.petitionId} />}
                    </Grid>
                    <Grid
                        item
                        xs={4}
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                        }}
                    >
                        <Typography
                            variant={"h3"}
                            sx={{
                                color: "white",
                                fontSize: 20,
                                marginBottom: "1rem",
                                alignItems: "center",
                            }}
                        >
                            {"Support Tiers"}
                        </Typography>
                        <SupportTierExploreTable givenPetition={petition} />
                    </Grid>
                    <Grid item xs={6} sx={{ maxWidth: 10, textAlign: "left" }}>
                        <Typography
                            variant={"h3"}
                            sx={{
                                color: "white",
                                fontSize: 20,
                                marginBottom: "1rem",
                                alignItems: "center",
                                paddingLeft: 33,
                            }}
                        >
                            {"Related Petitions"}
                        </Typography>
                        <Box maxWidth={10}>
                            <InnerPetitionTable
                                searchInput={""}
                                selectedOptions={[petitionCategory[petition.categoryId]]}
                                maxSupporterCost={""}
                                sortBy={""}
                                givenPetition={petition}
                            />
                        </Box>
                    </Grid>
                </Grid>
            </Grow>
            <Dialog
                open={openModal}
                onClose={handleCloseModal}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Delete Petition"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to delete your petition?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => {
                            handleCloseModal();
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="outlined"
                        color="error"
                        onClick={handleDeletePetition}
                        autoFocus
                    >
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default ExplorePetition;
