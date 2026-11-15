/*
  Warnings:

  - You are about to drop the column `role` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `Rescuer` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `Rescuer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `passwordHash` to the `Rescuer` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Deployment" DROP CONSTRAINT "Deployment_assignedById_fkey";

-- AlterTable
ALTER TABLE "Rescuer" ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "passwordHash" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "role";

-- DropEnum
DROP TYPE "UserRole";

-- CreateTable
CREATE TABLE "Operator" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "contactNumber" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Operator_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Operator_email_key" ON "Operator"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Rescuer_email_key" ON "Rescuer"("email");

-- AddForeignKey
ALTER TABLE "Deployment" ADD CONSTRAINT "Deployment_assignedById_fkey" FOREIGN KEY ("assignedById") REFERENCES "Operator"("id") ON DELETE SET NULL ON UPDATE CASCADE;
