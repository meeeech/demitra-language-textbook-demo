import Stack from "@mui/material/Stack";
import { getUnitById } from "@/db/queries";
import Typography from "@mui/material/Typography";
import SectionSummary from "@/components/unit-page/SectionSummary";

export default async function UnitPage({
    params,
}: {
    params: { unit_id: string };
}) {
    const unit = await getUnitById(params.unit_id);

    return unit ? (
        <Stack>
            <Typography
                gutterBottom
                variant="h2"
            >{`${unit.unit_frgn_prefix} ${unit.unit_id}`}</Typography>
            {unit.sections?.map((section) => (
                <SectionSummary key={section.section_id} section={section} />
            ))}
        </Stack>
    ) : (
        // <pre>{JSON.stringify(unit, null, 2)}</pre>
        <h1>Could not retrieve unit</h1>
    );
}
