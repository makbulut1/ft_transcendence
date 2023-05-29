import { faker } from '@faker-js/faker'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'

import { Dropdown } from '@/components/Dropdown'
import { ProfileModal } from '@/components/Modals'
import { MenuButtons } from '@/constants'
import { useModal, useStoreUser } from '@/store'
import { MenuButtonProps } from '@/types'
import { Button } from '@/ui/Button'
import { ProfilePhoto } from '@/ui/ProfilePhoto'

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
  const { openModal } = useModal()
  const handleProfile = () => {
    openModal(<ProfileModal />)
  }

  return (
    <div
      className="flex flex-col rounded-md bg-baklavaBlack-100 py-2 shadow-xl 
        c:cursor-pointer c:bg-baklavaBlack-100 c:p-2 c:pl-4 c:pr-10 c:text-xl c:font-thin c:duration-200 c-h:bg-baklavaBlack-50 c-a:brightness-150"
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

function MenuButton({ children, path, icon }: { children: React.ReactNode; path: string; icon: React.ReactNode }) {
  const router = useRouter()
  const { pathname } = router

  return (
    <Button
      onClick={() => router.push(path)}
      className={`${
        pathname === path ? 'shadow-blue-300' : ''
      } flex items-center justify-center gap-1 rounded-bl-3xl rounded-se-3xl bg-transparent p-0 px-6 text-xl font-bold text-white hover:brightness-125 md:p-2`}
    >
      <div>{icon}</div>
      <div className="hidden md:block">{children}</div>
    </Button>
  )
}

function Menu() {
  return (
    <div className="absolute flex items-center justify-center gap-6">
      {MenuButtons.map((button: MenuButtonProps, index: number) => (
        <MenuButton path={button.path} icon={button.icon} key={index}>
          {button.name}
        </MenuButton>
      ))}
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
    <header
      className={`absolute bottom-0 z-50 flex h-10 w-full min-w-[375px] items-center justify-center bg-gradient-to-r from-[#ad5389] to-[#3c1053] p-2 px-20 text-4xl font-extrabold text-white shadow-xl md:relative md:top-0 md:h-20`}
    >
      <Menu />
      <div className="flex w-full justify-end">{userStore && <HeaderProfile />}</div>
    </header>
  )
}

export { Header }
