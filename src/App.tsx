import React from 'react';
import './App.css';
import {Button, Typography} from "@mui/material";

const allowedCardNetworks = ["AMEX", "DISCOVER", "INTERAC", "JCB", "MASTERCARD", "VISA"];
const allowedCardAuthMethods = ["PAN_ONLY", "CRYPTOGRAM_3DS"];

const getGooglePaymentsConfiguration = () => {
    return {
        environment: 'TEST',
        apiVersion: 2,
        apiVersionMinor: 0,
        merchantInfo: {
            // A merchant ID is available after approval by Google.
            // 'merchantId':'12345678901234567890',
            merchantName: 'Example Merchant'
        },
        allowedPaymentMethods: [{
            type: 'CARD',
            parameters: {
                allowedAuthMethods: allowedCardAuthMethods,
                allowedCardNetworks: allowedCardNetworks//.map(network => network.toLowerCase())
            },
            tokenizationSpecification: {
                type: 'PAYMENT_GATEWAY',
                // Check with your payment gateway on the parameters to pass.
                // @see {@link https://developers.google.com/pay/api/web/reference/request-objects#gateway}
                parameters: {
                    'gateway': 'example',
                    'gatewayMerchantId': 'exampleGatewayMerchantId'
                }
            }
        }]
    };
}

const createPaymentRequest = () => {
    // Add support for the Google Pay API.
    const methodData = [
        {
            supportedMethods: 'https://google.com/pay',
            data: getGooglePaymentsConfiguration()
        },
        {
            supportedMethods: 'basic-card',
            data: getGooglePaymentsConfiguration()
        }
    ]

    const details = {
        total: {label: 'Test Purchase', amount: {currency: 'USD', value: '99.00'}}
    };

    const options = {
        requestPayerEmail: true,
        requestPayerName: true
    };

    return new PaymentRequest(methodData, details);
}

const App = () => {
    const handlePaymentFlow = () => {
        const request = createPaymentRequest()

        if (!request.canMakePayment()) {
            alert("Browser does not support payment")
            console.error("The browser does not support making payments, use other strategy")
            return;
        }

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
