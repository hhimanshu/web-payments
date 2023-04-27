import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

interface WebPaymentCardProps {
    onClick: () => void
}

export default function WebPaymentCard({onClick}: WebPaymentCardProps) {
    return (
        <Card sx={{minWidth: 275, maxWidth: "70%"}}>
            <CardContent>
                <Typography sx={{fontSize: 14}} color="text.secondary" gutterBottom>
                    WEB PAYMENT SUPPORTED
                </Typography>
                <Typography variant="h5" component="div">
                    $12.99
                </Typography>
                <Typography sx={{mb: 1.5}} color="text.secondary">
                    collected via Stripe
                </Typography>
                <Typography variant="body2">
                    You will be redirected to a secure site for the payment
                </Typography>
            </CardContent>
            <CardActions sx={{mb: 0.3}}>
                <Button fullWidth
                        variant={"contained"}
                        size="small"
                        onClick={onClick}
                >PAY NOW</Button>
            </CardActions>
        </Card>
    );
}
