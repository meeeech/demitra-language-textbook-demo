import prisma from "@/db/prisma-client";

export async function POST(request) {
    try {
        const requestBody = await request.json();

        return await prisma.$transaction(async (prisma) => {
            // Update the subsection
            const updatedSubsection = await prisma.subsections.update({
                where: {
                    subsection_id: requestBody.subsection_id,
                },
                data: {
                    title_en: requestBody.title_en,
                    title_frgn: requestBody.title_frgn,
                },
            });

            // Delete all existing page items for the subsection
            await prisma.page_items.deleteMany({
                where: {
                    subsection_id: requestBody.subsection_id,
                },
            });

            // Create new page items
            const pageItemsData = requestBody.page_items?.map((item) => ({
                subsection_id: requestBody.subsection_id,
                order: item.order,
                type: item.type,
                content: item.content, // Assuming content is compatible with the Prisma schema
                title: item.title,
            }));

            if (pageItemsData) {
                await prisma.page_items.createMany({
                    data: pageItemsData,
                    skipDuplicates: true, // Adjust this based on your requirements
                });
            }

            return new Response(
                JSON.stringify({
                    message: "Subsection and Page Items updated successfully",
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
