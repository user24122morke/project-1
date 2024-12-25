-- DropForeignKey
ALTER TABLE "Card" DROP CONSTRAINT "Card_createdBy_fkey";

-- AddForeignKey
ALTER TABLE "Card" ADD CONSTRAINT "Card_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "Admin"("id") ON DELETE CASCADE ON UPDATE CASCADE;
