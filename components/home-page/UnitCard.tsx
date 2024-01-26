import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

export default function UnitCard({ unit }: { unit: Unit }) {
    return (
        <Grid item xs={4}>
            <Card>
                <CardContent>
                    <Typography sx={{ fontSize: 16 }} gutterBottom>
                        {`${unit.unit_frgn_prefix} ${unit.unit_id}`}
                    </Typography>
                    <Typography variant="h5">{unit.title}</Typography>
                </CardContent>
                <CardActions>
                    <Button
                        href={`/${unit.unit_id}`}
                    >{`Open Unit ${unit.unit_id}`}</Button>
                </CardActions>
            </Card>
        </Grid>
    );
}
