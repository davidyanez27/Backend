/*
  Warnings:

  - You are about to drop the column `quantityFormula` on the `template_items` table. All the data in the column will be lost.
  - You are about to drop the `project_template_item_overrides` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `project_template_variables` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `template_variables` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `formula_key` to the `template_sections` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "project_template_item_overrides" DROP CONSTRAINT "project_template_item_overrides_instance_id_fkey";

-- DropForeignKey
ALTER TABLE "project_template_variables" DROP CONSTRAINT "project_template_variables_instance_id_fkey";

-- DropForeignKey
ALTER TABLE "template_variables" DROP CONSTRAINT "template_variables_template_id_fkey";

-- AlterTable
ALTER TABLE "template_items" DROP COLUMN "quantityFormula",
ADD COLUMN     "conversion_factor" DECIMAL(14,4) NOT NULL DEFAULT 1,
ADD COLUMN     "is_divider" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "template_sections" ADD COLUMN     "custom_expression" TEXT,
ADD COLUMN     "formula_key" TEXT NOT NULL;

-- DropTable
DROP TABLE "project_template_item_overrides";

-- DropTable
DROP TABLE "project_template_variables";

-- DropTable
DROP TABLE "template_variables";

-- CreateTable
CREATE TABLE "template_section_inputs" (
    "id" SERIAL NOT NULL,
    "section_id" INTEGER NOT NULL,
    "key" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "unit" TEXT,
    "defaultValue" DECIMAL(14,4),

    CONSTRAINT "template_section_inputs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_template_section_inputs" (
    "id" SERIAL NOT NULL,
    "instance_id" INTEGER NOT NULL,
    "section_id" INTEGER NOT NULL,
    "key" TEXT NOT NULL,
    "value" DECIMAL(14,4) NOT NULL,

    CONSTRAINT "project_template_section_inputs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "template_section_inputs_section_id_key_key" ON "template_section_inputs"("section_id", "key");

-- CreateIndex
CREATE UNIQUE INDEX "project_template_section_inputs_instance_id_section_id_key_key" ON "project_template_section_inputs"("instance_id", "section_id", "key");

-- AddForeignKey
ALTER TABLE "template_section_inputs" ADD CONSTRAINT "template_section_inputs_section_id_fkey" FOREIGN KEY ("section_id") REFERENCES "template_sections"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_template_section_inputs" ADD CONSTRAINT "project_template_section_inputs_instance_id_fkey" FOREIGN KEY ("instance_id") REFERENCES "project_template_instances"("id") ON DELETE CASCADE ON UPDATE CASCADE;
