import Table from "@mui/material/Table";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import FormattedText from "./FormattedText";
import AudioButton from "../AudioButton";
import TableBody from "@mui/material/TableBody";

export default function AudioTable({
    tableContent,
}: {
    tableContent: AudioTable;
}) {
    return (
        <Table>
            <TableBody>
                {tableContent.map((tableRow, i) => (
                    <TableRow key={i}>
                        <TableCell>
                            <AudioButton audioUrl={tableRow.audio_file} />
                        </TableCell>
                        <TableCell>
                            <FormattedText htmlString={tableRow.text_frgn} />
                        </TableCell>
                        <TableCell>
                            <FormattedText htmlString={tableRow.text_en} />
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
