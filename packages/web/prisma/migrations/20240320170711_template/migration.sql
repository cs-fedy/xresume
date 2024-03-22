-- CreateTable
CREATE TABLE "Template" (
    "id" SERIAL NOT NULL,
    "template_url" TEXT NOT NULL,
    "isPublic" BOOLEAN NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "keywords" TEXT NOT NULL,
    "category" TEXT NOT NULL,

    CONSTRAINT "Template_pkey" PRIMARY KEY ("id")
);
