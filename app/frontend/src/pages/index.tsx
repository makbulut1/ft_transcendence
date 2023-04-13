import axios from 'axios'
import Image from 'next/image'

export default function Home() {
  const handleClick = () => {
    axios.get('https://localhost:8000')
  }
  return (
    <div className="flex h-screen w-full items-center justify-center bg-cyan-400">
      <div className="flex justify-center items-center w-96 h-96 bg-cyan-700">
        <button onClick={handleClick} className="rounded-lg hover:brightness-110 active:brightness-100 bg-neutral-600 p-2 text-white duration-200">Login</button>
      </div>
    </div>
  )
}
