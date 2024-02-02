import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Alert from "@mui/material/Alert";
import FormattedText from "@/components/subsection-page/page-item-types/FormattedText";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

export default function ExampleMultipleChoiceQuestion({
    example,
    control,
}: {
    example: any;
    control: string;
}) {
    return (
        <FormControl>
            <FormLabel id="example-question">
                <FormattedText htmlString={example.question} />
            </FormLabel>
            {control === "radio" && (
                <RadioGroup
                    aria-labelledby="example-question-answer-control-radio"
                    value={example.correct_answer}
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
            )}
            {control === "select" && (
                <>
                    <Select
                        aria-labelledby="example-question-answer-control-select"
                        disabled
                        value={example.correct_answer}
                    >
                        <MenuItem value={example.correct_answer}>
                            {example.correct_answer}
                        </MenuItem>
                    </Select>
                    {example.choices.map((choice: any) => (
                        <MenuItem value={choice} key={choice}>
                            {choice}
                        </MenuItem>
                    ))}
                </>
            )}
            <Alert severity="success">{`Correct! Answer = ${example.correct_answer}`}</Alert>
        </FormControl>
    );
}
