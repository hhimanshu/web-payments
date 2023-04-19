import React, {useEffect, useState} from 'react';
import './App.css';
import {Box, Button, Card, Stack, Typography} from "@mui/material";
import 'cordova-plugin-purchase';

//const iOSProductId = "pwaInAppPurchasePro9_99"
const productId = "pwa_inapp_pro_9_99"


const DisplayPurchasableProduct = ({
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
const DisplayPurchasedProduct = ({product}: { product: CdvPurchase.Product }) => {
    return <Box px={2}>
        <Card variant="outlined">
            <Stack px={2} py={3} direction="column" alignItems={"flex-start"}>
                <Typography variant={"caption"}
                            color={"grey"}>{"Your Current Plan".toUpperCase()}</Typography>
                <Typography align={"left"} py={2}
                            variant={"h6"}>{product.title.toUpperCase()}</Typography>
            </Stack>
        </Card>
    </Box>
}
const App = () => {
    const {store, ProductType, Platform, LogLevel} = CdvPurchase;
    const [purchasableProducts, setPurchasableProducts] = useState<CdvPurchase.Product[]>([])
    const [productsOwned, setProductsOwned] = useState<Set<CdvPurchase.Product>>()

    const updatePurchases = (receipt: CdvPurchase.Receipt) => {
        let productsOwned = new Set<CdvPurchase.Product>();
        let productIdsOwned = new Set<string>();

        receipt.transactions.forEach(transaction => {
            transaction.products.forEach(trProduct => {
                console.log(`product owned: ${trProduct.id}`);
                const product = store.get(trProduct.id) as CdvPurchase.Product

                productsOwned.add(product)
                productIdsOwned.add(trProduct.id)
            });

            const productsAvailableToPurchase = purchasableProducts.filter(p => !productIdsOwned.has(p.id))
            setProductsOwned(productsOwned)
            setPurchasableProducts(productsAvailableToPurchase)
        });
    }

    const placeOrder = (product: CdvPurchase.Product) => {
        console.log(`placing order for productId=${product.id}`)
        const offer = store.get(product.id, product.platform)?.getOffer();
        offer?.order()
            .then(result => {
                if (result) {
                    console.log("ERROR. Failed to place order. " + result.code + ": " + result.message);
                } else {
                    // todo: update db that the user has purchased item
                    console.log(`${product.title} with ${product.id} ordered successfully`);
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
                    setPurchasableProducts(store.products.filter(p => p.canPurchase))
                });
        })
    }, [LogLevel.DEBUG, Platform.GOOGLE_PLAY, ProductType.NON_CONSUMABLE, store])

    return (
        <div className="App">
            <header className="App-header">
                {productsOwned && <Box>
                    {Array.from(productsOwned.values()).map(p => {
                        return <DisplayPurchasedProduct product={p}/>
                    })}
                </Box>
                }
                {purchasableProducts && <Box>
                    {purchasableProducts
                        .filter(p => p.canPurchase)
                        .map(product => <DisplayPurchasableProduct product={product}
                                                                   onClick={placeOrder}/>)}
                </Box>}
            </header>
        </div>
    );
}

export default App;
