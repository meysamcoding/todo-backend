-- CreateTable
CREATE TABLE "Task" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "color" TEXT,
    "completed" BOOLEAN NOT NULL DEFAULT false
);
