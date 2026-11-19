-- AlterTable
ALTER TABLE "Rescuer" ADD COLUMN     "boatCapacity" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "resources" JSONB NOT NULL DEFAULT '[]';
