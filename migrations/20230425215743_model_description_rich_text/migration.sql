/*
  Warnings:

  - The `description` column on the `Model` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Model" DROP COLUMN "description",
ADD COLUMN     "description" JSONB NOT NULL DEFAULT '[{"type":"paragraph","children":[{"text":""}]}]';
