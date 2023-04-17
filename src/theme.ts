
import {createTheme} from "@mui/material/styles";

export const theme = createTheme();

export const customTheme = createTheme({
    typography: {
        fontFamily: "Source Sans Pro"
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                "@font-face": {
                    fontFamily: "Source Sans Pro"
                },
            }
        }
    },
    palette: {
        primary: {
            main: "#4C42E8",
            light: "#E2DFFF",
            dark: "#0E006A",
            contrastText: "#FFFFFF",
        },
        secondary: {
            main: "#5D5C71",
            light: "#E3E0F9",
            dark: "#1A1A2C",
            contrastText: "#FFFFFF",
        },
        error: {
            main: "#BA1A1A",
            light: "#FFDAD6",
            dark: "#410002",
            contrastText: "#FFFFFF",
        },
        background: {
            default: "#FFFFFF",
        },
    },
});
