/*
  Warnings:

  - Added the required column `updatedAt` to the `Subscription` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Subscription" ADD COLUMN     "billingAddress" JSONB,
ADD COLUMN     "canceledAt" TIMESTAMP(3),
ADD COLUMN     "cancellationReason" TEXT,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deliveryAddress" JSONB,
ADD COLUMN     "deliveryCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "failedPaymentsCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "lastDeliveryDate" TIMESTAMP(3),
ADD COLUMN     "lastPaymentDate" TIMESTAMP(3),
ADD COLUMN     "lastPaymentStatus" TEXT,
ADD COLUMN     "pauseCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "pausedAt" TIMESTAMP(3),
ADD COLUMN     "paymentMethod" TEXT,
ADD COLUMN     "renewalDate" TIMESTAMP(3);

-- Add updatedAt with default value for existing records (use startedAt)
ALTER TABLE "Subscription" ADD COLUMN "updatedAt" TIMESTAMP(3);
UPDATE "Subscription" SET "updatedAt" = "startedAt" WHERE "updatedAt" IS NULL;
ALTER TABLE "Subscription" ALTER COLUMN "updatedAt" SET NOT NULL;

-- CreateTable
CREATE TABLE "SubscriptionHistory" (
    "id" SERIAL NOT NULL,
    "subscriptionId" INTEGER NOT NULL,
    "eventType" TEXT NOT NULL,
    "eventStatus" TEXT NOT NULL,
    "description" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SubscriptionHistory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SubscriptionHistory" ADD CONSTRAINT "SubscriptionHistory_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "Subscription"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
