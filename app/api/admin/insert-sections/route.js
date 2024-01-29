import prisma from "@/db/prismaClient";

export async function POST(request) {
    try {
        const requestBody = await request.json();

        const result = await prisma.sections.createMany({
            data: requestBody,
            skipDuplicates: true,
        });

        return new Response(
            JSON.stringify({
                message:
                    result.count > 0
                        ? `Successfully inserted ${result.count} sections.`
                        : "No new sections created.",
                status: 200,
            }),
            {
                status: 200,
                headers: {
                    "Content-Type": "application/json",
                },
            },
        );
    } catch (error) {
        console.error("Error with Prisma operation:", error);
        return new Response(
            JSON.stringify({
                message: "Error in database operation",
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
