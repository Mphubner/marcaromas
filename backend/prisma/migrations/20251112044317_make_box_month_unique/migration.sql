/*
  Warnings:

  - A unique constraint covering the columns `[month]` on the table `Box` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Box_month_key" ON "Box"("month");
