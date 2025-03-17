-- CreateTable
CREATE TABLE "AdminSession" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "admin_user_id" INTEGER NOT NULL,
    "expires_at" DATETIME NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AdminSession_admin_user_id_fkey" FOREIGN KEY ("admin_user_id") REFERENCES "AdminUser" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
