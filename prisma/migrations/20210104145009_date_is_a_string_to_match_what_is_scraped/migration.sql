-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_LongreadList" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" TEXT NOT NULL
);
INSERT INTO "new_LongreadList" ("id", "date") SELECT "id", "date" FROM "LongreadList";
DROP TABLE "LongreadList";
ALTER TABLE "new_LongreadList" RENAME TO "LongreadList";
CREATE UNIQUE INDEX "LongreadList.date_unique" ON "LongreadList"("date");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
