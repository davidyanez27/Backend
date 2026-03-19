-- AlterTable: Add uuid column to invoice_items (nullable first)
ALTER TABLE "invoice_items" ADD COLUMN "uuid" UUID;

-- Backfill existing rows
UPDATE "invoice_items" SET "uuid" = gen_random_uuid() WHERE "uuid" IS NULL;

-- Make NOT NULL and add unique constraint
ALTER TABLE "invoice_items" ALTER COLUMN "uuid" SET NOT NULL;
ALTER TABLE "invoice_items" ALTER COLUMN "uuid" SET DEFAULT gen_random_uuid();
CREATE UNIQUE INDEX "invoice_items_uuid_key" ON "invoice_items"("uuid");

-- AlterTable: Add uuid column to customer_item_prices (nullable first)
ALTER TABLE "customer_item_prices" ADD COLUMN "uuid" UUID;

-- Backfill existing rows
UPDATE "customer_item_prices" SET "uuid" = gen_random_uuid() WHERE "uuid" IS NULL;

-- Make NOT NULL and add unique constraint
ALTER TABLE "customer_item_prices" ALTER COLUMN "uuid" SET NOT NULL;
ALTER TABLE "customer_item_prices" ALTER COLUMN "uuid" SET DEFAULT gen_random_uuid();
CREATE UNIQUE INDEX "customer_item_prices_uuid_key" ON "customer_item_prices"("uuid");
