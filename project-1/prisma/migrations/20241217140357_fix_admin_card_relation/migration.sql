-- AddForeignKey
ALTER TABLE "Card" ADD CONSTRAINT "Card_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "Admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;