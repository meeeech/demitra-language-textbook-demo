-- CreateEnum
CREATE TYPE "page_item_type" AS ENUM ('paragraph', 'audio_table', 'plain_table', 'text');

-- CreateTable
CREATE TABLE "page_items" (
    "page_item_id" BIGSERIAL NOT NULL,
    "subsection_id" TEXT NOT NULL,
    "order" SMALLINT NOT NULL,
    "content" JSON NOT NULL,
    "type" "page_item_type" NOT NULL,
    "title" TEXT,

    CONSTRAINT "page_items_pkey" PRIMARY KEY ("page_item_id")
);

-- CreateTable
CREATE TABLE "sections" (
    "section_id" TEXT NOT NULL,
    "unit_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "section_pkey" PRIMARY KEY ("section_id")
);

-- CreateTable
CREATE TABLE "subsections" (
    "subsection_id" TEXT NOT NULL,
    "section_id" TEXT NOT NULL,
    "title_en" TEXT NOT NULL,
    "title_frgn" TEXT NOT NULL,

    CONSTRAINT "subsection_pkey" PRIMARY KEY ("subsection_id")
);

-- CreateTable
CREATE TABLE "units" (
    "unit_id" TEXT NOT NULL,
    "title" TEXT NOT NULL DEFAULT '',
    "unit_frgn_prefix" TEXT NOT NULL DEFAULT 'Kapitel',

    CONSTRAINT "Units_pkey" PRIMARY KEY ("unit_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "page_items_page_item_id_key" ON "page_items"("page_item_id");

-- CreateIndex
CREATE UNIQUE INDEX "page_items_subsection_id_order_key" ON "page_items"("subsection_id", "order");

-- AddForeignKey
ALTER TABLE "page_items" ADD CONSTRAINT "page_items_subsection_id_fkey" FOREIGN KEY ("subsection_id") REFERENCES "subsections"("subsection_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "sections" ADD CONSTRAINT "sections_unit_id_fkey" FOREIGN KEY ("unit_id") REFERENCES "units"("unit_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "subsections" ADD CONSTRAINT "subsections_section_id_fkey" FOREIGN KEY ("section_id") REFERENCES "sections"("section_id") ON DELETE NO ACTION ON UPDATE NO ACTION;
