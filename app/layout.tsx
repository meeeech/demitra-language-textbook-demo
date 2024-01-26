import type { Metadata } from "next";
import { ThemeProvider } from "@mui/material/styles";
import { darkTheme } from "@/styles/darkTheme";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";

export const metadata: Metadata = {
    title: "Intermatik 2",
    description: "An interactive German grammar review",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body>
                <ThemeProvider theme={darkTheme}>
                    <CssBaseline />
                    <div
                        style={{
                            marginTop: "75px",
                            padding: "0px 48px 0px 48px",
                        }}
                    >
                        {children}
                    </div>
                </ThemeProvider>
            </body>
        </html>
    );
}
