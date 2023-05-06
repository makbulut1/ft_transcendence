
interface ChatWindowHeaderProps {
  fullname: string
}

const ChatWindowHeader = ({ fullname }: ChatWindowHeaderProps) => {
  
  const name = 'Eren Akbulut'
  
  return (
    <div className="relative z-10 flex w-full items-center justify-center bg-baklavaBlack-200 py-5 font-bold text-white shadow-3xl shadow-baklavaBlack-200">
      {fullname}
    </div>
  )
}

export { ChatWindowHeader }
