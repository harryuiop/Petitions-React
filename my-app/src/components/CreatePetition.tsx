import { Link, useNavigate, useParams } from "react-router-dom";
import { useUserAuthDetailsContext } from "../utils/userAuthContext";
import {
    Alert,
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
    Snackbar,
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
import React, { useEffect, useState } from "react";
import { CategoryRequest, SupporterTiersCreate } from "petition";
import axios from "axios";
import { API_BASE_URL } from "../config";

const CreatePetition = () => {
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
    const [userPetitionPhoto, setUserPetitionPhoto] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [allCategory, setAllCategory] = useState<CategoryRequest[]>([]);

    const [openSupporterTierModal, setOpenSupporterTierModal] = useState(false);
    const [errorFlag, setErrorFlag] = useState(false);
    const [imageToRemove, setImageToRemove] = useState(false);
    const [photoInputted, setPhotoInputted] = useState(false);
    const [snackbarFailOpen, setSnackbarFailOpen] = useState(false);

    const handleOpenModal = () => setOpenSupporterTierModal(true);
    const handleCloseModal = () => setOpenSupporterTierModal(false);

    if (!userAuth.loggedIn) {
        navigate("/");
    }

    useEffect(() => {
        const fetchAllCategoryIds = async () => {
            try {
                const response = await axios.get(API_BASE_URL + "/petitions/categories");
                setAllCategory(response.data);
            } catch (error: any) {
                setErrorFlag(true);
                setErrorMessage(error.toString());
            }
        };

        fetchAllCategoryIds();
    }, []);

    const handleAddToInputtedSupportTiers = () => {
        setInputtedSupportTiers((prevSupportTiers) => [
            ...prevSupportTiers,
            {
                title: inputtedSupportTierTitle,
                description: inputtedSupportTierDescription,
                cost: parseInt(inputtedSupportTierCost, 10),
            },
        ]);
        handleCloseModal();
        setInputtedSupportTierCost("");
        setInputtedSupportTierTitle("");
        setInputtedSupportTierDescription("");
    };

    const handleDeleteSupportTier = (title: any) => {
        setInputtedSupportTiers((prevSupportTiers) =>
            prevSupportTiers.filter((tier) => tier.title !== title),
        );
    };

    const handleSubmit = async () => {
        try {
            if (!photoInputted) {
                throw new Error("Image must be included");
            }

            if (!inputtedTitle || !inputtedDescription || !inputtedCategoryId) {
                setErrorMessage("Please fill out all fields");
                throw new Error("Please fill out all fields");
            }

            if (inputtedSupportTiers.length < 1) {
                setErrorMessage("Please add a support tier");
                throw new Error("Please add a support tier");
            }

            if (imageToRemove) {
                setImageToRemove(false);
            }

            await axios.post(
                API_BASE_URL + "/petitions",
                {
                    title: inputtedTitle,
                    description: inputtedDescription,
                    categoryId: inputtedCategoryId,
                    supportTiers: inputtedSupportTiers,
                },
                {
                    headers: {
                        "X-Authorization": userAuth.authUser.token,
                    },
                },
            );

            // if (inputtedPetitionPhoto !== "") {
            //     await axios.post(
            //         API_BASE_URL + "/petition/" + id + "/image",
            //         { inputtedPetitionPhoto },
            //         {
            //             headers: {
            //                 "X-Authorization": userAuth.authUser.token,
            //                 "Content-Type": fileType,
            //             },
            //         },
            //     );
            // }

            navigate("/");
        } catch (error: any) {
            setErrorMessage("Invalid information");
            setErrorMessage(error.message);
            setSnackbarFailOpen(true);
        }
    };

    const handleRemoveImage = async () => {
        setImageToRemove(true);
        setPhotoInputted(false);
        setInputtedPetitionPhoto("");
    };

    const handleImageChange = (event: any) => {
        const file = event.target.files[0];
        setFileType(file.type);
        if (file) {
            setInputtedPetitionPhoto(file);
            setPhotoInputted(true);
            const imageUrl = URL.createObjectURL(file);
            setUserPetitionPhoto(imageUrl);
        }
    };

    const handleCategorySelection = (event: SelectChangeEvent) => {
        setInputtedCategoryId(event.target.value);
    };

    return (
        <>
            <Snackbar
                open={snackbarFailOpen}
                autoHideDuration={6000}
                onClose={() => setSnackbarFailOpen(false)}
                message={errorMessage}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
                <Alert
                    onClose={() => setSnackbarFailOpen(false)}
                    severity="error"
                    sx={{ width: "100%" }}
                >
                    {errorMessage}
                </Alert>
            </Snackbar>
            <Typography
                variant="h3"
                color={grey[200]}
                sx={{ paddingTop: 10, paddingBottom: 10, marginRight: 2 }}
            >
                Create Petition
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
                                label="Title"
                                variant="outlined"
                                value={inputtedTitle}
                                onChange={(event) => {
                                    setInputtedTitle(event.target.value);
                                }}
                            />
                        </FormControl>
                        <FormControl fullWidth sx={{ marginBottom: 2 }}>
                            <TextField
                                id="description"
                                label="Description"
                                variant="outlined"
                                value={inputtedDescription}
                                onChange={(event) => {
                                    setInputtedDescription(event.target.value);
                                }}
                                multiline
                                rows={4}
                            />
                        </FormControl>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Category</InputLabel>
                            <Select
                                labelId="category-id"
                                id="category-id"
                                value={inputtedCategoryId}
                                label="Category"
                                onChange={handleCategorySelection}
                            >
                                {allCategory.map((category: CategoryRequest) => (
                                    <MenuItem key={category.categoryId} value={category.categoryId}>
                                        {category.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        {inputtedPetitionPhoto === "" ? (
                            <Button variant="outlined" component="label" sx={{ marginTop: 2 }}>
                                UPLOAD PROFILE IMAGE
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    hidden
                                />
                            </Button>
                        ) : (
                            <>
                                <Button
                                    variant="outlined"
                                    onClick={handleRemoveImage}
                                    sx={{ marginTop: 2, marginBottom: 1 }}
                                >
                                    REMOVE PETITION IMAGE
                                </Button>
                                <Typography
                                    variant="body2"
                                    sx={{ color: green[400], marginTop: 0, paddingBottom: 2 }}
                                >
                                    Image uploaded successfully!
                                </Typography>
                            </>
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
                                Create
                            </Button>
                            <Button component={Link} to={"/"} variant="outlined" color="error">
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
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {inputtedSupportTiers.map((supportTier) => (
                                        <TableRow key={supportTier.title}>
                                            <TableCell>{supportTier.title}</TableCell>
                                            <TableCell>{supportTier.description}</TableCell>
                                            <TableCell>{supportTier.cost}</TableCell>
                                            <TableCell>
                                                <Button
                                                    onClick={() =>
                                                        handleDeleteSupportTier(supportTier.title)
                                                    }
                                                >
                                                    Delete
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
                        onClick={handleAddToInputtedSupportTiers}
                        autoFocus
                    >
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default CreatePetition;
