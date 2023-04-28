import React, {useEffect, useState} from 'react';
import './App.css';
import {Box} from "@mui/material";
import 'cordova-plugin-purchase';
import {DisplayPurchasedProduct} from "./store/DisplayPurchasedProduct";
import {DisplayPurchasableProduct} from "./store/DisplayPurchasableProduct";
import {Capacitor} from '@capacitor/core';
import WebPaymentCard from "./components/WebPaymentCard";
import {openAppStore, shouldAppUpdate} from "./app-update/update";
import AppUpdateDialog from "./components/AppUpdateDialog";

const productId = "pwa_inapp_pro_9_99"

const App = () => {
    const {store, ProductType, Platform, LogLevel} = CdvPurchase;
    const [purchasableProducts, setPurchasableProducts] = useState<CdvPurchase.Product[]>([])
    const [productsOwned, setProductsOwned] = useState<Set<CdvPurchase.Product>>()
    const [showAppUpdateDialog, setShowAppUpdateDialog] = useState<boolean>(false)

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

    const placeOrderOnNativeStore = (product: CdvPurchase.Product) => {
        console.log(`placing order for productId=${product.id}`)
        const offer = store.get(product.id, product.platform)?.getOffer();
        offer?.order()
            .then(result => {
                if (result) {
                    console.log("ERROR. Failed to place order. " + result.code + ": " + result.message);
                    // todo: show a pop-up to where they can submit a form to get contacted by us to collect payment.
                } else {
                    // todo: update db that the user has purchased item
                    console.log(`${product.title} with ${product.id} ordered successfully`);
                }
            })
    }

    const updateUI = (product: CdvPurchase.Product) => {
        console.log(`- title: ${product.title}`);
        const pricing = product.pricing;
        if (pricing) {
            console.log(`  price: ${pricing.price} ${pricing.currency}`);
        }
    }

    useEffect(() => {
        const checkForUpdates = async () => {
            if (await shouldAppUpdate()) {
                console.log(`App update needed, show dialog`)
                setShowAppUpdateDialog(true);
            }
        }
        if (Capacitor.isNativePlatform()) {
            console.log("Checking for app updates")
            checkForUpdates()
                .catch((e) => console.error("Error in checking updates", e))
        }
    }, [])

    useEffect(() => {
        console.log(`Native App store version: ${store.version}`)
        if (!Capacitor.isNativePlatform()) {
            console.log(`This is not a native platform, returning`)
            return
        }
        document.addEventListener("deviceready", () => {
            store.verbosity = LogLevel.DEBUG;

            store.register([
                {
                    type: ProductType.NON_CONSUMABLE,
                    id: productId,
                    platform: Platform.GOOGLE_PLAY,
                },
                {
                    type: ProductType.NON_CONSUMABLE,
                    id: productId,
                    platform: Platform.APPLE_APPSTORE,
                }
            ]);

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
            });

            store.initialize([Platform.GOOGLE_PLAY, Platform.APPLE_APPSTORE])
                .then(() => {
                    console.log('store is ready', store.products);
                    setPurchasableProducts(store.products.filter(p => p.canPurchase))
                });
        })
    }, [LogLevel.DEBUG, Platform.GOOGLE_PLAY, Platform.APPLE_APPSTORE, ProductType.NON_CONSUMABLE, store])

    return (
        <div className="App">
            <header className="App-header">
                {!showAppUpdateDialog && <Box>
                    {Capacitor.isNativePlatform() && productsOwned && <Box>
                        {Array.from(productsOwned.values()).map(p => {
                            return <DisplayPurchasedProduct product={p}/>
                        })}
                    </Box>
                    }
                    {purchasableProducts && <Box>
                        {purchasableProducts
                            .filter(p => p.canPurchase)
                            .map(product => <DisplayPurchasableProduct product={product}
                                                                       onClick={placeOrderOnNativeStore}/>)}
                    </Box>}
                </Box>
                }
                {!Capacitor.isNativePlatform() &&
                    <WebPaymentCard onClick={() => console.log("Sending to stripe")}/>}
                {showAppUpdateDialog && <AppUpdateDialog onLater={() => console.log("Later")}
                                                         onDownload={openAppStore}/>}
            </header>
        </div>
    );
}

export default App;
