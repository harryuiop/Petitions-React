import { Link, useNavigate, useParams } from "react-router-dom";
import { useUserAuthDetailsContext } from "../utils/userAuthContext";
import React, { useEffect, useState } from "react";
import {
    CategoryRequest,
    PetitionFromGetOne,
    SupporterTiersCreate,
    SupporterTiersGet,
} from "petition";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    SelectChangeEvent,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from "@mui/material";
import { green, grey } from "@mui/material/colors";
import axios from "axios";
import { API_BASE_URL } from "../config";
import { defaultPetitionFromGetOne } from "../utils/defaultStates";
import NavBar from "./NavBar";

const EditPetition = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const userAuth = useUserAuthDetailsContext();

    const [inputtedTitle, setInputtedTitle] = useState("");
    const [inputtedDescription, setInputtedDescription] = useState("");
    const [inputtedCategoryId, setInputtedCategoryId] = useState("");
    const [inputtedSupportTiers, setInputtedSupportTiers] = useState<SupporterTiersCreate[]>([]);
    const [inputtedPetitionPhoto, setInputtedPetitionPhoto] = useState("");
    const [inputtedSupportTierTitle, setInputtedSupportTierTitle] = useState("");
    const [inputtedSupportTierDescription, setInputtedSupportTierDescription] = useState("");
    const [inputtedSupportTierCost, setInputtedSupportTierCost] = useState("");
    const [fileType, setFileType] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [allCategory, setAllCategory] = useState<CategoryRequest[]>([]);
    const [petition, setPetition] = useState<PetitionFromGetOne>(defaultPetitionFromGetOne);
    const [inputtedUserProfilePhoto, setInputtedUserProfilePhoto] = useState<Blob>(new Blob());

    const [openSupporterTierModal, setOpenSupporterTierModal] = useState(false);
    const [errorFlag, setErrorFlag] = useState(false);
    const [imageToRemove, setImageToRemove] = useState(false);
    const [photoInputted, setPhotoInputted] = useState(false);
    const [toEdit, setToEdit] = useState(false);
    const [editTitle, setEditTitle] = useState("");

    const handleOpenModal = () => setOpenSupporterTierModal(true);
    const handleCloseModal = () => setOpenSupporterTierModal(false);

    useEffect(() => {
        const fetchAllCurrentSupportTiers = async () => {
            try {
                const response = await axios.get(API_BASE_URL + "/petitions/" + id);
                setInputtedSupportTiers(response.data.supportTiers);
                setPetition(response.data);
            } catch (error: any) {
                setErrorFlag(true);
                setErrorMessage(error.toString());
            }
        };

        const fetchAllCategoryIds = async () => {
            try {
                const response = await axios.get(API_BASE_URL + "/petitions/categories");
                setAllCategory(response.data);
            } catch (error: any) {
                setErrorFlag(true);
                setErrorMessage(error.toString());
            }
        };

        fetchAllCurrentSupportTiers();
        fetchAllCategoryIds();
    }, []);

    const handleSubmit = async () => {
        try {
            if (inputtedSupportTiers.length > 0) {
                // Found from https://stackoverflow.com/questions/11704267/in-javascript-how-to-conditionally-add-a-member-to-an-object
                const requestBody = {
                    ...(inputtedTitle !== "" && { title: inputtedTitle }),
                    ...(inputtedDescription !== "" && { description: inputtedDescription }),
                    ...(inputtedCategoryId !== "" && { categoryId: inputtedCategoryId }),
                };

                const response = await axios.patch(API_BASE_URL + "/petitions/" + id, requestBody, {
                    headers: {
                        "X-Authorization": userAuth.authUser.token,
                        "Content-Type": "application/json",
                    },
                });

                if (inputtedUserProfilePhoto) {
                    await uploadImage(petition.petitionId.toString());
                }
                navigate("/petition/" + id);
            }
        } catch (error: any) {
            console.log(error);
            setErrorFlag(true);
            setErrorMessage(error.toString());
        }
    };

    const uploadImage = async (petitionId: string) => {
        setFileType(inputtedUserProfilePhoto.type);

        const reader = new FileReader();
        reader.onload = async () => {
            try {
                const arrayBuffer = reader.result as ArrayBuffer;
                const uint8Array = new Uint8Array(arrayBuffer);

                await axios.put(API_BASE_URL + "/petitions/" + petitionId + "/image", uint8Array, {
                    headers: {
                        "X-Authorization": userAuth.authUser.token,
                        "Content-Type": inputtedUserProfilePhoto.type,
                    },
                });
            } catch (error: any) {
                console.error(error.message);
                setErrorFlag(true);
                setErrorMessage(error.message);
            }
        };
        reader.readAsArrayBuffer(inputtedUserProfilePhoto);
    };

    const handleRemoveImage = async () => {
        setImageToRemove(true);
        setPhotoInputted(false);
        setInputtedPetitionPhoto("");
    };

    const handleImageChange = (event: any) => {
        setInputtedUserProfilePhoto(event.target.files[0]);
    };

    const handleCategorySelection = (event: SelectChangeEvent) => {
        setInputtedCategoryId(event.target.value);
    };

    const addSupportTier = async () => {
        try {
            const response = await axios.put(
                API_BASE_URL + "/petitions/" + id + "/supportTiers",
                {
                    title: inputtedSupportTierTitle,
                    description: inputtedSupportTierDescription,
                    cost: parseInt(inputtedSupportTierCost, 10),
                },
                {
                    headers: {
                        "X-Authorization": userAuth.authUser.token,
                        "Content-Type": "application/json",
                    },
                },
            );
            setInputtedSupportTiers((prevSupportTiers) => [
                ...prevSupportTiers,
                {
                    title: inputtedSupportTierTitle,
                    description: inputtedSupportTierDescription,
                    cost: parseInt(inputtedSupportTierCost, 10),
                },
            ]);
            handleCloseModal();
        } catch (error: any) {
            setErrorFlag(true);
            setErrorMessage(error.toString());
        }
    };

    const deleteSupportTier = async (title: string) => {
        try {
            setInputtedSupportTiers((prevSupportTiers) =>
                prevSupportTiers.filter((tier) => tier.title !== title),
            );
            const supportTier: SupporterTiersGet[] = petition.supportTiers.filter(
                (tier) => tier.title === title,
            );
            await axios.delete(
                API_BASE_URL + "/petitions/" + id + "/supportTiers/" + supportTier[0].supportTierId,
                {
                    headers: {
                        "X-Authorization": userAuth.authUser.token,
                    },
                },
            );
        } catch (error: any) {
            console.log(error);
            console.log(userAuth.authUser);
            setErrorFlag(true);
            setErrorMessage(error.toString());
        }
    };

    const editSupportTier = async () => {
        try {
            // Found from https://stackoverflow.com/questions/11704267/in-javascript-how-to-conditionally-add-a-member-to-an-object
            const requestBody = {
                ...(inputtedSupportTierTitle !== "" && { title: inputtedSupportTierTitle }),
                ...(inputtedSupportTierDescription !== "" && {
                    description: inputtedSupportTierDescription,
                }),
                ...(inputtedSupportTierCost !== "" && {
                    cost: parseInt(inputtedSupportTierCost, 10),
                }),
            };
            const supportTier: SupporterTiersGet[] = petition.supportTiers.filter(
                (tier) => tier.title === editTitle,
            );
            await axios.patch(
                API_BASE_URL + "/petitions/" + id + "/supportTiers/" + supportTier[0].supportTierId,
                requestBody,
                {
                    headers: {
                        "X-Authorization": userAuth.authUser.token,
                        "Content-Type": "application/json",
                    },
                },
            );
            const petitionToEdit: SupporterTiersCreate[] = inputtedSupportTiers.filter(
                (tier) => tier.title !== inputtedTitle,
            );

            setInputtedSupportTiers((prevSupportTiers) =>
                prevSupportTiers.filter((tier) => tier.title !== editTitle),
            );

            if (requestBody.title !== undefined) {
                petitionToEdit[0].title = requestBody.title;
            }
            if (requestBody.description !== undefined) {
                petitionToEdit[0].description = requestBody.description;
            }
            if (requestBody.cost !== undefined) {
                petitionToEdit[0].cost = requestBody.cost;
            }

            setInputtedSupportTiers((prevSupportTiers) => [...prevSupportTiers, petitionToEdit[0]]);

            setToEdit(false);
            setEditTitle("");
            handleCloseModal();
        } catch (error: any) {
            setErrorFlag(true);
            setErrorMessage(error.toString());
            setErrorMessage(error.toString());
        }
    };

    const handleEditButton = (title: string) => {
        setEditTitle(title);
        setToEdit(true);
        handleOpenModal();
    };

    return (
        <>
            {petition.ownerId === userAuth.authUser.userId ? (
                <>
                    <Typography
                        variant="h3"
                        color={grey[200]}
                        sx={{ paddingTop: 10, marginBottom: 10, marginRight: 2 }}
                    >
                        Edit Petition
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid
                            item
                            xs={6}
                            display="flex"
                            alignItems="flex-end"
                            flexDirection="column"
                            sx={{ paddingRight: 5 }}
                        >
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    minHeight: "70vh",
                                    minWidth: 400,
                                }}
                            >
                                <Typography variant={"h6"} sx={{ color: "white" }}>
                                    Details
                                </Typography>
                                <FormControl fullWidth sx={{ marginBottom: 2 }}>
                                    <TextField
                                        id="title"
                                        label="New Title"
                                        variant="outlined"
                                        value={inputtedTitle}
                                        onChange={(event) => setInputtedTitle(event.target.value)}
                                    />
                                </FormControl>
                                <FormControl fullWidth sx={{ marginBottom: 2 }}>
                                    <TextField
                                        id="description"
                                        label="New Description"
                                        variant="outlined"
                                        value={inputtedDescription}
                                        onChange={(event) =>
                                            setInputtedDescription(event.target.value)
                                        }
                                        multiline
                                        rows={4}
                                    />
                                </FormControl>
                                <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label">
                                        Change Category
                                    </InputLabel>
                                    <Select
                                        labelId="category-id"
                                        id="category-id"
                                        value={inputtedCategoryId}
                                        label="Category"
                                        onChange={handleCategorySelection}
                                    >
                                        {allCategory.map((category) => (
                                            <MenuItem
                                                key={category.categoryId}
                                                value={category.categoryId}
                                            >
                                                {category.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                {inputtedPetitionPhoto === "" ? (
                                    <Button
                                        variant="outlined"
                                        component="label"
                                        sx={{ marginTop: 2 }}
                                    >
                                        UPLOAD PROFILE IMAGE
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            hidden
                                        />
                                    </Button>
                                ) : (
                                    <Button
                                        variant="outlined"
                                        onClick={handleRemoveImage}
                                        sx={{ marginTop: 2 }}
                                    >
                                        REMOVE PETITION IMAGE
                                    </Button>
                                )}
                                {photoInputted && (
                                    <Typography
                                        variant="body2"
                                        sx={{ color: green[400], marginTop: 0, paddingBottom: 2 }}
                                    >
                                        Image uploaded successfully!
                                    </Typography>
                                )}
                                <Box
                                    sx={{
                                        display: "flex",
                                        flexDirection: "row",
                                        alignItems: "center",
                                        marginBottom: 3,
                                        marginTop: 3,
                                    }}
                                >
                                    <Button
                                        variant="outlined"
                                        color="success"
                                        onClick={handleSubmit}
                                        sx={{ marginRight: 2 }}
                                    >
                                        Confirm
                                    </Button>
                                    <Button
                                        component={Link}
                                        to={"/"}
                                        variant="outlined"
                                        color="error"
                                    >
                                        Cancel
                                    </Button>
                                </Box>
                            </Box>
                        </Grid>
                        <Grid item display="flex" flexDirection="column" xs={6}>
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    minHeight: "70vh",
                                    maxWidth: 500,
                                }}
                            >
                                <Typography variant={"h6"} sx={{ color: "white" }}>
                                    Support Tiers
                                </Typography>
                                <TableContainer component={Paper}>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Title</TableCell>
                                                <TableCell>Description</TableCell>
                                                <TableCell>Cost</TableCell>
                                                <TableCell></TableCell>
                                                <TableCell></TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {inputtedSupportTiers.map((tier) => (
                                                <TableRow key={tier.title}>
                                                    <TableCell>{tier.title}</TableCell>
                                                    <TableCell>{tier.description}</TableCell>
                                                    <TableCell>{tier.cost}</TableCell>
                                                    <TableCell>
                                                        <Button
                                                            onClick={() =>
                                                                deleteSupportTier(tier.title)
                                                            }
                                                        >
                                                            Remove
                                                        </Button>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Button
                                                            onClick={() =>
                                                                handleEditButton(tier.title)
                                                            }
                                                        >
                                                            Edit
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                                {inputtedSupportTiers.length < 3 && (
                                    <Button
                                        variant="outlined"
                                        onClick={handleOpenModal}
                                        sx={{ marginTop: 2 }}
                                    >
                                        ADD SUPPORT TIER
                                    </Button>
                                )}
                                <Button
                                    variant="outlined"
                                    component={Link}
                                    to={"/petition/" + id}
                                    sx={{ marginTop: 2 }}
                                >
                                    Back to Petition
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>

                    <Dialog
                        open={openSupporterTierModal}
                        onClose={handleCloseModal}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                    >
                        <DialogTitle id="alert-dialog-title">{"Add Support Tier"}</DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                Please give us information on you petition's support tiers
                            </DialogContentText>
                            <TextField
                                id="support-tier-title"
                                label="Support Tier Tittle"
                                variant="outlined"
                                value={inputtedSupportTierTitle}
                                onChange={(event) => {
                                    setInputtedSupportTierTitle(event.target.value);
                                }}
                                sx={{ marginBottom: 2, marginTop: 2 }}
                            />
                            <TextField
                                id="support-tier-desc"
                                label="Support Tier Description"
                                variant="outlined"
                                value={inputtedSupportTierDescription}
                                onChange={(event) => {
                                    setInputtedSupportTierDescription(event.target.value);
                                }}
                                sx={{ marginBottom: 2 }}
                            />
                            <TextField
                                id="support-tier-cost"
                                label="Support Tier Cost"
                                variant="outlined"
                                value={inputtedSupportTierCost}
                                onChange={(event) => {
                                    setInputtedSupportTierCost(event.target.value);
                                }}
                                onKeyDown={(event) => {
                                    if (
                                        !/[0-9]/.test(event.key) &&
                                        !(event.key === "Backspace" || event.key === "Delete")
                                    ) {
                                        event.preventDefault();
                                    }
                                }}
                                InputProps={{
                                    inputProps: {
                                        min: 0,
                                    },
                                }}
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button
                                onClick={() => {
                                    setInputtedSupportTierTitle("");
                                    setInputtedSupportTierDescription("");
                                    setInputtedSupportTierCost("");
                                    handleCloseModal();
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="outlined"
                                color="success"
                                onClick={() => {
                                    toEdit ? editSupportTier() : addSupportTier();
                                }}
                                autoFocus
                            >
                                Confirm
                            </Button>
                        </DialogActions>
                    </Dialog>
                </>
            ) : (
                <>
                    <NavBar
                        callbackSearchInput={() => {}}
                        searchInput={""}
                        includeSearchBar={false}
                    />
                    <Typography variant={"h3"} sx={{ color: "white", paddingTop: 20 }}>
                        Unauthorized
                    </Typography>
                </>
            )}
        </>
    );
};

export default EditPetition;
