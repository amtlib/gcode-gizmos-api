/*
  Warnings:

  - You are about to alter the column `recommendedInfill` on the `Model` table. The data in that column could be lost. The data in that column will be cast from `Decimal(18,4)` to `Integer`.

*/
-- AlterTable
ALTER TABLE "Model" ALTER COLUMN "recommendedInfill" SET DATA TYPE INTEGER;

-- CreateTable
CREATE TABLE "Comment" (
    "id" TEXT NOT NULL,
    "model" TEXT,
    "author" TEXT,
    "content" JSONB NOT NULL DEFAULT '[{"type":"paragraph","children":[{"text":""}]}]',

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Comment_model_idx" ON "Comment"("model");

-- CreateIndex
CREATE INDEX "Comment_author_idx" ON "Comment"("author");

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_model_fkey" FOREIGN KEY ("model") REFERENCES "Model"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_author_fkey" FOREIGN KEY ("author") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
