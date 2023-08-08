-- CreateTable
CREATE TABLE "channel_invites" (
    "user_name" VARCHAR(30) NOT NULL,
    "invited_by_name" VARCHAR(30) NOT NULL,
    "channel_name" VARCHAR(30) NOT NULL,

    CONSTRAINT "channel_invites_pkey" PRIMARY KEY ("user_name","invited_by_name")
);

-- AddForeignKey
ALTER TABLE "channel_invites" ADD CONSTRAINT "channel_invites_user_name_fkey" FOREIGN KEY ("user_name") REFERENCES "users"("name") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "channel_invites" ADD CONSTRAINT "channel_invites_invited_by_name_fkey" FOREIGN KEY ("invited_by_name") REFERENCES "users"("name") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "channel_invites" ADD CONSTRAINT "channel_invites_channel_name_fkey" FOREIGN KEY ("channel_name") REFERENCES "channels"("name") ON DELETE CASCADE ON UPDATE CASCADE;
