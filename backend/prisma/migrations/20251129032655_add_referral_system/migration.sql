-- CreateTable
CREATE TABLE "ReferralProgram" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "fixed_amount" DOUBLE PRECISION,
    "percentage" DOUBLE PRECISION,
    "recurring_percentage" DOUBLE PRECISION,
    "max_amount" DOUBLE PRECISION,
    "trigger_event" TEXT NOT NULL,
    "min_purchase_amount" DOUBLE PRECISION,
    "is_recurring" BOOLEAN NOT NULL DEFAULT false,
    "recurring_duration" TEXT,
    "recurring_months" INTEGER,
    "tier_config" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by_id" INTEGER,

    CONSTRAINT "ReferralProgram_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReferralCode" (
    "id" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    "code" TEXT NOT NULL,
    "program_id" TEXT NOT NULL,
    "clicks" INTEGER NOT NULL DEFAULT 0,
    "signups" INTEGER NOT NULL DEFAULT 0,
    "conversions" INTEGER NOT NULL DEFAULT 0,
    "total_earned" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "expires_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReferralCode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReferralClick" (
    "id" TEXT NOT NULL,
    "referral_code_id" TEXT NOT NULL,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "source_url" TEXT,
    "landing_url" TEXT,
    "country" TEXT,
    "city" TEXT,
    "is_social_media" BOOLEAN NOT NULL DEFAULT false,
    "social_platform" TEXT,
    "converted" BOOLEAN NOT NULL DEFAULT false,
    "converted_user_id" INTEGER,
    "converted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReferralClick_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReferralConversion" (
    "id" TEXT NOT NULL,
    "referral_code_id" TEXT NOT NULL,
    "program_id" TEXT NOT NULL,
    "referrer_user_id" INTEGER NOT NULL,
    "referred_user_id" INTEGER NOT NULL,
    "conversion_type" TEXT NOT NULL,
    "order_id" INTEGER,
    "subscription_id" INTEGER,
    "transaction_amount" DOUBLE PRECISION,
    "reward_amount" DOUBLE PRECISION NOT NULL,
    "reward_status" TEXT NOT NULL DEFAULT 'PENDING',
    "is_recurring" BOOLEAN NOT NULL DEFAULT false,
    "parent_conversion_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "paid_at" TIMESTAMP(3),

    CONSTRAINT "ReferralConversion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SocialMediaMention" (
    "id" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    "platform" TEXT NOT NULL,
    "platform_post_id" TEXT,
    "mention_type" TEXT NOT NULL,
    "content_url" TEXT,
    "caption" TEXT,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "comments" INTEGER NOT NULL DEFAULT 0,
    "shares" INTEGER NOT NULL DEFAULT 0,
    "reach" INTEGER NOT NULL DEFAULT 0,
    "reward_amount" DOUBLE PRECISION,
    "reward_status" TEXT NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "verified_at" TIMESTAMP(3),

    CONSTRAINT "SocialMediaMention_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReferralPayout" (
    "id" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "conversion_ids" TEXT[],
    "payout_method" TEXT NOT NULL,
    "pix_key" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "requested_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processed_at" TIMESTAMP(3),
    "completed_at" TIMESTAMP(3),
    "notes" TEXT,

    CONSTRAINT "ReferralPayout_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ReferralCode_code_key" ON "ReferralCode"("code");

-- CreateIndex
CREATE INDEX "ReferralCode_user_id_idx" ON "ReferralCode"("user_id");

-- CreateIndex
CREATE INDEX "ReferralCode_code_idx" ON "ReferralCode"("code");

-- CreateIndex
CREATE INDEX "ReferralClick_referral_code_id_idx" ON "ReferralClick"("referral_code_id");

-- CreateIndex
CREATE INDEX "ReferralClick_converted_idx" ON "ReferralClick"("converted");

-- CreateIndex
CREATE INDEX "ReferralConversion_referrer_user_id_idx" ON "ReferralConversion"("referrer_user_id");

-- CreateIndex
CREATE INDEX "ReferralConversion_referred_user_id_idx" ON "ReferralConversion"("referred_user_id");

-- CreateIndex
CREATE INDEX "ReferralConversion_reward_status_idx" ON "ReferralConversion"("reward_status");

-- CreateIndex
CREATE INDEX "SocialMediaMention_user_id_idx" ON "SocialMediaMention"("user_id");

-- CreateIndex
CREATE INDEX "SocialMediaMention_platform_idx" ON "SocialMediaMention"("platform");

-- CreateIndex
CREATE INDEX "ReferralPayout_user_id_idx" ON "ReferralPayout"("user_id");

-- CreateIndex
CREATE INDEX "ReferralPayout_status_idx" ON "ReferralPayout"("status");

-- AddForeignKey
ALTER TABLE "ReferralCode" ADD CONSTRAINT "ReferralCode_program_id_fkey" FOREIGN KEY ("program_id") REFERENCES "ReferralProgram"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReferralClick" ADD CONSTRAINT "ReferralClick_referral_code_id_fkey" FOREIGN KEY ("referral_code_id") REFERENCES "ReferralCode"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReferralConversion" ADD CONSTRAINT "ReferralConversion_referral_code_id_fkey" FOREIGN KEY ("referral_code_id") REFERENCES "ReferralCode"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReferralConversion" ADD CONSTRAINT "ReferralConversion_program_id_fkey" FOREIGN KEY ("program_id") REFERENCES "ReferralProgram"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReferralConversion" ADD CONSTRAINT "ReferralConversion_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReferralConversion" ADD CONSTRAINT "ReferralConversion_subscription_id_fkey" FOREIGN KEY ("subscription_id") REFERENCES "Subscription"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReferralConversion" ADD CONSTRAINT "ReferralConversion_parent_conversion_id_fkey" FOREIGN KEY ("parent_conversion_id") REFERENCES "ReferralConversion"("id") ON DELETE SET NULL ON UPDATE CASCADE;
