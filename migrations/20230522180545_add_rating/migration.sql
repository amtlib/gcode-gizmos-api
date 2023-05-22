-- CreateTable
CREATE TABLE "Rating" (
    "id" TEXT NOT NULL,
    "user" TEXT,
    "model" TEXT,

    CONSTRAINT "Rating_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Rating_user_idx" ON "Rating"("user");

-- CreateIndex
CREATE INDEX "Rating_model_idx" ON "Rating"("model");

-- AddForeignKey
ALTER TABLE "Rating" ADD CONSTRAINT "Rating_user_fkey" FOREIGN KEY ("user") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rating" ADD CONSTRAINT "Rating_model_fkey" FOREIGN KEY ("model") REFERENCES "Model"("id") ON DELETE SET NULL ON UPDATE CASCADE;
