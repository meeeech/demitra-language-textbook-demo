"use client";
import { createTheme } from "@mui/material/styles";
import { Quicksand } from "next/font/google";

const quicksand = Quicksand({ subsets: ["latin"] });

export const darkTheme = createTheme({
    palette: {
        mode: "dark",
    },
    typography: {
        fontFamily: quicksand.style.fontFamily,
    },
});
