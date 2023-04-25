import {Box, Button, Card, Typography} from "@mui/material";
import React from "react";

export const DisplayPurchasableProduct = ({
                                       product,
                                       onClick
                                   }: { product: CdvPurchase.Product, onClick: (product: CdvPurchase.Product) => void }) => {
    const pricing = product.pricing;
    return <Box px={2}>
        <Card variant="outlined">
            <Box px={2} py={3}>
                <Typography
                    variant={"caption"}
                    color={"grey"}
                >
                    {product.title.toUpperCase()}</Typography>
                <Typography py={2}
                            variant={"subtitle1"}>{pricing?.currency} {pricing?.price}</Typography>
                <Button variant={"contained"} onClick={() => onClick(product)} fullWidth>UPGRADE</Button>
            </Box>
        </Card>
    </Box>
}
