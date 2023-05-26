import { faker } from '@faker-js/faker'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'

import { Dropdown } from '@/components/Dropdown'
import { MenuButtons } from '@/constants'
import { useModal, useStoreUser } from '@/store'
import { MenuButtonProps } from '@/types'
import { Button } from '@/ui/Button'
import { ProfilePhoto } from '@/ui/ProfilePhoto'
import { ProfileModal } from '@/components/Modals'

const ProfileDropdownButton = () => (
  <div className="cursor-pointer rounded-full bg-neutral-300 p-0.5 shadow-xl duration-200 hover:brightness-110 focus:outline-none active:shadow-none active:brightness-150">
    <ProfilePhoto show={true} src={faker.image.avatar()} alt={faker.name.firstName()} size={50} />
  </div>
)

function HeaderProfileDropdownContent() {
  const router = useRouter()
  const { unauthenticate } = useStoreUser()

  const handleLogout = () => {
    unauthenticate()
    router.push('/').then(() => window.location.reload())
  }

  //Profle Modal
  const {  openModal } = useModal()
  const handleProfile = () => {
    openModal(<ProfileModal />)
  }

  return (
    <div
      className="flex flex-col rounded-md bg-baklavaBlack-100 py-2 shadow-xl 
        c:cursor-pointer c:bg-baklavaBlack-100 c:text-xl c:font-thin c:duration-200 c-h:bg-baklavaBlack-50 c-a:brightness-150 c:pr-10 c:pl-4 c:p-2"
    >
      <div onClick={handleProfile}>Profile</div>
      <div onClick={handleLogout}>Logout</div>
    </div>
  )
}

const HeaderProfileDropdown = () => {
  return (
    <>
      <Dropdown x="left" button={<ProfileDropdownButton />}>
        <HeaderProfileDropdownContent />
      </Dropdown>
    </>
  )
}

const HeaderProfile = () => <HeaderProfileDropdown />

function MenuButton({ children, path }: {children: React.ReactNode | React.ReactNode[], path: string}) {
  const router = useRouter()
  const { pathname } = router

  return (
    <Button
      onClick={() => router.push(path)}
      className={`${pathname === path ? "shadow-blue-300" : "" } bg-transparent flex items-center justify-center gap-1 rounded-bl-3xl text-white rounded-se-3xl p-2 px-6 text-xl font-bold hover:brightness-125`}
    >
      {children}
    </Button>
  )
}

function Menu() {
  return (
    <div className="absolute flex items-center justify-center gap-6">
      {MenuButtons.map((button: MenuButtonProps, index: number) => (
        <MenuButton path={button.path} key={index}>{button.icon}{button.name}</MenuButton>))
      }
    </div>
  )
}

const Header = () => {
  const [userStore, setUserStore] = useState<boolean>(false)
  const { authenticated } = useStoreUser()

  useEffect(() => {
    setUserStore(authenticated)
  }, [authenticated])

  return (
    <header className=" h-20 flex w-full items-center justify-center bg-gradient-to-r from-[#ad5389] to-[#3c1053] p-2 px-20 text-4xl font-extrabold text-white shadow-xl">
      <Menu />
      <div className="flex w-full justify-end">{userStore && <HeaderProfile />}</div>
    </header>
  )
}

export { Header }
