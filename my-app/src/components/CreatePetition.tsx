import { Link, useNavigate, useParams } from "react-router-dom";
import { useUserAuthDetailsContext } from "../utils/userAuthContext";
import { Box, Button, TextField, Typography } from "@mui/material";
import { green, grey } from "@mui/material/colors";
import React, { useState } from "react";
import { SupporterTiersCreate } from "petition";

const CreatePetition = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const userAuth = useUserAuthDetailsContext();

    const [inputtedTitle, setInputtedTitle] = useState("");
    const [inputtedDescription, setInputtedDescription] = useState("");
    const [inputtedCategoryId, setInputtedCategoryId] = useState("");
    const [inputtedSupportTiers, setInputtedSupportTiers] = useState<SupporterTiersCreate[]>([]);
    const [inputtedPetitionPhoto, setInputtedPetitionPhoto] = useState("");
    const [fileType, setFileType] = useState("");
    const [userPetitionPhoto, setUserPetitionPhoto] = useState("");

    const [imageToRemove, setImageToRemove] = useState(false);
    const [photoInputted, setPhotoInputted] = useState(false);

    if (userAuth.loggedIn) {
        navigate("/");
    }

    const handleSubmit = () => {};

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

    return (
        <>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: "70vh",
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        maxWidth: 500,
                        padding: 3,
                        minWidth: 100,
                    }}
                >
                    <Typography
                        variant="h3"
                        color={grey[200]}
                        sx={{ paddingTop: 3, paddingBottom: 4, marginRight: 2 }}
                    >
                        Create Petition
                    </Typography>

                    <TextField
                        id="title"
                        label="Title"
                        variant="outlined"
                        value={inputtedTitle}
                        onChange={(event) => {
                            setInputtedTitle(event.target.value);
                        }}
                        sx={{ marginBottom: 2 }}
                    />
                    <TextField
                        id="description"
                        label="Description"
                        variant="outlined"
                        value={inputtedDescription}
                        onChange={(event) => {
                            setInputtedDescription(event.target.value);
                        }}
                        sx={{ marginBottom: 2 }}
                    />
                    <Button component="span" sx={{ marginBottom: 1 }} onClick={handleRemoveImage}>
                        Remove your profile image
                    </Button>
                    <input
                        accept="image/*"
                        className="imageInput"
                        style={{ display: "none" }}
                        id="raised-button-file"
                        type="file"
                        onChange={handleImageChange}
                    />

                    {/* ToDo: Finish the photo implementation */}
                    <label htmlFor="raised-button-file">
                        <Button component="span" className="imageInput" sx={{ marginBottom: 2 }}>
                            {!photoInputted ? "Upload profile image" : "Change uploaded image"}
                        </Button>
                    </label>
                    {photoInputted && (
                        <Typography
                            variant="body2"
                            sx={{ color: green[400], marginTop: 0, paddingBottom: 2 }}
                        >
                            Image uploaded successfully!
                        </Typography>
                    )}
                    <Button variant="outlined" color="success" onClick={handleSubmit}>
                        Create
                    </Button>
                    <Typography variant="body1" sx={{ marginTop: 2 }}>
                        <Link to={"/"} style={{ color: grey[200], textDecoration: "underline" }}>
                            Don't want to register? Return Home
                        </Link>
                    </Typography>
                    <Typography variant="body1" sx={{ marginTop: 2 }}>
                        <Link
                            to={"/signin"}
                            style={{ color: grey[200], textDecoration: "underline" }}
                        >
                            Have an account? Return to sign in
                        </Link>
                    </Typography>
                    <input
                        accept="image/*"
                        className={"imageInput"}
                        style={{ display: "none" }}
                        id="raised-button-file"
                        multiple
                        type="file"
                    />
                </Box>
            </Box>
        </>
    );
};

export default CreatePetition;
