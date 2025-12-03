/*
  Warnings:

  - You are about to drop the column `address` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "address";

-- CreateTable
CREATE TABLE "ScentProfile" (
    "id" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "aroma_families" TEXT[],
    "intensity_preference" TEXT,
    "favorite_notes" TEXT[],
    "occasions" TEXT[],
    "dislikes" TEXT[],

    CONSTRAINT "ScentProfile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ScentProfile_userId_key" ON "ScentProfile"("userId");

-- AddForeignKey
ALTER TABLE "ScentProfile" ADD CONSTRAINT "ScentProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
