import { useModal } from '@/store/useModal'
import { Button } from '@/ui/Button'


export default function Home() {
  const {openModal} = useModal();
  const handleClick = () => {
    openModal(
      <div className="text-emerald-400">hello</div>
    )}

  return (
    <div className="body flex h-screen w-full items-center justify-center ">
      <div className="flex gap-4 h-96 w-96 items-center justify-center ">
        <Button
          intent="primary"
          onClick={handleClick}
        >
          Login
        </Button>
        <Button intent="secondary" >Sec</Button>
        <Button intent="danger" >Sec</Button>
      </div>
    </div>
  )
}
