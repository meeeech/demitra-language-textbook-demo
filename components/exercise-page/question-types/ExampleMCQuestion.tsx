import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Alert from "@mui/material/Alert";
import FormattedText from "@/components/subsection-page/page-item-types/FormattedText";

export default function ExampleMultipleChoiceQuestion({
    example,
}: {
    example: any;
}) {
    return (
        <FormControl>
            <FormLabel id="example-radio-buttons-group">
                <FormattedText htmlString={example.question} />
            </FormLabel>
            <RadioGroup
                aria-labelledby="example-radio-buttons-group"
                value={example.correct_choice}
            >
                {example.choices.map((choice: any) => (
                    <FormControlLabel
                        key={choice}
                        control={<Radio />}
                        label={choice}
                        value={choice}
                        disabled
                    />
                ))}
            </RadioGroup>
            <Alert severity="success">{`Correct! Answer = ${example.correct_choice}`}</Alert>
        </FormControl>
    );
}
