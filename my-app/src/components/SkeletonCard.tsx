import React from "react";
import { Card, CardContent, Skeleton, Box } from "@mui/material";

const SkeletonCard = () => {
    return (
        <Card sx={{ display: "flex", maxWidth: 900, minWidth: 800, minHeight: 200 }}>
            <Box sx={{ display: "flex", flexDirection: "column", flex: "1 0 auto" }}>
                <CardContent>
                    <Skeleton animation="wave" height={30} width="60%" />
                    <Skeleton animation="wave" height={20} width="40%" />
                    <Skeleton animation="wave" height={20} width="30%" />
                    <Skeleton animation="wave" height={20} width="20%" />
                </CardContent>
            </Box>
            <Skeleton animation="wave" variant="rectangular" sx={{ width: 200, height: 200 }} />
        </Card>
    );
};

export default SkeletonCard;
