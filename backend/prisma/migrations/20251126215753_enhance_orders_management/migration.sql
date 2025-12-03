/*
  Warnings:

  - Added the required column `subtotal` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- Step 1: Add columns as nullable first
ALTER TABLE "Order" ADD COLUMN     "actualDeliveryDate" TIMESTAMP(3),
ADD COLUMN     "adminNotes" TEXT,
ADD COLUMN     "billingAddress" JSONB,
ADD COLUMN     "canceledAt" TIMESTAMP(3),
ADD COLUMN     "cancellationReason" TEXT,
ADD COLUMN     "carrier" TEXT,
ADD COLUMN     "channel" TEXT DEFAULT 'website',
ADD COLUMN     "deliveredAt" TIMESTAMP(3),
ADD COLUMN     "deliveryAddress" JSONB,
ADD COLUMN     "discount" DOUBLE PRECISION DEFAULT 0,
ADD COLUMN     "estimatedDeliveryDate" TIMESTAMP(3),
ADD COLUMN     "labelUrl" TEXT,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "paidAt" TIMESTAMP(3),
ADD COLUMN     "paymentMethod" TEXT,
ADD COLUMN     "paymentProof" TEXT,
ADD COLUMN     "paymentStatus" TEXT,
ADD COLUMN     "refundAmount" DOUBLE PRECISION,
ADD COLUMN     "refundedAt" TIMESTAMP(3),
ADD COLUMN     "shipDate" TIMESTAMP(3),
ADD COLUMN     "shippedAt" TIMESTAMP(3),
ADD COLUMN     "shippingCost" DOUBLE PRECISION DEFAULT 0,
ADD COLUMN     "shippingMethod" TEXT,
ADD COLUMN     "subtotal" DOUBLE PRECISION,  -- Nullable first
ADD COLUMN     "tax" DOUBLE PRECISION DEFAULT 0,
ADD COLUMN     "trackingUrl" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3);  -- Nullable first

-- Step 2: Set default values for existing rows
-- Set subtotal = total (assuming no separate shipping cost for old orders)
UPDATE "Order" SET "subtotal" = "total" WHERE "subtotal" IS NULL;

-- Set updatedAt = createdAt for existing rows
UPDATE "Order" SET "updatedAt" = "createdAt" WHERE "updatedAt" IS NULL;

-- Set channel = 'website' for existing rows
UPDATE "Order" SET "channel" = 'website' WHERE "channel" IS NULL;

-- Step 3: Now make the columns NOT NULL
ALTER TABLE "Order" ALTER COLUMN "subtotal" SET NOT NULL;
ALTER TABLE "Order" ALTER COLUMN "updatedAt" SET NOT NULL;
ALTER TABLE "Order" ALTER COLUMN "channel" SET NOT NULL;
ALTER TABLE "Order" ALTER COLUMN "discount" SET NOT NULL;
ALTER TABLE "Order" ALTER COLUMN "shippingCost" SET NOT NULL;
ALTER TABLE "Order" ALTER COLUMN "tax" SET NOT NULL;

-- Step 4: Add orderNumber field (nullable first)
ALTER TABLE "Order" ADD COLUMN "orderNumber" TEXT;

-- Step 5: Generate orderNumber for existing orders
UPDATE "Order" SET "orderNumber" = 'ORD-2025-' || LPAD(id::TEXT, 6, '0') WHERE "orderNumber" IS NULL;

-- Step 6: Make orderNumber NOT NULL and unique
ALTER TABLE "Order" ALTER COLUMN "orderNumber" SET NOT NULL;
CREATE UNIQUE INDEX "Order_orderNumber_key" ON "Order"("orderNumber");

-- Step 7: Add missing fields that were in schema but not added above
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "couponCode" TEXT;
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "paymentDetails" JSONB;
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "labelGeneratedAt" TIMESTAMP(3);
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "customerNotes" TEXT;
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "confirmedAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "OrderHistory" (
    "id" SERIAL NOT NULL,
    "orderId" INTEGER NOT NULL,
    "eventType" TEXT NOT NULL,
    "eventStatus" TEXT NOT NULL,
    "description" TEXT,
    "metadata" JSONB,
    "createdBy" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OrderHistory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "OrderHistory" ADD CONSTRAINT "OrderHistory_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
