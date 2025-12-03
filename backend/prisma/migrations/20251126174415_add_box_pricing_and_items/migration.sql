-- AlterTable
ALTER TABLE "Box" ADD COLUMN     "benefits" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "category" TEXT NOT NULL DEFAULT 'box',
ADD COLUMN     "is_available_for_purchase" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "items_included" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "original_price" DOUBLE PRECISION,
ADD COLUMN     "price" DOUBLE PRECISION NOT NULL DEFAULT 99.90,
ADD COLUMN     "stock_quantity" INTEGER,
ADD COLUMN     "total_items_value" DOUBLE PRECISION;
