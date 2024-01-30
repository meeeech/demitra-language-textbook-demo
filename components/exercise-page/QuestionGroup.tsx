"use client";
import { useState } from "react";
import MultipleChoiceQuestion from "./question-types/MultipleChoiceQuestion";
import Button from "@mui/material/Button";

export default function QuestionGroup({
    questions,
}: {
    questions: Array<Question>;
}) {
    const [checkedAnswers, setCheckedAnswers] = useState(false);
    return (
        <>
            {questions.map((question, i) => (
                <MultipleChoiceQuestion
                    key={i}
                    question={question}
                    checkedAnswer={checkedAnswers}
                    index={i}
                />
            ))}
            <Button onClick={() => setCheckedAnswers(true)}>
                Check Answers
            </Button>
        </>
    );
}
