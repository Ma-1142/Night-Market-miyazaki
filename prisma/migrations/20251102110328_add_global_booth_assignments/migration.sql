-- CreateTable
CREATE TABLE "LayoutSettings" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'global',
    "publishAt" DATETIME,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "BoothAssignment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "formId" TEXT NOT NULL,
    "boothId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "BoothAssignment_formId_key" ON "BoothAssignment"("formId");

-- CreateIndex
CREATE UNIQUE INDEX "BoothAssignment_boothId_key" ON "BoothAssignment"("boothId");
