-- CreateEnum
CREATE TYPE "MemberType" AS ENUM ('admin', 'owner', 'member');

-- CreateEnum
CREATE TYPE "ChannelType" AS ENUM ('public', 'private', 'protected');

-- CreateTable
CREATE TABLE "users" (
    "name" VARCHAR(30) NOT NULL,
    "avatar" TEXT NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "conversations" (
    "id" BIGSERIAL NOT NULL,

    CONSTRAINT "conversations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "messages" (
    "id" BIGSERIAL NOT NULL,
    "conversation_id" BIGINT NOT NULL,
    "content" TEXT NOT NULL,
    "sent_date" TIMESTAMP(1) NOT NULL,
    "owner_name" VARCHAR(30) NOT NULL,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "participants" (
    "id" BIGSERIAL NOT NULL,
    "user_name" VARCHAR(30) NOT NULL,
    "conversation_id" BIGINT NOT NULL,

    CONSTRAINT "participants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "channels" (
    "name" VARCHAR(30) NOT NULL,
    "conversation_id" BIGINT NOT NULL,
    "type" "ChannelType" NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "channels_pkey" PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "channel_members" (
    "id" BIGSERIAL NOT NULL,
    "user_name" VARCHAR(30) NOT NULL,
    "channel_name" VARCHAR(30) NOT NULL,
    "type" "MemberType" NOT NULL,
    "banned" BOOLEAN NOT NULL,
    "mute" INTEGER NOT NULL,

    CONSTRAINT "channel_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blocked_users" (
    "blocked_user_name" VARCHAR(30) NOT NULL,
    "blocked_by_user_name" VARCHAR(30) NOT NULL,

    CONSTRAINT "blocked_users_pkey" PRIMARY KEY ("blocked_user_name","blocked_by_user_name")
);

-- CreateTable
CREATE TABLE "friends" (
    "user_name" VARCHAR(30) NOT NULL,
    "friend_name" VARCHAR(30) NOT NULL,
    "approved" BOOLEAN NOT NULL,

    CONSTRAINT "friends_pkey" PRIMARY KEY ("user_name","friend_name")
);

-- CreateIndex
CREATE UNIQUE INDEX "channels_conversation_id_key" ON "channels"("conversation_id");

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_conversation_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "conversations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_owner_name_fkey" FOREIGN KEY ("owner_name") REFERENCES "users"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "participants" ADD CONSTRAINT "participants_user_name_fkey" FOREIGN KEY ("user_name") REFERENCES "users"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "participants" ADD CONSTRAINT "participants_conversation_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "conversations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "channels" ADD CONSTRAINT "channels_conversation_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "conversations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "channel_members" ADD CONSTRAINT "channel_members_user_name_fkey" FOREIGN KEY ("user_name") REFERENCES "users"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "channel_members" ADD CONSTRAINT "channel_members_channel_name_fkey" FOREIGN KEY ("channel_name") REFERENCES "channels"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blocked_users" ADD CONSTRAINT "blocked_users_blocked_user_name_fkey" FOREIGN KEY ("blocked_user_name") REFERENCES "users"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blocked_users" ADD CONSTRAINT "blocked_users_blocked_by_user_name_fkey" FOREIGN KEY ("blocked_by_user_name") REFERENCES "users"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "friends" ADD CONSTRAINT "friends_user_name_fkey" FOREIGN KEY ("user_name") REFERENCES "users"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "friends" ADD CONSTRAINT "friends_friend_name_fkey" FOREIGN KEY ("friend_name") REFERENCES "users"("name") ON DELETE RESTRICT ON UPDATE CASCADE;
