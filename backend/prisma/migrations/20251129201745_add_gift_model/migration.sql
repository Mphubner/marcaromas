-- CreateTable
CREATE TABLE "Gift" (
    "id" SERIAL NOT NULL,
    "planId" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "giverName" TEXT NOT NULL,
    "giverEmail" TEXT NOT NULL,
    "giverPhone" TEXT,
    "giverCPF" TEXT,
    "recipientName" TEXT NOT NULL,
    "recipientEmail" TEXT NOT NULL,
    "recipientPhone" TEXT NOT NULL,
    "recipientAddress" JSONB NOT NULL,
    "message" TEXT,
    "scheduledDate" TIMESTAMP(3),
    "sendImmediate" BOOLEAN NOT NULL DEFAULT true,
    "extras" JSONB,
    "subtotal" DOUBLE PRECISION NOT NULL,
    "discount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "total" DOUBLE PRECISION NOT NULL,
    "paymentMethod" TEXT,
    "installments" INTEGER NOT NULL DEFAULT 1,
    "mpPreferenceId" TEXT,
    "mpPaymentId" TEXT,
    "paymentStatus" TEXT NOT NULL DEFAULT 'pending',
    "paymentDetails" JSONB,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "notifiedAt" TIMESTAMP(3),
    "deliveredAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "cancellationReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Gift_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Gift_giverEmail_idx" ON "Gift"("giverEmail");

-- CreateIndex
CREATE INDEX "Gift_recipientEmail_idx" ON "Gift"("recipientEmail");

-- CreateIndex
CREATE INDEX "Gift_status_idx" ON "Gift"("status");

-- CreateIndex
CREATE INDEX "Gift_paymentStatus_idx" ON "Gift"("paymentStatus");
