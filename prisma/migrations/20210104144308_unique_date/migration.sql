/*
  Warnings:

  - The migration will add a unique constraint covering the columns `[date]` on the table `LongreadList`. If there are existing duplicate values, the migration will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "LongreadList.date_unique" ON "LongreadList"("date");
