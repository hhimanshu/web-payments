import React from 'react';
import './App.css';
import {Button, Typography} from "@mui/material";


const buildSupportedPaymentMethodData = () => {
    // Example supported payment methods:
     //return [{supportedMethods: "https://pay.google.com"}];
    return [{supportedMethods: "https://bobbucks.dev/pay"}];
}

const buildShoppingCartDetails = () => {
    // Hardcoded for demo purposes:
    return {
        id: "order-123",
        displayItems: [
            {
                label: "Example item",
                amount: {currency: "USD", value: "1.00"},
            },
        ],
        total: {
            label: "Total",
            amount: {currency: "USD", value: "1.00"},
        },
    };
}

const App = () => {
    const handlePaymentFlow = () => {
        const request = new PaymentRequest(
            buildSupportedPaymentMethodData(),
            buildShoppingCartDetails()
        );

        request.show().then((paymentResponse) => {
            // Here we would process the payment. For this demo, simulate immediate success:
            paymentResponse.complete("success").then(() => {
                // For demo purposes:
                //introPanel.style.display = "none";
                //successPanel.style.display = "block";
            });
            console.log(paymentResponse)
        });
    }

    return (
        <div className="App">
            <div>
                <Button variant="contained" onClick={handlePaymentFlow}>
                    <Typography fontFamily={"Source Sans Pro"}
                                variant={"subtitle2"}
                                fontWeight={"bold"}
                    >Pay $10</Typography>
                </Button>
            </div>
        </div>
    );
}

export default App;
