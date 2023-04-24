
export default function Home() {

  return (
    <div className="flex bg-baklavaBlack-200 h-screen w-full items-center justify-center ">
      <div className="relative text-body-test p-0.5 ">
        <div className="bg-baklavaBlack-200 h-full w-full relative z-10 active:brightness-200 duration-700">
          <button
            className='text-body-test bg-clip-text p-2 text-8xl font-sans font-extrabold text-transparent border-2 border-transparent'
          >
            LOGIN
          </button>
        </div>
        <div className="absolute w-[28rem] blur-2xl h-36 text-body-test -left-[3.5rem] -top-[0.5rem]"></div>
      </div>
    </div>
  )
}
