-- CreateTable
CREATE TABLE "MatchHistory" (
    "id" BIGSERIAL NOT NULL,
    "player1_name" VARCHAR(30) NOT NULL,
    "player2_name" VARCHAR(30) NOT NULL,
    "player1_score" BIGINT NOT NULL,
    "player2_score" BIGINT NOT NULL,
    "lasted" TIMESTAMP(1) NOT NULL,
    "match_time" TIMESTAMP(1) NOT NULL,

    CONSTRAINT "MatchHistory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MatchHistory" ADD CONSTRAINT "MatchHistory_player1_name_fkey" FOREIGN KEY ("player1_name") REFERENCES "users"("name") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchHistory" ADD CONSTRAINT "MatchHistory_player2_name_fkey" FOREIGN KEY ("player2_name") REFERENCES "users"("name") ON DELETE CASCADE ON UPDATE CASCADE;
