import prisma from "@/db/prismaClient";

export async function POST(request) {
    try {
        const requestBody = await request.json();

        return await prisma.$transaction(async (prisma) => {
            // Insert into exercise table
            const result = await prisma.exercises.create({
                data: {
                    exercise_id: requestBody.exercise_id,
                    title: requestBody.title,
                    instructions: requestBody.instructions,
                    example: requestBody.example,
                    section_id: requestBody.section_id,
                },
            });

            // Insert into questions table
            const questionsData = requestBody.questions?.map((question) => {
                return {
                    exercise_id: requestBody.exercise_id,
                    type: question.type,
                    choices: question.choices,
                    correct_choice: question.correct_choice,
                    question: question.question,
                };
            });

            if (questionsData) {
                await prisma.questions.createMany({
                    data: questionsData,
                    skipDuplicates: true,
                });
            }

            return new Response(
                JSON.stringify({
                    message: "Exercise and Questions inserted successfully",
                    status: 200,
                }),
                {
                    status: 200,
                    headers: {
                        "Content-Type": "application/json",
                    },
                },
            );
        });
    } catch (error) {
        console.error("Error in API operation:", error);
        return new Response(
            JSON.stringify({
                message: "Error in inserting data",
                error: error.message,
                status: 500,
            }),
            {
                status: 500,
                headers: {
                    "Content-Type": "application/json",
                },
            },
        );
    }
}
