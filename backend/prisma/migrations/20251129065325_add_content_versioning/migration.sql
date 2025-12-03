-- CreateTable
CREATE TABLE "ContentVersion" (
    "id" TEXT NOT NULL,
    "content_id" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "excerpt" TEXT,
    "data" JSONB NOT NULL,
    "change_description" TEXT,
    "created_by" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContentVersion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ContentVersion_content_id_idx" ON "ContentVersion"("content_id");

-- CreateIndex
CREATE INDEX "ContentVersion_created_at_idx" ON "ContentVersion"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "ContentVersion_content_id_version_key" ON "ContentVersion"("content_id", "version");

-- CreateIndex
CREATE INDEX "Content_type_status_publish_date_idx" ON "Content"("type", "status", "publish_date");

-- CreateIndex
CREATE INDEX "Content_category_status_idx" ON "Content"("category", "status");

-- CreateIndex
CREATE INDEX "Content_type_category_status_idx" ON "Content"("type", "category", "status");

-- CreateIndex
CREATE INDEX "Content_status_publish_date_idx" ON "Content"("status", "publish_date");

-- AddForeignKey
ALTER TABLE "ContentVersion" ADD CONSTRAINT "ContentVersion_content_id_fkey" FOREIGN KEY ("content_id") REFERENCES "Content"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentVersion" ADD CONSTRAINT "ContentVersion_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
