"use-client";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Alert from "@mui/material/Alert";
import FormattedText from "@/components/subsection-page/page-item-types/FormattedText";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { useState } from "react";

export default function MultipleChoiceQuestion({
    question,
    index,
    checkedAnswer,
}: {
    question: Question;
    index: number;
    checkedAnswer: boolean;
}) {
    const rightAnswerMessage = "Correct!";
    const wrongAnswerMessage = `Incorrect. Answer = ${question.correct_answer}`;
    const unansweredQuestionMessage = "You did not answer this question.";
    const [value, setValue] = useState("No Answer");
    const checkedAnswerId = `question-${index}-answer-check`;

    const CheckedAnswerMessage = () =>
        value === question.correct_answer ? (
            <Alert severity="success" id={checkedAnswerId}>
                {rightAnswerMessage}
            </Alert>
        ) : value === "No Answer" ? (
            <Alert severity="warning" id={checkedAnswerId}>
                {unansweredQuestionMessage}
            </Alert>
        ) : (
            <Alert severity="error" id={checkedAnswerId}>
                {wrongAnswerMessage}
            </Alert>
        );

    const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue((event.target as HTMLInputElement).value);
    };

    const handleSelectChange = (event: SelectChangeEvent) => {
        setValue(event.target.value);
    };

    return (
        <FormControl>
            <FormLabel id={`question-${index}`}>
                <FormattedText
                    htmlString={`${index + 1}. ${question.question}`}
                />
            </FormLabel>
            {question.mc_control === "select" && (
                <Select
                    value={value}
                    onChange={handleSelectChange}
                    id={`question-${index}-answer-control-select`}
                    aria-labelledby={`question-${index}`}
                    displayEmpty
                >
                    {question.choices?.map((choice) => (
                        <MenuItem value={choice} key={choice}>
                            {choice}
                        </MenuItem>
                    ))}
                </Select>
            )}
            {question.mc_control === "radio" && (
                <RadioGroup
                    aria-labelledby={`question-${index}`}
                    value={value}
                    onChange={handleRadioChange}
                    id={`question-${index}-answer-control-radio`}
                >
                    {question.choices?.map((choice) => (
                        <FormControlLabel
                            value={choice}
                            key={choice}
                            control={<Radio />}
                            label={choice}
                        />
                    ))}
                </RadioGroup>
            )}
            {checkedAnswer && <CheckedAnswerMessage />}
        </FormControl>
    );
}
