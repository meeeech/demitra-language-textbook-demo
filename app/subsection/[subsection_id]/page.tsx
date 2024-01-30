import { getSubsectionById } from "@/db/queries";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import PageItem from "@/components/subsection-page/PageItem";
import Button from "@mui/material/Button";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ContentContainer from "@/components/ContentContainer";

export default async function SubsectionPage({
    params,
}: {
    params: { subsection_id: string };
}) {
    const subsection = await getSubsectionById(params.subsection_id);

    if (subsection) {
        const { subsection_id, title_en, title_frgn, page_items } = subsection;

        return (
            <ContentContainer>
                <Box>
                    <Typography variant="h4" component="h2">
                        {subsection_id}
                    </Typography>
                    <Divider />
                    <Typography
                        variant="h3"
                        component="h1"
                    >{`${title_en} ${title_frgn && `- ${title_frgn}`}`}</Typography>
                </Box>
                {page_items?.map((item) => (
                    <PageItem key={item.order} item={item} />
                ))}
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                    }}
                >
                    <Button
                        startIcon={<ArrowBackIcon />}
                        href={`/unit/${subsection_id.split(".")[0]}`}
                    >
                        Back to Unit Overview
                    </Button>
                    <Button
                        endIcon={<ArrowForwardIcon />}
                    >{`Next: (Work in Progress)`}</Button>
                </Box>
            </ContentContainer>
        );
    } else {
        return <h1>Cannot load subsection</h1>;
    }
}
