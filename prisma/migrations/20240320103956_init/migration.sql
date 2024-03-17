-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'user',
    "email" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_first_time" BOOLEAN NOT NULL DEFAULT true,
    "full_name" TEXT NOT NULL,
    "profile_picture_url" TEXT,
    "phone_number" TEXT NOT NULL DEFAULT '-',
    "address" TEXT NOT NULL DEFAULT '-',
    "resume_objective_summary" TEXT NOT NULL DEFAULT '-',
    "work_experience" TEXT NOT NULL DEFAULT '-',
    "education" TEXT NOT NULL DEFAULT '-',
    "soft_skills" TEXT NOT NULL DEFAULT '-',
    "technical_skills" TEXT NOT NULL DEFAULT '-',
    "awards" TEXT NOT NULL DEFAULT '-',
    "achievements" TEXT NOT NULL DEFAULT '-',
    "certifications" TEXT NOT NULL DEFAULT '-',
    "spoken_languages" TEXT NOT NULL DEFAULT '-',
    "interests_hobbies" TEXT NOT NULL DEFAULT '-',
    "volunteer_work" TEXT NOT NULL DEFAULT '-',
    "associative_experiences" TEXT NOT NULL DEFAULT '-',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "owner_id" INTEGER NOT NULL,
    "expires_in" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
