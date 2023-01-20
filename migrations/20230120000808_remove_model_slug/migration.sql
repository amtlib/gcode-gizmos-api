/*
  Warnings:

  - You are about to drop the column `slug` on the `Model` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Model_slug_key";

-- AlterTable
ALTER TABLE "Model" DROP COLUMN "slug";
