import Table from "@mui/material/Table";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import TableHead from "@mui/material/TableHead";
import Paragraph from "./Paragraph";

export default function PlainTable({
    tableContent,
}: {
    tableContent: PlainTable;
}) {
    const columnHeaders = Object.keys(tableContent[0]);
    return (
        <Table>
            <TableHead>
                <TableRow>
                    {columnHeaders.map((col, i) => (
                        <TableCell key={i}>{col.toUpperCase()}</TableCell>
                    ))}
                </TableRow>
            </TableHead>
            <TableBody>
                {tableContent.map((tableRow, i) => (
                    <TableRow key={i}>
                        {Object.values(tableRow).map((cell, i) => (
                            <TableCell key={i}>
                                <Paragraph htmlString={cell} />
                            </TableCell>
                        ))}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
