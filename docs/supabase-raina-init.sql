-- =============================================================================
-- Raina — Database Setup for Supabase SQL Editor
-- =============================================================================
-- This script is safe to run multiple times.
-- It uses IF NOT EXISTS / ON CONFLICT DO NOTHING / DO blocks throughout.
--
-- Usage:
--   1. Open your Supabase project → SQL Editor
--   2. Paste this entire file
--   3. Run
--   4. Verify: SELECT COUNT(*) FROM "Category";  -- should return 8
-- =============================================================================

-- =============================================================================
-- ENUMS (PostgreSQL 14+ supports CREATE TYPE IF NOT EXISTS)
-- =============================================================================
DO $$ BEGIN CREATE TYPE "UserRole" AS ENUM ('OWNER', 'ADMIN', 'MODERATOR', 'SUPPORT', 'USER'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'DISABLED', 'DELETED'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE "Visibility" AS ENUM ('PUBLIC', 'PRIVATE'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE "RecordStatus" AS ENUM ('ACTIVE', 'HIDDEN', 'REMOVED'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE "ContentStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'HIDDEN', 'REMOVED'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE "MediaType" AS ENUM ('IMAGE', 'VIDEO'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE "ModerationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE "ListPurpose" AS ENUM ('PERSONAL_SAVE', 'PUBLISHER_PUBLIC'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE "ListVisibility" AS ENUM ('PRIVATE', 'PUBLIC'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE "ListItemTargetType" AS ENUM ('POST', 'PRODUCT'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE "SavedTargetType" AS ENUM ('POST', 'PRODUCT'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE "CommentTargetType" AS ENUM ('POST', 'PRODUCT'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE "ReportTargetType" AS ENUM ('USER', 'PROFILE', 'PRODUCT', 'POST', 'COMMENT'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE "ReportStatus" AS ENUM ('OPEN', 'REVIEWING', 'RESOLVED', 'REJECTED'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE "NotificationType" AS ENUM ('FOLLOW_CREATED', 'COMMENT_CREATED', 'REPLY_CREATED', 'POST_PUBLISHED', 'REPORT_UPDATED', 'SYSTEM'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE "SettingValueType" AS ENUM ('STRING', 'BOOLEAN', 'NUMBER', 'JSON'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- =============================================================================
-- TABLES
-- =============================================================================

CREATE TABLE IF NOT EXISTS "User" (
    "id" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "lastSeenAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "Profile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "bio" TEXT,
    "city" TEXT,
    "avatarUrl" TEXT,
    "visibility" "Visibility" NOT NULL DEFAULT 'PUBLIC',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "Category" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "nameAr" TEXT NOT NULL,
    "descriptionAr" TEXT,
    "imageUrl" TEXT,
    "status" "RecordStatus" NOT NULL DEFAULT 'ACTIVE',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "Brand" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "status" "RecordStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Brand_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "Product" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "brandId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "nameAr" TEXT NOT NULL,
    "summaryAr" TEXT,
    "descriptionAr" TEXT,
    "priceMin" DECIMAL(10,2),
    "priceMax" DECIMAL(10,2),
    "currency" TEXT NOT NULL DEFAULT 'SAR',
    "status" "RecordStatus" NOT NULL DEFAULT 'ACTIVE',
    "ratingAverage" DECIMAL(4,2) NOT NULL DEFAULT 0,
    "ratingCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "ProductMedia" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "type" "MediaType" NOT NULL DEFAULT 'IMAGE',
    "url" TEXT NOT NULL,
    "altAr" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "moderationStatus" "ModerationStatus" NOT NULL DEFAULT 'APPROVED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ProductMedia_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "ProductSpecification" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "nameAr" TEXT NOT NULL,
    "valueAr" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductSpecification_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "Post" (
    "id" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "publicListId" TEXT,
    "rating" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "PostMedia" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "type" "MediaType" NOT NULL DEFAULT 'IMAGE',
    "url" TEXT NOT NULL,
    "altAr" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "moderationStatus" "ModerationStatus" NOT NULL DEFAULT 'APPROVED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "PostMedia_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "PostPro" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PostPro_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "PostCon" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PostCon_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "Comment" (
    "id" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "targetType" "CommentTargetType" NOT NULL,
    "postId" TEXT,
    "productId" TEXT,
    "parentId" TEXT,
    "body" TEXT NOT NULL,
    "status" "ContentStatus" NOT NULL DEFAULT 'PUBLISHED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "Follow" (
    "followerId" TEXT NOT NULL,
    "followingId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Follow_pkey" PRIMARY KEY ("followerId","followingId")
);

CREATE TABLE IF NOT EXISTS "UserList" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "purpose" "ListPurpose" NOT NULL,
    "visibility" "ListVisibility" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "UserList_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "UserListItem" (
    "id" TEXT NOT NULL,
    "listId" TEXT NOT NULL,
    "targetType" "ListItemTargetType" NOT NULL,
    "targetId" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserListItem_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "SavedItem" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "targetType" "SavedTargetType" NOT NULL,
    "targetId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SavedItem_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "payload" JSONB,
    "readAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "Report" (
    "id" TEXT NOT NULL,
    "reporterId" TEXT NOT NULL,
    "targetType" "ReportTargetType" NOT NULL,
    "targetId" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "details" TEXT,
    "status" "ReportStatus" NOT NULL DEFAULT 'OPEN',
    "assignedAdminId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "resolvedAt" TIMESTAMP(3),

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "AppSetting" (
    "key" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "valueType" "SettingValueType" NOT NULL DEFAULT 'JSON',
    "description" TEXT,
    "updatedById" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AppSetting_pkey" PRIMARY KEY ("key")
);

CREATE TABLE IF NOT EXISTS "AdminAuditLog" (
    "id" TEXT NOT NULL,
    "actorId" TEXT,
    "action" TEXT NOT NULL,
    "targetType" TEXT NOT NULL,
    "targetId" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdminAuditLog_pkey" PRIMARY KEY ("id")
);

-- =============================================================================
-- UNIQUE CONSTRAINTS & INDEXES
-- =============================================================================
CREATE UNIQUE INDEX IF NOT EXISTS "User_phone_key" ON "User"("phone");
CREATE INDEX IF NOT EXISTS "User_status_createdAt_idx" ON "User"("status", "createdAt");
CREATE INDEX IF NOT EXISTS "User_role_status_idx" ON "User"("role", "status");

CREATE UNIQUE INDEX IF NOT EXISTS "Profile_userId_key" ON "Profile"("userId");
CREATE UNIQUE INDEX IF NOT EXISTS "Profile_username_key" ON "Profile"("username");
CREATE INDEX IF NOT EXISTS "Profile_visibility_createdAt_idx" ON "Profile"("visibility", "createdAt");

CREATE UNIQUE INDEX IF NOT EXISTS "Category_slug_key" ON "Category"("slug");
CREATE INDEX IF NOT EXISTS "Category_status_sortOrder_idx" ON "Category"("status", "sortOrder");

CREATE UNIQUE INDEX IF NOT EXISTS "Brand_slug_key" ON "Brand"("slug");
CREATE INDEX IF NOT EXISTS "Brand_status_name_idx" ON "Brand"("status", "name");

CREATE UNIQUE INDEX IF NOT EXISTS "Product_slug_key" ON "Product"("slug");
CREATE INDEX IF NOT EXISTS "Product_categoryId_ratingAverage_idx" ON "Product"("categoryId", "ratingAverage");
CREATE INDEX IF NOT EXISTS "Product_brandId_status_idx" ON "Product"("brandId", "status");
CREATE INDEX IF NOT EXISTS "Product_status_createdAt_idx" ON "Product"("status", "createdAt");

CREATE INDEX IF NOT EXISTS "ProductMedia_productId_sortOrder_idx" ON "ProductMedia"("productId", "sortOrder");

CREATE INDEX IF NOT EXISTS "ProductSpecification_productId_sortOrder_idx" ON "ProductSpecification"("productId", "sortOrder");
CREATE UNIQUE INDEX IF NOT EXISTS "ProductSpecification_productId_nameAr_key" ON "ProductSpecification"("productId", "nameAr");

CREATE INDEX IF NOT EXISTS "Post_authorId_status_createdAt_idx" ON "Post"("authorId", "status", "createdAt");
CREATE INDEX IF NOT EXISTS "Post_productId_publishedAt_idx" ON "Post"("productId", "publishedAt");
CREATE INDEX IF NOT EXISTS "Post_publicListId_idx" ON "Post"("publicListId");
CREATE INDEX IF NOT EXISTS "Post_status_publishedAt_idx" ON "Post"("status", "publishedAt");

CREATE INDEX IF NOT EXISTS "PostMedia_postId_sortOrder_idx" ON "PostMedia"("postId", "sortOrder");

CREATE INDEX IF NOT EXISTS "PostPro_postId_sortOrder_idx" ON "PostPro"("postId", "sortOrder");

CREATE INDEX IF NOT EXISTS "PostCon_postId_sortOrder_idx" ON "PostCon"("postId", "sortOrder");

CREATE INDEX IF NOT EXISTS "Comment_postId_createdAt_idx" ON "Comment"("postId", "createdAt");
CREATE INDEX IF NOT EXISTS "Comment_productId_createdAt_idx" ON "Comment"("productId", "createdAt");
CREATE INDEX IF NOT EXISTS "Comment_parentId_createdAt_idx" ON "Comment"("parentId", "createdAt");
CREATE INDEX IF NOT EXISTS "Comment_authorId_createdAt_idx" ON "Comment"("authorId", "createdAt");

CREATE INDEX IF NOT EXISTS "Follow_followingId_createdAt_idx" ON "Follow"("followingId", "createdAt");
CREATE INDEX IF NOT EXISTS "Follow_followerId_createdAt_idx" ON "Follow"("followerId", "createdAt");

CREATE INDEX IF NOT EXISTS "UserList_ownerId_purpose_visibility_idx" ON "UserList"("ownerId", "purpose", "visibility");
CREATE INDEX IF NOT EXISTS "UserList_purpose_visibility_createdAt_idx" ON "UserList"("purpose", "visibility", "createdAt");
CREATE UNIQUE INDEX IF NOT EXISTS "UserList_ownerId_slug_key" ON "UserList"("ownerId", "slug");

CREATE INDEX IF NOT EXISTS "UserListItem_targetType_targetId_idx" ON "UserListItem"("targetType", "targetId");
CREATE INDEX IF NOT EXISTS "UserListItem_listId_sortOrder_idx" ON "UserListItem"("listId", "sortOrder");
CREATE UNIQUE INDEX IF NOT EXISTS "UserListItem_listId_targetType_targetId_key" ON "UserListItem"("listId", "targetType", "targetId");

CREATE INDEX IF NOT EXISTS "SavedItem_targetType_targetId_idx" ON "SavedItem"("targetType", "targetId");
CREATE INDEX IF NOT EXISTS "SavedItem_userId_createdAt_idx" ON "SavedItem"("userId", "createdAt");
CREATE UNIQUE INDEX IF NOT EXISTS "SavedItem_userId_targetType_targetId_key" ON "SavedItem"("userId", "targetType", "targetId");

CREATE INDEX IF NOT EXISTS "Notification_userId_readAt_createdAt_idx" ON "Notification"("userId", "readAt", "createdAt");
CREATE INDEX IF NOT EXISTS "Notification_type_createdAt_idx" ON "Notification"("type", "createdAt");

CREATE INDEX IF NOT EXISTS "Report_status_createdAt_idx" ON "Report"("status", "createdAt");
CREATE INDEX IF NOT EXISTS "Report_targetType_targetId_idx" ON "Report"("targetType", "targetId");
CREATE INDEX IF NOT EXISTS "Report_reporterId_createdAt_idx" ON "Report"("reporterId", "createdAt");

CREATE INDEX IF NOT EXISTS "AppSetting_updatedAt_idx" ON "AppSetting"("updatedAt");

CREATE INDEX IF NOT EXISTS "AdminAuditLog_actorId_createdAt_idx" ON "AdminAuditLog"("actorId", "createdAt");
CREATE INDEX IF NOT EXISTS "AdminAuditLog_targetType_targetId_idx" ON "AdminAuditLog"("targetType", "targetId");
CREATE INDEX IF NOT EXISTS "AdminAuditLog_action_createdAt_idx" ON "AdminAuditLog"("action", "createdAt");

-- =============================================================================
-- FOREIGN KEYS (DO blocks to prevent duplicate constraint errors)
-- =============================================================================
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Profile_userId_fkey') THEN
        ALTER TABLE "Profile" ADD CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Product_brandId_fkey') THEN
        ALTER TABLE "Product" ADD CONSTRAINT "Product_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Product_categoryId_fkey') THEN
        ALTER TABLE "Product" ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ProductMedia_productId_fkey') THEN
        ALTER TABLE "ProductMedia" ADD CONSTRAINT "ProductMedia_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ProductSpecification_productId_fkey') THEN
        ALTER TABLE "ProductSpecification" ADD CONSTRAINT "ProductSpecification_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Post_authorId_fkey') THEN
        ALTER TABLE "Post" ADD CONSTRAINT "Post_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Post_productId_fkey') THEN
        ALTER TABLE "Post" ADD CONSTRAINT "Post_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Post_publicListId_fkey') THEN
        ALTER TABLE "Post" ADD CONSTRAINT "Post_publicListId_fkey" FOREIGN KEY ("publicListId") REFERENCES "UserList"("id") ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'PostMedia_postId_fkey') THEN
        ALTER TABLE "PostMedia" ADD CONSTRAINT "PostMedia_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'PostPro_postId_fkey') THEN
        ALTER TABLE "PostPro" ADD CONSTRAINT "PostPro_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'PostCon_postId_fkey') THEN
        ALTER TABLE "PostCon" ADD CONSTRAINT "PostCon_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Comment_authorId_fkey') THEN
        ALTER TABLE "Comment" ADD CONSTRAINT "Comment_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Comment_postId_fkey') THEN
        ALTER TABLE "Comment" ADD CONSTRAINT "Comment_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Comment_productId_fkey') THEN
        ALTER TABLE "Comment" ADD CONSTRAINT "Comment_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Comment_parentId_fkey') THEN
        ALTER TABLE "Comment" ADD CONSTRAINT "Comment_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Follow_followerId_fkey') THEN
        ALTER TABLE "Follow" ADD CONSTRAINT "Follow_followerId_fkey" FOREIGN KEY ("followerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Follow_followingId_fkey') THEN
        ALTER TABLE "Follow" ADD CONSTRAINT "Follow_followingId_fkey" FOREIGN KEY ("followingId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'UserList_ownerId_fkey') THEN
        ALTER TABLE "UserList" ADD CONSTRAINT "UserList_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'UserListItem_listId_fkey') THEN
        ALTER TABLE "UserListItem" ADD CONSTRAINT "UserListItem_listId_fkey" FOREIGN KEY ("listId") REFERENCES "UserList"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'SavedItem_userId_fkey') THEN
        ALTER TABLE "SavedItem" ADD CONSTRAINT "SavedItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Notification_userId_fkey') THEN
        ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Report_reporterId_fkey') THEN
        ALTER TABLE "Report" ADD CONSTRAINT "Report_reporterId_fkey" FOREIGN KEY ("reporterId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Report_assignedAdminId_fkey') THEN
        ALTER TABLE "Report" ADD CONSTRAINT "Report_assignedAdminId_fkey" FOREIGN KEY ("assignedAdminId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'AppSetting_updatedById_fkey') THEN
        ALTER TABLE "AppSetting" ADD CONSTRAINT "AppSetting_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'AdminAuditLog_actorId_fkey') THEN
        ALTER TABLE "AdminAuditLog" ADD CONSTRAINT "AdminAuditLog_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;
END $$;

-- =============================================================================
-- CHECK CONSTRAINTS
-- =============================================================================
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Post_rating_range_check') THEN
        ALTER TABLE "Post" ADD CONSTRAINT "Post_rating_range_check" CHECK ("rating" BETWEEN 1 AND 10);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Product_rating_summary_check') THEN
        ALTER TABLE "Product" ADD CONSTRAINT "Product_rating_summary_check" CHECK ("ratingAverage" >= 0 AND "ratingAverage" <= 10 AND "ratingCount" >= 0);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Product_price_range_check') THEN
        ALTER TABLE "Product" ADD CONSTRAINT "Product_price_range_check" CHECK ("priceMin" IS NULL OR "priceMax" IS NULL OR "priceMin" <= "priceMax");
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Comment_single_target_check') THEN
        ALTER TABLE "Comment" ADD CONSTRAINT "Comment_single_target_check" CHECK (
            ("targetType" = 'POST' AND "postId" IS NOT NULL AND "productId" IS NULL)
            OR
            ("targetType" = 'PRODUCT' AND "productId" IS NOT NULL AND "postId" IS NULL)
        );
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'UserList_purpose_visibility_check') THEN
        ALTER TABLE "UserList" ADD CONSTRAINT "UserList_purpose_visibility_check" CHECK (
            ("purpose" = 'PERSONAL_SAVE' AND "visibility" = 'PRIVATE')
            OR
            ("purpose" = 'PUBLISHER_PUBLIC' AND "visibility" = 'PUBLIC')
        );
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Follow_no_self_check') THEN
        ALTER TABLE "Follow" ADD CONSTRAINT "Follow_no_self_check" CHECK ("followerId" <> "followingId");
    END IF;
END $$;

-- =============================================================================
-- DEMO SEED DATA
-- =============================================================================

-- Users
INSERT INTO "User" ("id", "phone", "role", "status", "updatedAt") VALUES
    ('usr_owner', '+966500000001', 'OWNER', 'ACTIVE', NOW()),
    ('usr_01', '+966500000011', 'USER', 'ACTIVE', NOW()),
    ('usr_02', '+966500000012', 'USER', 'ACTIVE', NOW()),
    ('usr_03', '+966500000013', 'USER', 'ACTIVE', NOW()),
    ('usr_04', '+966500000014', 'USER', 'ACTIVE', NOW()),
    ('usr_05', '+966500000015', 'USER', 'ACTIVE', NOW()),
    ('usr_06', '+966500000016', 'USER', 'ACTIVE', NOW()),
    ('usr_07', '+966500000017', 'USER', 'ACTIVE', NOW()),
    ('usr_08', '+966500000018', 'USER', 'ACTIVE', NOW())
ON CONFLICT ("id") DO NOTHING;

-- Profiles
INSERT INTO "Profile" ("id", "userId", "username", "displayName", "bio", "city", "visibility", "updatedAt") VALUES
    ('prf_owner', 'usr_owner', 'owner', 'مالك رأينا', 'حساب إدارة تجريبي', 'الرياض', 'PUBLIC', NOW()),
    ('prf_01', 'usr_01', 'rana', 'رنا العبدالله', 'أشارك تجاربي اليومية مع المنتجات', 'جدة', 'PUBLIC', NOW()),
    ('prf_02', 'usr_02', 'noura', 'نورة خالد', 'أحب المنتجات العملية', 'الرياض', 'PUBLIC', NOW()),
    ('prf_03', 'usr_03', 'sara', 'سارا محمد', 'مراجعات دقيقة ومنصفة', 'الدمام', 'PUBLIC', NOW()),
    ('prf_04', 'usr_04', 'fahad', 'فهد العتيبي', 'مهتم بالتكنولوجيا', 'الرياض', 'PUBLIC', NOW()),
    ('prf_05', 'usr_05', 'lama', 'لمى أحمد', 'أعشق العناية بالبشرة', 'جدة', 'PUBLIC', NOW()),
    ('prf_06', 'usr_06', 'majed', 'ماجد الحربي', 'طبخ وتجارب مطاعم', 'مكة', 'PUBLIC', NOW()),
    ('prf_07', 'usr_07', 'huda', 'هدى سليمان', 'مراجعات منتجات الأطفال', 'الخبر', 'PUBLIC', NOW()),
    ('prf_08', 'usr_08', 'yusuf', 'يوسف الناصر', 'أشتري وأقيّم', 'جدة', 'PUBLIC', NOW())
ON CONFLICT ("id") DO NOTHING;

-- Categories
INSERT INTO "Category" ("id", "slug", "nameAr", "descriptionAr", "status", "sortOrder", "updatedAt") VALUES
    ('cat_el', 'electronics', 'إلكترونيات', 'أجهزة ذكية، لابتوبات، جوالات، وملحقاتها', 'ACTIVE', 1, NOW()),
    ('cat_bty', 'beauty', 'جمال وعناية', 'مستحضرات تجميل، عطور، ومواد عناية شخصية', 'ACTIVE', 2, NOW()),
    ('cat_home', 'home', 'منزل ومطبخ', 'أثاث، أدوات مطبخ، ديكور المنزل', 'ACTIVE', 3, NOW()),
    ('cat_food', 'food', 'طعام وشراب', 'منتجات غذائية، مشروبات، ووجبات خفيفة', 'ACTIVE', 4, NOW()),
    ('cat_fash', 'fashion', 'أزياء', 'ملابس، أحذية، إكسسوارات', 'ACTIVE', 5, NOW()),
    ('cat_kids', 'kids', 'أطفال', 'ألعاب، حاجيات الأطفال، تعليم', 'ACTIVE', 6, NOW()),
    ('cat_sport', 'sports', 'رياضة', 'أدوات رياضية، ملابس رياضية، مكملات', 'ACTIVE', 7, NOW()),
    ('cat_books', 'books', 'كتب', 'كتب عربية، كتب تعليمية، روايات', 'ACTIVE', 8, NOW())
ON CONFLICT ("id") DO NOTHING;

-- Brands
INSERT INTO "Brand" ("id", "slug", "name", "description", "status", "updatedAt") VALUES
    ('brd_ap', 'apple', 'Apple', 'أجهزة آبل', 'ACTIVE', NOW()),
    ('brd_sm', 'samsung', 'Samsung', 'إلكترونيات سامسونج', 'ACTIVE', NOW()),
    ('brd_sy', 'sony', 'Sony', 'منتجات سوني', 'ACTIVE', NOW()),
    ('brd_lr', 'loreal', 'L''Oréal', 'مستحضرات تجميل لوريال', 'ACTIVE', NOW()),
    ('brd_nv', 'nivea', 'Nivea', 'منتجات العناية بالبشرة نيفيا', 'ACTIVE', NOW()),
    ('brd_nk', 'nike', 'Nike', 'ملابس وأحذية رياضية نايك', 'ACTIVE', NOW()),
    ('brd_ph', 'philips', 'Philips', 'أجهزة منزلية فيليبس', 'ACTIVE', NOW()),
    ('brd_ns', 'nestle', 'Nestlé', 'منتجات غذائية نستله', 'ACTIVE', NOW())
ON CONFLICT ("id") DO NOTHING;

-- Products
INSERT INTO "Product" ("id", "slug", "brandId", "categoryId", "nameAr", "summaryAr", "priceMin", "priceMax", "ratingAverage", "ratingCount", "status", "updatedAt") VALUES
    ('prod_01', 'iphone-15', 'brd_ap', 'cat_el', 'آيفون 15 برو', 'أحدث جوال من آبل بتقنية الكاميرا المتطورة', 4299.00, 5899.00, 8.50, 42, 'ACTIVE', NOW()),
    ('prod_02', 'galaxy-s24', 'brd_sm', 'cat_el', 'سامسونج جالاكسي S24', 'هاتف ذكي بشاشة رائعة وأداء قوي', 3299.00, 4599.00, 8.20, 35, 'ACTIVE', NOW()),
    ('prod_03', 'loreal-serum', 'brd_lr', 'cat_bty', 'سيروم فيتامين C لوريال', 'سيروم مضاد للأكسدة لتوحيد لون البشرة', 89.00, 129.00, 7.80, 28, 'ACTIVE', NOW()),
    ('prod_04', 'nivea-cream', 'brd_nv', 'cat_bty', 'مرطب نيفيا الأزرق', 'مرطب عميق للبشرة الجافة بخلاصة اللوز', 25.00, 45.00, 7.50, 56, 'ACTIVE', NOW()),
    ('prod_05', 'sony-wh1000xm5', 'brd_sy', 'cat_el', 'سماعات سوني WH-1000XM5', 'سماعات لاسلكية عازلة للضوضاء', 1299.00, 1599.00, 9.20, 18, 'ACTIVE', NOW()),
    ('prod_06', 'philips-blender', 'brd_ph', 'cat_home', 'خلاط فيليبس HR365', 'خلاط قوي بسعة 2 لتر، 6 شفرات', 349.00, 499.00, 8.00, 22, 'ACTIVE', NOW()),
    ('prod_07', 'nike-air-max', 'brd_nk', 'cat_fash', 'نايك اير ماكس 270', 'حذاء رياضي مريح وخفيف', 549.00, 749.00, 8.90, 31, 'ACTIVE', NOW()),
    ('prod_08', 'galaxy-buds-pro', 'brd_sm', 'cat_el', 'سماعات سامسونج بادز برو', 'سماعات لاسلكية داخل الأذن مع عزل ضوضاء', 599.00, 749.00, 8.30, 44, 'ACTIVE', NOW()),
    ('prod_09', 'nestle-cereal', 'brd_ns', 'cat_food', 'كورن فليكس نستله', 'إفطار صحي غني بالحبوب الكاملة', 18.00, 32.00, 7.00, 15, 'ACTIVE', NOW()),
    ('prod_10', 'philips-hair-dryer', 'brd_ph', 'cat_bty', 'مجفف شعر فيليبس', 'مجفف شعر احترافي بقوة 2200 واط', 199.00, 299.00, 8.10, 19, 'ACTIVE', NOW()),
    ('prod_11', 'nike-shoes-run', 'brd_nk', 'cat_sport', 'حذاء نايك للجري', 'حذاء جري خفيف مع وسائد هواء', 379.00, 529.00, 8.70, 12, 'ACTIVE', NOW()),
    ('prod_12', 'iphone-case', 'brd_ap', 'cat_el', 'جراب آيفون سيليكون', 'جراب سيليكون ناعم لحماية الجوال', 89.00, 149.00, 7.40, 65, 'ACTIVE', NOW())
ON CONFLICT ("id") DO NOTHING;

-- ProductMedia
INSERT INTO "ProductMedia" ("id", "productId", "type", "url", "altAr", "sortOrder", "moderationStatus") VALUES
    ('pm_01', 'prod_01', 'IMAGE', 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&h=800&fit=crop&q=80', 'آيفون 15 برو', 0, 'APPROVED'),
    ('pm_02', 'prod_02', 'IMAGE', 'https://images.unsplash.com/photo-1706105015-21884e1c4b46?w=800&h=800&fit=crop&q=80', 'جالاكسي S24', 0, 'APPROVED'),
    ('pm_03', 'prod_05', 'IMAGE', 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800&h=800&fit=crop&q=80', 'سماعات سوني', 0, 'APPROVED'),
    ('pm_04', 'prod_07', 'IMAGE', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=800&fit=crop&q=80', 'حذاء نايك', 0, 'APPROVED'),
    ('pm_05', 'prod_11', 'IMAGE', 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&h=800&fit=crop&q=80', 'حذاء جري', 0, 'APPROVED'),
    ('pm_06', 'prod_06', 'IMAGE', 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=800&h=800&fit=crop&q=80', 'خلاط فيليبس', 0, 'APPROVED')
ON CONFLICT ("id") DO NOTHING;

-- ProductSpecifications
INSERT INTO "ProductSpecification" ("id", "productId", "nameAr", "valueAr", "sortOrder", "updatedAt") VALUES
    ('ps_01', 'prod_01', 'المعالج', 'A17 Pro', 0, NOW()),
    ('ps_02', 'prod_01', 'الشاشة', '6.1 بوصة Super Retina XDR', 1, NOW()),
    ('ps_03', 'prod_02', 'المعالج', 'Exynos 2400', 0, NOW()),
    ('ps_04', 'prod_02', 'الشاشة', '6.2 بوصة Dynamic AMOLED', 1, NOW()),
    ('ps_05', 'prod_05', 'نوع العزل', 'عزل ضوضاء نشط', 0, NOW()),
    ('ps_06', 'prod_05', 'عمر البطارية', '30 ساعة', 1, NOW()),
    ('ps_07', 'prod_06', 'السعة', '2 لتر', 0, NOW()),
    ('ps_08', 'prod_06', 'الطاقة', '1200 واط', 1, NOW())
ON CONFLICT ("id") DO NOTHING;

-- Posts
INSERT INTO "Post" ("id", "authorId", "productId", "rating", "title", "body", "status", "publishedAt", "updatedAt") VALUES
    ('post_01', 'usr_01', 'prod_01', 9, 'تجربتي مع آيفون 15 برو - كاميرا وأداء', 'بعد استخدام شهر كامل، الكاميرا مذهلة خصوصاً في التصوير الليلي. البطارية تدوم يوم كامل. الشاشة سريعة 120Hz. العيب الوحيد السعر المرتفع.', 'PUBLISHED', NOW() - INTERVAL '2 days', NOW()),
    ('post_02', 'usr_02', 'prod_02', 8, 'جالاكسي S24 - هاتف متكامل', 'الهاتف خفيف وسريع. شاشته جميلة. الكاميرا جيدة ولكنها ليست الأفضل. بطارية متوسطة. يستحق السعر.', 'PUBLISHED', NOW() - INTERVAL '4 days', NOW()),
    ('post_03', 'usr_03', 'prod_03', 8, 'سيروم لوريال فيتامين C - النتائج بعد شهر', 'استخدمته لمدة شهر ولاحظت تحسن في نضارة البشرة. الملمس خفيف وسريع الامتصاص. العبوة صغيرة نوعاً ما.', 'PUBLISHED', NOW() - INTERVAL '5 days', NOW()),
    ('post_04', 'usr_04', 'prod_05', 10, 'أفضل سماعة عزل ضوضاء اشتريتها', 'جودة الصوت خرافية، عزل الضوضاء ممتاز حتى في الأماكن المزدحمة. البطارية تعيش معي 3 أيام عمل. توصية قوية.', 'PUBLISHED', NOW() - INTERVAL '3 days', NOW()),
    ('post_05', 'usr_05', 'prod_04', 7, 'مرطب نيفيا الأزرق - كلاسيكي لكن', 'مرطب جيد وبسعر معقول. مناسب للبشرة الجافة. لكنه ثقيل قليلاً للاستخدام اليومي في الصيف.', 'PUBLISHED', NOW() - INTERVAL '6 days', NOW()),
    ('post_06', 'usr_06', 'prod_06', 8, 'خلاط فيليبس - عملي ومتين', 'قوي جداً، يطحن الثلج بسهولة. سهل التنظيف. التصميم جميل. لكن السعر مرتفع قليلاً.', 'PUBLISHED', NOW() - INTERVAL '1 day', NOW()),
    ('post_07', 'usr_01', 'prod_07', 9, 'نايك اير ماكس 270 - أناقة وراحة', 'الحذاء مريح جداً للمشي اليومي. التصميم جميل. الخامة جيدة وتدوم. يستحق كل ريال.', 'PUBLISHED', NOW() - INTERVAL '7 days', NOW()),
    ('post_08', 'usr_07', 'prod_08', 8, 'سماعات سامسونج بادز برو - مراجعة', 'جودة الصوت ممتازة. العزل جيد. البرنامج سهل الاستخدام. لكنها تنزلق أحياناً من الأذن.', 'PUBLISHED', NOW() - INTERVAL '8 days', NOW()),
    ('post_09', 'usr_08', 'prod_01', 8, 'الفرق بين آيفون 15 برو و 15 العادي', 'بعد تجربة كلا الجهازين، الفرق الأساسي في الشاشة والكاميرا. البرو يستحق الزيادة في السعر لمن يهتم بالتصوير.', 'PUBLISHED', NOW() - INTERVAL '9 days', NOW()),
    ('post_10', 'usr_03', 'prod_10', 8, 'مجفف شعر فيليبس - قوي وموثوق', 'يجفف الشعر بسرعة. درجات حرارة متعددة. سعره مناسب. آمن على الشعر.', 'PUBLISHED', NOW() - INTERVAL '10 days', NOW()),
    ('post_11', 'usr_04', 'prod_11', 9, 'حذاء نايك للجري - أفضل حذاء رياضي', 'وسائد هواء مريحة. خفيف جداً. مناسب للجري لمسافات طويلة. اللون جميل.', 'PUBLISHED', NOW() - INTERVAL '3 days', NOW()),
    ('post_12', 'usr_05', 'prod_09', 6, 'كورن فليكس نستله - فطور سريع', 'طعم جيد وسعر مناسب. لكن السكر مضاف بكثرة. جيد كوجبة سريعة.', 'PUBLISHED', NOW() - INTERVAL '11 days', NOW())
ON CONFLICT ("id") DO NOTHING;

-- PostMedia
INSERT INTO "PostMedia" ("id", "postId", "type", "url", "altAr", "sortOrder", "moderationStatus") VALUES
    ('pom_01', 'post_01', 'IMAGE', 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&h=800&fit=crop&q=80', 'آيفون 15 برو', 0, 'APPROVED'),
    ('pom_02', 'post_04', 'IMAGE', 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800&h=800&fit=crop&q=80', 'سماعات سوني', 0, 'APPROVED')
ON CONFLICT ("id") DO NOTHING;

-- PostPro (Pros)
INSERT INTO "PostPro" ("id", "postId", "body", "sortOrder") VALUES
    ('pp_01', 'post_01', 'كاميرا مذهلة في التصوير الليلي', 0),
    ('pp_02', 'post_01', 'شاشة 120Hz سريعة', 1),
    ('pp_03', 'post_01', 'بطارية تدوم طويلاً', 2),
    ('pp_04', 'post_02', 'شاشة جميلة', 0),
    ('pp_05', 'post_02', 'خفيف وسريع', 1),
    ('pp_06', 'post_04', 'جودة صوت استثنائية', 0),
    ('pp_07', 'post_04', 'عزل ضوضاء ممتاز', 1),
    ('pp_08', 'post_04', 'بطارية 30 ساعة', 2),
    ('pp_09', 'post_07', 'راحة في المشي اليومي', 0),
    ('pp_10', 'post_07', 'تصميم أنيق', 1)
ON CONFLICT ("id") DO NOTHING;

-- PostCon (Cons)
INSERT INTO "PostCon" ("id", "postId", "body", "sortOrder") VALUES
    ('pc_01', 'post_01', 'السعر مرتفع', 0),
    ('pc_02', 'post_01', 'لا يأتي مع شاحن', 1),
    ('pc_03', 'post_02', 'بطارية متوسطة', 0),
    ('pc_04', 'post_02', 'كاميرا ليست الأفضل', 1),
    ('pc_05', 'post_04', 'السعر مرتفع', 0),
    ('pc_06', 'post_07', 'غالي مقارنة بموديلات أخرى', 0),
    ('pc_07', 'post_04', 'تطبيق التحكم يحتاج تطوير', 1)
ON CONFLICT ("id") DO NOTHING;

-- Comments
INSERT INTO "Comment" ("id", "authorId", "targetType", "postId", "body", "status", "updatedAt") VALUES
    ('cmt_01', 'usr_05', 'POST', 'post_01', 'شكراً على المراجعة، هل جربت الكاميرا في الإضاءة المنخفضة؟', 'PUBLISHED', NOW()),
    ('cmt_02', 'usr_01', 'POST', 'post_01', 'أيوه، صور الليل ممتازة جداً، أفضل من آيفون 14 بكثير', 'PUBLISHED', NOW()),
    ('cmt_03', 'usr_08', 'POST', 'post_04', 'اتفق معاك تماماً، سماعات رائعة', 'PUBLISHED', NOW()),
    ('cmt_04', 'usr_03', 'POST', 'post_03', 'متى ظهرت النتائج؟ أنا بقالي أسبوعين', 'PUBLISHED', NOW()),
    ('cmt_05', 'usr_03', 'POST', 'post_03', 'الشهر الثالث كان الأفضل بالنسبة لي', 'PUBLISHED', NOW())
ON CONFLICT ("id") DO NOTHING;

-- Follows
INSERT INTO "Follow" ("followerId", "followingId", "createdAt") VALUES
    ('usr_02', 'usr_01', NOW()),
    ('usr_03', 'usr_01', NOW()),
    ('usr_04', 'usr_01', NOW()),
    ('usr_05', 'usr_01', NOW()),
    ('usr_01', 'usr_02', NOW()),
    ('usr_03', 'usr_02', NOW()),
    ('usr_01', 'usr_04', NOW())
ON CONFLICT ("followerId", "followingId") DO NOTHING;

-- UserLists (PUBLISHER_PUBLIC list for usr_01)
INSERT INTO "UserList" ("id", "ownerId", "slug", "title", "description", "purpose", "visibility", "updatedAt") VALUES
    ('list_01', 'usr_01', 'raaa-reviews', 'توصيات رنا', 'منتجات جربتها وأنصح فيها', 'PUBLISHER_PUBLIC', 'PUBLIC', NOW())
ON CONFLICT ("id") DO NOTHING;

-- Link post_07 to usr_01's public list
UPDATE "Post" SET "publicListId" = 'list_01' WHERE "id" = 'post_07' AND "publicListId" IS NULL;
