/*
  Warnings:

  - You are about to drop the column `eventId` on the `LayoutAssignment` table. All the data in the column will be lost.
  - You are about to drop the column `eventId` on the `LayoutMap` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Event" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "formId" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "startTime" TEXT,
    "endTime" TEXT,
    "layoutMapId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Event_formId_fkey" FOREIGN KEY ("formId") REFERENCES "Form" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Event_layoutMapId_fkey" FOREIGN KEY ("layoutMapId") REFERENCES "LayoutMap" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Event" ("createdAt", "date", "endTime", "formId", "id", "startTime", "updatedAt") SELECT "createdAt", "date", "endTime", "formId", "id", "startTime", "updatedAt" FROM "Event";
DROP TABLE "Event";
ALTER TABLE "new_Event" RENAME TO "Event";
CREATE TABLE "new_LayoutAssignment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "layoutMapId" TEXT NOT NULL,
    "formId" TEXT,
    "boothId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "LayoutAssignment_layoutMapId_fkey" FOREIGN KEY ("layoutMapId") REFERENCES "LayoutMap" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_LayoutAssignment" ("boothId", "createdAt", "id", "layoutMapId", "updatedAt") SELECT "boothId", "createdAt", "id", "layoutMapId", "updatedAt" FROM "LayoutAssignment";
DROP TABLE "LayoutAssignment";
ALTER TABLE "new_LayoutAssignment" RENAME TO "LayoutAssignment";
CREATE UNIQUE INDEX "LayoutAssignment_layoutMapId_boothId_key" ON "LayoutAssignment"("layoutMapId", "boothId");
CREATE TABLE "new_LayoutMap" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "imageUrl" TEXT,
    "publishAt" DATETIME,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_LayoutMap" ("createdAt", "id", "imageUrl", "isPublished", "publishAt", "updatedAt") SELECT "createdAt", "id", "imageUrl", "isPublished", "publishAt", "updatedAt" FROM "LayoutMap";
DROP TABLE "LayoutMap";
ALTER TABLE "new_LayoutMap" RENAME TO "LayoutMap";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
