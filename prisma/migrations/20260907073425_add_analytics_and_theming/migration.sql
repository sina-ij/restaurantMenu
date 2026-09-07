-- AlterTable
ALTER TABLE "Restaurant" ADD COLUMN     "businessType" TEXT,
ADD COLUMN     "viewCount" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "accentColor" SET DEFAULT '#AB7C33';

-- CreateTable
CREATE TABLE "DailyStat" (
    "id" TEXT NOT NULL,
    "restaurantId" TEXT NOT NULL,
    "day" TIMESTAMP(3) NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "DailyStat_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DailyStat_restaurantId_day_key" ON "DailyStat"("restaurantId", "day");

-- AddForeignKey
ALTER TABLE "DailyStat" ADD CONSTRAINT "DailyStat_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
