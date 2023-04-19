import React, {useEffect, useState} from 'react';
import './App.css';
import {Box, Button, Card, Typography} from "@mui/material";
import 'cordova-plugin-purchase';

//const iOSProductId = "pwaInAppPurchasePro9_99"
const productId = "pwa_inapp_pro_9_99"

const DisplayProduct = ({product}: { product: CdvPurchase.Product }) => {
    console.log(`Displaying product => ${JSON.stringify(product)}`)
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
                <Button variant={"contained"} fullWidth>UPGRADE</Button>
            </Box>
        </Card>
    </Box>
}
const App = () => {
    const {store, ProductType, Platform, LogLevel} = CdvPurchase;
    const [products, setProducts] = useState<CdvPurchase.Product[]>([])
    const updatePurchases = (receipt: CdvPurchase.Receipt) => {
        receipt.transactions.forEach(transaction => {
            transaction.products.forEach(trProduct => {
                console.log(`product owned: ${trProduct.id}`);
            });
        });
    }

    const placeOrder = () => {
        store.get("subscription1")?.getOffer()?.order()
            .then(result => {
                if (result) {
                    console.log("ERROR. Failed to place order. " + result.code + ": " + result.message);
                } else {
                    console.log("subscription1 ordered successfully");
                }
            });
    }

    const updateUI = (product: CdvPurchase.Product) => {
        console.log(`- title: ${product.title}`);
        const pricing = product.pricing;
        if (pricing) {
            console.log(`  price: ${pricing.price} ${pricing.currency}`);
        }
    }

    useEffect(() => {
        console.log("Setting up store if this is a mobile device")
        document.addEventListener("deviceready", () => {
            store.verbosity = LogLevel.DEBUG;

            store.register([{
                type: ProductType.NON_CONSUMABLE,
                id: productId,
                platform: Platform.GOOGLE_PLAY,
            }]);

            store.error(e => {
                console.log('error', e);
            });

            /*store.when()
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
                });*/
            store.when()
                .approved(transaction => transaction.verify())
                .verified(receipt => receipt.finish())
                .finished(transaction => console.log('Products owned: ' + transaction.products.map(p => p.id).join(',')))
                .receiptUpdated(r => updatePurchases(r))
                .productUpdated(p => updateUI(p));

            store.ready(() => {
                console.log('ready', store.products);
                //store.order(iOSProductId);
            });

            store.initialize([Platform.GOOGLE_PLAY])
                .then(() => {
                    console.log('store is ready', store.products);
                    setProducts(store.products)
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
                {products && <Box>
                    {products.map(product => <DisplayProduct product={product}/>)}
                </Box>}
            </header>
        </div>
    );
}

export default App;
