import { gameCard } from '@/_Mock'
import { Header, Layout } from '@/layouts'
import { GameCard } from '@/modules/game'

export default function Home() {
  return (
    <Layout>
      <GameCard
        firstUser={gameCard.firstUser}
        secondUser={gameCard.secondUser}
        score={gameCard.score}
        time={gameCard.time}
      />
    </Layout>
  )
}
