import prisma from "@/db/prismaClient";

export async function POST(request) {
    try {
        const requestBody = await request.json();

        return await prisma.$transaction(async (prisma) => {
            // Update the exercise
            const updatedExercise = await prisma.exercises.update({
                where: {
                    exercise_id: requestBody.exercise_id,
                },
                data: {
                    title: requestBody.title,
                    instructions: requestBody.instructions,
                    example: requestBody.example,
                },
            });

            // Delete all existing questions for the exercise
            await prisma.questions.deleteMany({
                where: {
                    exercise_id: requestBody.exercise_id,
                },
            });

            // Create new questions
            const questionsData = requestBody.questions?.map((question) => ({
                exercise_id: requestBody.exercise_id,
                type: question.type,
                choices: question.choices,
                correct_choice: question.correct_choice,
                question: question.question,
            }));

            if (questionsData) {
                await prisma.questions.createMany({
                    data: questionsData,
                    skipDuplicates: true, // Adjust this based on your requirements
                });
            }

            return new Response(
                JSON.stringify({
                    message: "Exercise and questions updated successfully",
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
                message: "Error in updating data",
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
