-- CreateTable
CREATE TABLE "Arrival" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "formId" TEXT NOT NULL,
    "eventDate" DATETIME NOT NULL,
    "vendorCheckedIn" BOOLEAN NOT NULL DEFAULT false,
    "vendorCheckedInAt" DATETIME,
    "staffConfirmed" BOOLEAN NOT NULL DEFAULT false,
    "staffConfirmedAt" DATETIME,
    "staffConfirmedBy" TEXT,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Arrival_formId_eventDate_key" ON "Arrival"("formId", "eventDate");
