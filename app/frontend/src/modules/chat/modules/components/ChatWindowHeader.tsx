
interface ChatWindowHeaderProps {
  fullname: string,
  setUserListItemDisplay: (value: (((prevState: (boolean | null)) => (boolean | null)) | boolean | null)) => void
}

const ChatWindowHeader = ({ fullname, setUserListItemDisplay }: ChatWindowHeaderProps) => {
  
  return (
    <div className="sticky z-10 flex w-full items-center justify-center bg-baklavaBlack-200 py-5 font-bold text-white shadow-3xl shadow-baklavaBlack-200">
      {fullname}
      <div className="block md:hidden absolute left-3 top-5 cursor-pointer " onClick={e => {
        e.stopPropagation()
        setUserListItemDisplay(true)
      }}>Button Back</div>
    </div>
  )
}

export { ChatWindowHeader }
