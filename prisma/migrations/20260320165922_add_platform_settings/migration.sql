-- CreateTable
CREATE TABLE "public"."PlatformSetting" (
    "id" TEXT NOT NULL,
    "appName" TEXT NOT NULL DEFAULT 'FitPro',
    "allowRegistration" BOOLEAN NOT NULL DEFAULT true,
    "maintenanceMode" BOOLEAN NOT NULL DEFAULT false,
    "supportEmail" TEXT DEFAULT 'support@fitpro.com',
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PlatformSetting_pkey" PRIMARY KEY ("id")
);
