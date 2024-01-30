import AudioTable from "./page-item-types/AudioTable";
import FormattedText from "./page-item-types/FormattedText";
import PlainTable from "./page-item-types/PlainTable";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export default function PageItem({ item }: { item: PageItem }) {
    let content;
    switch (item.type as string) {
        case "formatted_text":
            content = <FormattedText htmlString={item.content as string} />;
            break;
        case "audio_table":
            content = <AudioTable tableContent={item.content as AudioTable} />;
            break;
        case "plain_table":
            content = <PlainTable tableContent={item.content as PlainTable} />;
            break;
        default:
            content = <pre>{JSON.stringify(item.content, null, 2)}</pre>;
    }

    return item.title ? (
        <Box>
            <Typography variant="h6">{item.title}</Typography>
            {content}
        </Box>
    ) : (
        content
    );
}
