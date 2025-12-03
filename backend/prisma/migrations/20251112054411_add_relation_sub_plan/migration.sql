-- AlterTable
ALTER TABLE "Subscription" ADD COLUMN     "preferences" JSONB,
ADD COLUMN     "shippingAddress" JSONB;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
