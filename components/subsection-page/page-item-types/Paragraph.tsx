"use client";
import Typography from "@mui/material/Typography";
import parse from "html-react-parser";
import "@/styles/text.css";

export default function Paragraph({ htmlString }: { htmlString: string }) {
    return <Typography>{parse(htmlString)}</Typography>;
}
