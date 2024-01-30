import { getAllUnits } from "@/db/queries";
import UnitCard from "@/components/home-page/UnitCard";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

export default async function Home() {
    const units = await getAllUnits();

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Typography variant="h2" component="h1">
                    Zuzuzurren
                </Typography>
            </Grid>
            {units.length > 0 ? (
                units.map((unit) => <UnitCard unit={unit} key={unit.unit_id} />)
            ) : (
                <Grid item>
                    <h1>No units found.</h1>
                </Grid>
            )}
        </Grid>
    );
}
