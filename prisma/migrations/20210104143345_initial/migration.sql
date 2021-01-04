-- CreateTable
CREATE TABLE "LongreadList" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Longread" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "link" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "longreadID" INTEGER NOT NULL,

    FOREIGN KEY ("longreadID") REFERENCES "LongreadList"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
