/*
  Warnings:

  - You are about to drop the column `modelFile_filename` on the `Model` table. All the data in the column will be lost.
  - You are about to drop the column `modelFile_filesize` on the `Model` table. All the data in the column will be lost.
  - You are about to drop the column `modelImage_extension` on the `Model` table. All the data in the column will be lost.
  - You are about to drop the column `modelImage_filesize` on the `Model` table. All the data in the column will be lost.
  - You are about to drop the column `modelImage_height` on the `Model` table. All the data in the column will be lost.
  - You are about to drop the column `modelImage_id` on the `Model` table. All the data in the column will be lost.
  - You are about to drop the column `modelImage_width` on the `Model` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Model" DROP COLUMN "modelFile_filename",
DROP COLUMN "modelFile_filesize",
DROP COLUMN "modelImage_extension",
DROP COLUMN "modelImage_filesize",
DROP COLUMN "modelImage_height",
DROP COLUMN "modelImage_id",
DROP COLUMN "modelImage_width";

-- CreateTable
CREATE TABLE "ModelImage" (
    "id" TEXT NOT NULL,
    "model" TEXT,
    "image_filesize" INTEGER,
    "image_extension" TEXT,
    "image_width" INTEGER,
    "image_height" INTEGER,
    "image_id" TEXT,
    "createdBy" TEXT,

    CONSTRAINT "ModelImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ModelFile" (
    "id" TEXT NOT NULL,
    "model" TEXT,
    "file_filesize" INTEGER,
    "file_filename" TEXT,
    "createdBy" TEXT,

    CONSTRAINT "ModelFile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ModelImage_model_idx" ON "ModelImage"("model");

-- CreateIndex
CREATE INDEX "ModelImage_createdBy_idx" ON "ModelImage"("createdBy");

-- CreateIndex
CREATE INDEX "ModelFile_model_idx" ON "ModelFile"("model");

-- CreateIndex
CREATE INDEX "ModelFile_createdBy_idx" ON "ModelFile"("createdBy");

-- AddForeignKey
ALTER TABLE "ModelImage" ADD CONSTRAINT "ModelImage_model_fkey" FOREIGN KEY ("model") REFERENCES "Model"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModelImage" ADD CONSTRAINT "ModelImage_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModelFile" ADD CONSTRAINT "ModelFile_model_fkey" FOREIGN KEY ("model") REFERENCES "Model"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModelFile" ADD CONSTRAINT "ModelFile_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
