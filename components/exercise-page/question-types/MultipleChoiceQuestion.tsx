"use-client";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Alert from "@mui/material/Alert";
import FormattedText from "@/components/subsection-page/page-item-types/FormattedText";
import Box from "@mui/material/Box";
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
    const rightAnswerMessage = "Correct.";
    const wrongAnswerMessage = `Incorrect. Correct answer: ${question.correct_choice}`;
    const unansweredQuestionMessage = "You did not answer this question.";
    const [value, setValue] = useState("No Answer");
    const checkedAnswerId = `question-${index}-answer-check`;

    const CheckedAnswerMessage = () =>
        value === question.correct_choice ? (
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

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue((event.target as HTMLInputElement).value);
    };

    return (
        <FormControl>
            <FormLabel id={`question-${index}-radio-buttons-group`}>
                <FormattedText
                    htmlString={`${index + 1}. ${question.question}`}
                />
            </FormLabel>
            <RadioGroup
                aria-labelledby={`question-${index}-radio-buttons-group`}
                value={value}
                onChange={handleChange}
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
            {checkedAnswer && <CheckedAnswerMessage />}
        </FormControl>
    );
}
