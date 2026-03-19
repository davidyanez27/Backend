/*
  Warnings:

  - You are about to drop the column `payment_method` on the `invoices` table. All the data in the column will be lost.
  - Added the required column `invoice_payment_method` to the `invoices` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "InvoicePaymentMethod" AS ENUM ('CASH', 'CARD', 'BANK_TRANSFER', 'OTHER');

-- AlterTable
ALTER TABLE "customer_item_prices" ALTER COLUMN "uuid" DROP DEFAULT;

-- AlterTable
ALTER TABLE "invoice_items" ALTER COLUMN "uuid" DROP DEFAULT;

-- AlterTable
ALTER TABLE "invoices" DROP COLUMN "payment_method",
ADD COLUMN     "invoice_payment_method" "InvoicePaymentMethod" NOT NULL;

-- CreateTable
CREATE TABLE "templates" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "company_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "template_variables" (
    "id" SERIAL NOT NULL,
    "template_id" INTEGER NOT NULL,
    "key" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "unit" TEXT,
    "defaultValue" DECIMAL(14,4),
    "isRequired" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "template_variables_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "template_sections" (
    "id" SERIAL NOT NULL,
    "template_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "template_sections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "template_items" (
    "id" SERIAL NOT NULL,
    "section_id" INTEGER NOT NULL,
    "item_id" INTEGER,
    "elementName" TEXT NOT NULL,
    "description" TEXT,
    "unit" TEXT,
    "quantityFormula" TEXT NOT NULL,
    "wastePercentage" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "roundUp" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "template_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_template_instances" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "project_id" INTEGER NOT NULL,
    "template_id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "project_template_instances_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_template_variables" (
    "id" SERIAL NOT NULL,
    "instance_id" INTEGER NOT NULL,
    "key" TEXT NOT NULL,
    "value" DECIMAL(14,4) NOT NULL,

    CONSTRAINT "project_template_variables_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_template_item_overrides" (
    "id" SERIAL NOT NULL,
    "instance_id" INTEGER NOT NULL,
    "template_item_id" INTEGER NOT NULL,
    "quantityFormula" TEXT,

    CONSTRAINT "project_template_item_overrides_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "template_pdf_layouts" (
    "id" SERIAL NOT NULL,
    "template_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "layoutConfig" JSONB NOT NULL,

    CONSTRAINT "template_pdf_layouts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "templates_uuid_key" ON "templates"("uuid");

-- CreateIndex
CREATE INDEX "templates_company_id_idx" ON "templates"("company_id");

-- CreateIndex
CREATE UNIQUE INDEX "template_variables_template_id_key_key" ON "template_variables"("template_id", "key");

-- CreateIndex
CREATE INDEX "template_sections_template_id_idx" ON "template_sections"("template_id");

-- CreateIndex
CREATE INDEX "template_items_section_id_idx" ON "template_items"("section_id");

-- CreateIndex
CREATE UNIQUE INDEX "project_template_instances_uuid_key" ON "project_template_instances"("uuid");

-- CreateIndex
CREATE INDEX "project_template_instances_project_id_idx" ON "project_template_instances"("project_id");

-- CreateIndex
CREATE UNIQUE INDEX "project_template_instances_project_id_template_id_key" ON "project_template_instances"("project_id", "template_id");

-- CreateIndex
CREATE UNIQUE INDEX "project_template_variables_instance_id_key_key" ON "project_template_variables"("instance_id", "key");

-- CreateIndex
CREATE UNIQUE INDEX "project_template_item_overrides_instance_id_template_item_i_key" ON "project_template_item_overrides"("instance_id", "template_item_id");

-- AddForeignKey
ALTER TABLE "templates" ADD CONSTRAINT "templates_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "template_variables" ADD CONSTRAINT "template_variables_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "templates"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "template_sections" ADD CONSTRAINT "template_sections_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "templates"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "template_items" ADD CONSTRAINT "template_items_section_id_fkey" FOREIGN KEY ("section_id") REFERENCES "template_sections"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "template_items" ADD CONSTRAINT "template_items_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "items"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_template_instances" ADD CONSTRAINT "project_template_instances_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_template_instances" ADD CONSTRAINT "project_template_instances_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "templates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_template_variables" ADD CONSTRAINT "project_template_variables_instance_id_fkey" FOREIGN KEY ("instance_id") REFERENCES "project_template_instances"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_template_item_overrides" ADD CONSTRAINT "project_template_item_overrides_instance_id_fkey" FOREIGN KEY ("instance_id") REFERENCES "project_template_instances"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "template_pdf_layouts" ADD CONSTRAINT "template_pdf_layouts_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "templates"("id") ON DELETE CASCADE ON UPDATE CASCADE;
