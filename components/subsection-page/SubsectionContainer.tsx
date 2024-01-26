"use client";
import Stack from "@mui/material/Stack";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import PrintIcon from "@mui/icons-material/Print";
import Box from "@mui/material/Box";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";

export default function SubsectionContainer({
    children,
}: {
    children: React.ReactNode;
}) {
    let ref = useRef(null);

    const getPageMargins = () => {
        return `{ margin: 48px 48px 48px 48px !important;}`;
    };

    const handlePrint = useReactToPrint({
        content: () => ref.current,
        documentTitle: "subsection",
        pageStyle: getPageMargins,
    });

    return (
        <>
            <Stack spacing={4} ref={ref}>
                {children}
            </Stack>
            <Box
                sx={{
                    height: 320,
                    transform: "translateZ(0px)",
                    flexGrow: 1,
                }}
            >
                <SpeedDial
                    ariaLabel="tools"
                    icon={<SpeedDialIcon />}
                    sx={{ position: "absolute", right: 16 }}
                >
                    <SpeedDialAction
                        onClick={handlePrint}
                        icon={<PrintIcon />}
                        tooltipTitle="Print This Page"
                    ></SpeedDialAction>
                </SpeedDial>
            </Box>
        </>
    );
}
