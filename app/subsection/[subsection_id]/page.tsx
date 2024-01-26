"use client";
import { getSubsectionById, getSubsectionTitleById } from "@/db/queries";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import PageItem from "@/components/subsection-page/PageItem";
import Button from "@mui/material/Button";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

export default async function SubsectionPage({
    params,
}: {
    params: { subsection_id: string };
}) {
    const subsection = await getSubsectionById(params.subsection_id);

    if (subsection) {
        const {
            subsection_id,
            title_en,
            title_frgn,
            page_items,
            next_subsection,
        } = subsection;

        const nextSubsectionTitle =
            await getSubsectionTitleById(next_subsection);

        return (
            <Stack spacing={4}>
                <Box>
                    <Typography variant="h3">{subsection_id}</Typography>
                    <Divider />
                    <Typography variant="h2">{`${title_en} - ${title_frgn}`}</Typography>
                </Box>
                {page_items?.map((item) => (
                    <PageItem key={item.order} item={item} />
                ))}
                <Button
                    href={`/subsection/${next_subsection}`}
                    endIcon={<ArrowForwardIcon />}
                >{`Next: ${nextSubsectionTitle}`}</Button>
            </Stack>
        );
    } else {
        return <h1>Cannot load subsection</h1>;
    }
}
