-- CreateTable
CREATE TABLE "base" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "username" TEXT NOT NULL,
    "speed" INTEGER NOT NULL,
    "gravity" INTEGER NOT NULL,
    "shapes" TEXT NOT NULL,
    "colors" TEXT NOT NULL,
    "angle" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "audioLink" TEXT,
    "ytLinks" TEXT,
    "imgLinks" TEXT
);
