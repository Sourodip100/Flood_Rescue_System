/*
  Warnings:

  - You are about to drop the column `quantityUsed` on the `Deployment` table. All the data in the column will be lost.
  - You are about to drop the column `resourceId` on the `Deployment` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Deployment" DROP CONSTRAINT "Deployment_resourceId_fkey";

-- AlterTable
ALTER TABLE "Deployment" DROP COLUMN "quantityUsed",
DROP COLUMN "resourceId",
ADD COLUMN     "resourcesUsed" JSONB NOT NULL DEFAULT '[]';
