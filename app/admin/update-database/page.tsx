"use client";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Alert from "@mui/material/Alert";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import { useState } from "react";

const dbTables = ["Units", "Subsections", "Sections", "Exercises"];
const actionTypes = ["Insert Rows", "Update Row"];

type ActionType = "Insert Rows" | "Update Row";
type TableType = "Units" | "Sections" | "Subsections" | "Exercises";

// prettier-ignore
const routeMapping = {
    "Insert Rows": {
        "Units": "/api/admin/insert-units",
        "Sections": "/api/admin/insert-sections",
        "Subsections": "/api/admin/insert-subsection",
        "Exercises": "/api/admin/insert-exercise"
    },
    "Update Row": {
        "Units": "/api/admin/update-unit",
        "Sections": "/api/admin/update-section",
        "Subsections": "/api/admin/update-subsection",
        "Exercises": "/api/admin/update-exercise"
    },
};

export default function UpdateDBPage() {
    const [statusMessage, setStatusMessage] = useState("");
    const [errorFlag, setErrorFlag] = useState(false);
    const [action, setAction] = useState(actionTypes[0]);
    const [table, setTable] = useState(dbTables[0]);
    const [jsonData, setJsonData] = useState("");

    const handleActionChange = (e: SelectChangeEvent) => {
        setAction(e.target.value);
    };

    const handleDbTableChange = (e: SelectChangeEvent) => {
        setTable(e.target.value);
    };

    const handleSubmit = async () => {
        setErrorFlag(false);
        try {
            let route = routeMapping[action as ActionType][table as TableType];
            console.log(route);
            const requestBody = JSON.parse(jsonData);
            const response = await fetch(route, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestBody),
            });

            const data = await response.json();
            if (data.status !== 200) {
                setErrorFlag(true);
            }
            setStatusMessage(data.message);
            setJsonData("");
        } catch (error: any) {
            setErrorFlag(true);
            setStatusMessage(error.message);
        }
    };

    return (
        <Stack spacing={3}>
            <Box>
                <Typography variant="h3">Update Content Database</Typography>
                <Typography variant="h6" gutterBottom>
                    Choose a database table and action from the dropdowns below.
                    Insert the corresponding JSON to be sent to the database
                    into the text field.
                </Typography>
                <Divider sx={{ borderWidth: "1px" }} />
            </Box>
            <FormControl fullWidth>
                <InputLabel id="action-select-label">Action</InputLabel>
                <Select
                    labelId="action-select-label"
                    value={action}
                    label="Action"
                    onChange={handleActionChange}
                    id="action-select"
                >
                    {actionTypes.map((type) => (
                        <MenuItem key={type} value={type}>
                            {type}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <FormControl fullWidth>
                <InputLabel id="table-select-label">Table</InputLabel>
                <Select
                    id="table-select"
                    labelId="table-select-label"
                    value={table}
                    label="Table"
                    onChange={handleDbTableChange}
                >
                    {dbTables.map((table) => (
                        <MenuItem key={table} value={table}>
                            {table}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <FormControl>
                <TextField
                    id="json-text-field"
                    label="JSON"
                    multiline
                    value={jsonData}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        setJsonData(event.target.value);
                        console.log(jsonData);
                    }}
                ></TextField>
            </FormControl>
            <Button onClick={handleSubmit}>Submit to Database</Button>
            {statusMessage && !errorFlag && (
                <Alert severity="success">{statusMessage}</Alert>
            )}
            {statusMessage && errorFlag && (
                <Alert severity="error">{statusMessage}</Alert>
            )}
        </Stack>
    );
}
