-- CreateTable
CREATE TABLE "_Model_likedBy" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_Model_likedBy_AB_unique" ON "_Model_likedBy"("A", "B");

-- CreateIndex
CREATE INDEX "_Model_likedBy_B_index" ON "_Model_likedBy"("B");

-- AddForeignKey
ALTER TABLE "_Model_likedBy" ADD CONSTRAINT "_Model_likedBy_A_fkey" FOREIGN KEY ("A") REFERENCES "Model"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Model_likedBy" ADD CONSTRAINT "_Model_likedBy_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
