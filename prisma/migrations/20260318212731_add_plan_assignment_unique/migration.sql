/*
  Warnings:

  - A unique constraint covering the columns `[planId,clientId]` on the table `PlanAssignment` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "PlanAssignment_planId_clientId_key" ON "public"."PlanAssignment"("planId", "clientId");
