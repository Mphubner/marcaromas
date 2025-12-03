-- CreateTable
CREATE TABLE "Box" (
    "id" SERIAL NOT NULL,
    "month" TEXT NOT NULL,
    "theme" TEXT NOT NULL,
    "description" TEXT,
    "image_url" TEXT,
    "candle_name" TEXT,
    "aroma_notes" TEXT[],
    "spotify_playlist" TEXT,
    "ritual_tips" TEXT,
    "is_published" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Box_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SiteSettings" (
    "id" SERIAL NOT NULL,
    "section" TEXT NOT NULL,
    "content" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SiteSettings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SiteSettings_section_key" ON "SiteSettings"("section");
