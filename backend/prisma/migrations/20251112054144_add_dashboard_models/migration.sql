-- AlterTable
ALTER TABLE "User" ADD COLUMN     "total_credits" DOUBLE PRECISION DEFAULT 0;

-- CreateTable
CREATE TABLE "Shipment" (
    "id" TEXT NOT NULL,
    "userEmail" TEXT NOT NULL,
    "orderId" INTEGER,
    "subscriptionId" INTEGER,
    "box_id" TEXT,
    "shipped_date" TIMESTAMP(3),
    "tracking_code" TEXT,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Shipment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Achievement" (
    "id" TEXT NOT NULL,
    "userEmail" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "reward_credits" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Achievement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScentHistory" (
    "id" TEXT NOT NULL,
    "userEmail" TEXT NOT NULL,
    "product_name" TEXT NOT NULL,
    "aroma_family" TEXT NOT NULL,
    "rating" INTEGER,
    "liked" BOOLEAN,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ScentHistory_pkey" PRIMARY KEY ("id")
);
