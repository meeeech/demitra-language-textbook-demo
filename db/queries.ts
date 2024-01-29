import prisma from "@/db/prismaClient";

export async function getAllUnits(): Promise<Array<Unit>> {
    try {
        const units = await prisma.units.findMany();
        return units;
    } catch (error) {
        console.error("Error fetching units:", error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

export async function getUnitById(unitId: string): Promise<Unit | null> {
    try {
        const unit = await prisma.units.findUnique({
            where: {
                unit_id: unitId,
            },
            include: {
                sections: {
                    orderBy: {
                        section_id: "asc",
                    },
                    include: {
                        subsections: {
                            orderBy: {
                                subsection_id: "asc",
                            },
                        },
                    },
                },
            },
        });

        return unit;
    } catch (error) {
        console.error("Error fetching unit:", error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

export async function getSubsectionById(
    subsectionId: string,
): Promise<Subsection | null> {
    try {
        const subsection = await prisma.subsections.findUnique({
            where: {
                subsection_id: subsectionId,
            },
            include: {
                page_items: {
                    orderBy: {
                        order: "asc",
                    },
                },
            },
        });

        if (subsection) {
            const transformedSubsection: Subsection = {
                ...subsection,
                page_items: subsection.page_items.map((item) => ({
                    order: item.order,
                    type: item.type as PageItemType,
                    title: item.title ?? undefined,
                    content: item.content as
                        | string
                        | AudioTableRow[]
                        | PlainTable,
                })),
            };

            return transformedSubsection;
        }
        return null;
    } catch (error) {
        console.error(`Error retrieving subsection: ${error}`);
        return null;
    } finally {
        await prisma.$disconnect();
    }
}

export async function getSubsectionTitleById(
    subsectionId: string,
): Promise<string | null> {
    try {
        const subsection = await prisma.subsections.findUnique({
            where: {
                subsection_id: subsectionId,
            },
            select: {
                title_en: true,
            },
        });

        return subsection?.title_en || "[Section Title]";
    } catch (error) {
        console.error(`Error fetching subsection title: ${error}`);
        return null;
    } finally {
        await prisma.$disconnect();
    }
}
