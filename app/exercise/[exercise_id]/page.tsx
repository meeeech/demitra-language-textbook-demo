import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import ContentContainer from "@/components/ContentContainer";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import ExampleMultipleChoiceQuestion from "@/components/exercise-page/question-types/ExampleMCQuestion";
import QuestionGroup from "@/components/exercise-page/QuestionGroup";
import { getExerciseById } from "@/db/queries";
import FormattedText from "@/components/subsection-page/page-item-types/FormattedText";

export default async function ExercisePage({
    params,
}: {
    params: { exercise_id: string };
}) {
    const exercise = await getExerciseById(params.exercise_id);
    if (exercise) {
        const { title, instructions, example, questions, exercise_id } =
            exercise;
        return (
            <ContentContainer>
                <Box>
                    <Typography variant="h4" component="h2">
                        {`Exercise ${exercise_id.split(".")[2].toUpperCase()}`}
                    </Typography>
                    <Divider />
                    <Typography variant="h4" component="h1">
                        {title}
                    </Typography>
                </Box>
                <Card raised>
                    <CardContent>
                        <Typography sx={{ fontSize: 24 }} gutterBottom>
                            Instructions
                        </Typography>
                        <Typography variant="h6">
                            <FormattedText htmlString={instructions} />
                        </Typography>
                    </CardContent>
                </Card>
                <Card raised>
                    <CardContent>
                        <Typography sx={{ fontSize: 24 }} gutterBottom>
                            Example
                        </Typography>
                        <ExampleMultipleChoiceQuestion example={example} />
                    </CardContent>
                </Card>
                <QuestionGroup questions={questions ?? []} />
            </ContentContainer>
        );
    } else {
        return <h1>Could not retrieve exercise.</h1>;
    }
}
