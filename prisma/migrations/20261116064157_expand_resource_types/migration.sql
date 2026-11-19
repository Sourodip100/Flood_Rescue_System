-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "ResourceType" ADD VALUE 'WATER_SUPPLY';
ALTER TYPE "ResourceType" ADD VALUE 'LIFE_JACKET';
ALTER TYPE "ResourceType" ADD VALUE 'BLANKET';
ALTER TYPE "ResourceType" ADD VALUE 'CLOTHING';
ALTER TYPE "ResourceType" ADD VALUE 'RESCUE_ROPE';
ALTER TYPE "ResourceType" ADD VALUE 'OXYGEN_CYLINDER';
ALTER TYPE "ResourceType" ADD VALUE 'BABY_SUPPLIES';
ALTER TYPE "ResourceType" ADD VALUE 'SANITARY_KIT';
ALTER TYPE "ResourceType" ADD VALUE 'FLASHLIGHT';
ALTER TYPE "ResourceType" ADD VALUE 'BATTERY';
ALTER TYPE "ResourceType" ADD VALUE 'FUEL';
