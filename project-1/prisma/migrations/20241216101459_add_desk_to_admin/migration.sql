ALTER TABLE "Admin" ADD COLUMN "desk" TEXT NOT NULL DEFAULT 'unknown';
ALTER TABLE "Admin" ALTER COLUMN "desk" DROP DEFAULT;

ALTER TABLE "Admin" ADD COLUMN "username" TEXT NOT NULL DEFAULT 'unknown_user';
ALTER TABLE "Admin" ALTER COLUMN "username" DROP DEFAULT;
