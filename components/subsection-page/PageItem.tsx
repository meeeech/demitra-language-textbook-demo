"use client";
import AudioTable from "./page-item-types/AudioTable";
import Paragraph from "./page-item-types/Paragraph";
import PlainTable from "./page-item-types/PlainTable";
import Box from "@mui/material/Box";

export default function PageItem({ item }: { item: PageItem }) {
    let content;
    switch (item.type as string) {
        case "paragraph":
            content = <Paragraph htmlString={item.content as string} />;
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

    return <Box>{content}</Box>;
}
