import React from 'react';
import './App.css';
import {Button, Typography} from "@mui/material";


function App() {
  return (
    <div className="App">
      <div>
        <Button variant="contained">
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
