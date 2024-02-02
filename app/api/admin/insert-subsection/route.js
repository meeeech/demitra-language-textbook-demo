import prisma from "@/db/prisma-client";

export async function POST(request) {
    try {
        const requestBody = await request.json();

        return await prisma.$transaction(async (prisma) => {
            // Insert into subsections table
            const result = await prisma.subsections.create({
                data: {
                    subsection_id: requestBody.subsection_id,
                    title_en: requestBody.title_en,
                    title_frgn: requestBody.title_frgn,
                    section_id: requestBody.section_id,
                },
            });

            // Insert into page_items table
            const pageItemsData = requestBody.page_items?.map((item) => {
                return {
                    subsection_id: requestBody.subsection_id,
                    order: item.order,
                    type: item.type,
                    content: item.content,
                    title: item.title,
                };
            });

            if (pageItemsData) {
                await prisma.page_items.createMany({
                    data: pageItemsData,
                    skipDuplicates: true,
                });
            }

            return new Response(
                JSON.stringify({
                    message: "Subsection and Page Items inserted successfully",
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
