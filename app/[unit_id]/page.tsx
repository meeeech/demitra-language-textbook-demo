import Stack from "@mui/material/Stack";
import { getUnitById } from "@/db/queries";
import Typography from "@mui/material/Typography";
import SectionSummary from "@/components/unit-page/SectionSummary";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import HomeIcon from "@mui/icons-material/Home";

export default async function UnitPage({
    params,
}: {
    params: { unit_id: string };
}) {
    const unit = await getUnitById(params.unit_id);

    return unit ? (
        <Stack spacing={4}>
            <Box>
                <Typography
                    gutterBottom
                    variant="h2"
                >{`${unit.unit_frgn_prefix} ${unit.unit_id}`}</Typography>
            </Box>
            <Box>
                {unit.sections?.map((section) => (
                    <SectionSummary
                        key={section.section_id}
                        section={section}
                    />
                ))}
            </Box>
            <Button href="/" endIcon={<HomeIcon />}>
                Go Home
            </Button>
        </Stack>
    ) : (
        // <pre>{JSON.stringify(unit, null, 2)}</pre>
        <h1>Could not retrieve unit</h1>
    );
}
