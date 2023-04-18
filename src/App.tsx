import React from 'react';
import './App.css';
import {Box, Button, Typography} from "@mui/material";

const App = () => {
    const btnHandler = () => alert('Processing ...')
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
