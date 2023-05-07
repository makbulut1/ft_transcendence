import { ChatBubbleBottomCenterIcon, HomeIcon, RocketLaunchIcon } from '@heroicons/react/20/solid'
import React from 'react'

import { MenuButtonProps } from '@/types'

const MenuButtons: MenuButtonProps[] = [
  {
    name: 'Home',
    path: '/home',
    icon: <HomeIcon className="h-8 w-8 text-white" />,
  },
  {
    name: 'Chat',
    path: '/chat',
    icon: <ChatBubbleBottomCenterIcon className="h-8 w-8 text-white" />,
  },
  {
    name: 'Game',
    path: '/game',
    icon: <RocketLaunchIcon className="h-8 w-8 text-white" />,
  },
]

export { MenuButtons }
