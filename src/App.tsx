import React, {useEffect} from 'react';
import './App.css';
import {Box, Button, Typography} from "@mui/material";
import 'cordova-plugin-purchase';

//const iOSProductId = "pwaInAppPurchasePro9_99"
const productId = "pwa_inapp_pro_9_99"
const App = () => {
    useEffect(() => {
        console.log("Setting up store if this is a mobile device")
        document.addEventListener("deviceready", () => {
            alert("The mobile device is ready")
            const {store, ProductType, Platform, LogLevel} = CdvPurchase;

            store.verbosity = LogLevel.DEBUG;

            store.register([{
                type: ProductType.NON_CONSUMABLE,
                id: productId,
                platform: Platform.GOOGLE_PLAY,
            }]);

            store.error(e => {
                console.log('error', e);
            });

            store.when()
                .productUpdated(() => {
                    console.log('product updated');
                })
                .approved(value => {
                    console.log('approved', value);
                })
                .verified(value => {
                    console.log('verified', value);
                })
                .finished(value => {
                    console.log('finished', value);
                });

            store.ready(() => {
                console.log('ready', store.products);
                //store.order(iOSProductId);
            });

            store.initialize([Platform.GOOGLE_PLAY])
                .then(() => {
                    console.log('initialize resolved', store.products);
                    //store.order('my-product-id');
                });
        }, {once: true})
    }, [])
    const btnHandler = () => {
        console.log("Processing button click.")

    }
    return (
        <div className="App">
            <header className="App-header">
                <Box>
                    <Typography
                        fontWeight={"medium"}
                        color={'black'}
                        pb={1}
                    >Total: $1.00</Typography>
                    <Button variant={"contained"} onClick={btnHandler}>
                        <Typography>UPGRADE</Typography>
                    </Button>
                </Box>
            </header>
        </div>
    );
}

export default App;
