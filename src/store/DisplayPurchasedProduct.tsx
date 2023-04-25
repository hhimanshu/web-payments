import {Box, Card, Stack, Typography} from "@mui/material";
import WorkspacePremiumRoundedIcon from "@mui/icons-material/WorkspacePremiumRounded";
import React from "react";

export const DisplayPurchasedProduct = ({product}: { product: CdvPurchase.Product }) => {
    return <Box px={2}>
        <Card variant="outlined" style={{borderColor: "blue"}}>
            <Stack px={2} py={3} direction="column" alignItems={"flex-start"}>
                <Stack direction={"row"} spacing={1} alignItems={"center"}>
                    <WorkspacePremiumRoundedIcon color={"primary"} fontSize={"medium"}/>
                    <Typography variant={"caption"}
                                color={"grey"}>{"Your Current Plan".toUpperCase()}</Typography>
                </Stack>
                <Typography align={"left"} py={2}
                            variant={"subtitle2"}>{product.title.toUpperCase()}</Typography>
            </Stack>
        </Card>
    </Box>
}
