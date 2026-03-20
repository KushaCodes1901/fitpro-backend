-- CreateTable
CREATE TABLE "public"."NutritionPlanAssignment" (
    "id" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "NutritionPlanAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "NutritionPlanAssignment_planId_idx" ON "public"."NutritionPlanAssignment"("planId");

-- CreateIndex
CREATE INDEX "NutritionPlanAssignment_clientId_idx" ON "public"."NutritionPlanAssignment"("clientId");

-- CreateIndex
CREATE UNIQUE INDEX "NutritionPlanAssignment_planId_clientId_key" ON "public"."NutritionPlanAssignment"("planId", "clientId");

-- AddForeignKey
ALTER TABLE "public"."NutritionPlanAssignment" ADD CONSTRAINT "NutritionPlanAssignment_planId_fkey" FOREIGN KEY ("planId") REFERENCES "public"."NutritionPlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."NutritionPlanAssignment" ADD CONSTRAINT "NutritionPlanAssignment_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "public"."ClientProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
