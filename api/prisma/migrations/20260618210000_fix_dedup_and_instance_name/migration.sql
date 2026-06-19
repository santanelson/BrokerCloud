-- AlterTable: Add missing WhatsApp columns to tenants
ALTER TABLE "tenants" ADD COLUMN IF NOT EXISTS "whatsappInstanceId" TEXT;
ALTER TABLE "tenants" ADD COLUMN IF NOT EXISTS "whatsappInstanceToken" TEXT;
ALTER TABLE "tenants" ADD COLUMN IF NOT EXISTS "whatsappInstanceName" TEXT;

-- AlterTable: Add missing columns to messages
ALTER TABLE "messages" ADD COLUMN IF NOT EXISTS "evolutionMessageId" TEXT;
ALTER TABLE "messages" ADD COLUMN IF NOT EXISTS "mediaMimetype" TEXT;
ALTER TABLE "messages" ADD COLUMN IF NOT EXISTS "mediaSize" INTEGER;

-- CreateIndex: Make evolutionMessageId unique on messages
CREATE UNIQUE INDEX IF NOT EXISTS "messages_evolutionMessageId_key" ON "messages"("evolutionMessageId");

-- CreateIndex: Index for evolutionMessageId lookups
CREATE INDEX IF NOT EXISTS "messages_evolutionMessageId_idx" ON "messages"("evolutionMessageId");
