import prisma from "@/db/prisma-client";

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
                        exercises: {
                            orderBy: {
                                exercise_id: "asc",
                            },
                        },
                    },
                },
            },
        });

        return unit as Unit;
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

        return subsection as Subsection;
    } catch (error) {
        console.error(`Error retrieving subsection: ${error}`);
        return null;
    } finally {
        await prisma.$disconnect();
    }
}

export async function getExerciseById(
    exerciseId: string,
): Promise<Exercise | null> {
    try {
        const exercise = await prisma.exercises.findUnique({
            where: {
                exercise_id: exerciseId,
            },
            include: {
                questions: {
                    orderBy: {
                        question_id: "asc",
                    },
                },
            },
        });

        return exercise as Exercise;
    } catch (error) {
        console.error(`Error retrieving exercise: ${error}`);
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
