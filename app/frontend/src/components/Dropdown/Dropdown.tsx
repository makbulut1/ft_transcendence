import { Popover, Transition } from '@headlessui/react'
import { Fragment } from 'react'

interface ISettingButtonDropDownProps {
  children: JSX.Element
  button: JSX.Element
  x?: 'left' | 'right'
  y?: 'up' | 'down'
}

/**
 * Default olarak sağ aşağı açılır
 * @param children içeride gösterilecek element
 * @param button Tıklanması için verilecek element
 * @param x left | right
 * @param y up | down
 */

const Dropdown = ({ children, button, x, y }: ISettingButtonDropDownProps) => {
  return (
    <div>
      <Popover className="relative h-full w-full">
        <Popover.Button className="rounded-full p-1 text-2xl duration-200 hover:bg-emerald-400/50 active:brightness-125 focus-visible:outline-none">
          {button}
        </Popover.Button>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-200"
          enterFrom="opacity-0 translate-y-0"
          enterTo="opacity-100 translate-y-1"
          leave="transition ease-in duration-150"
          leaveFrom="opacity-100 translate-y-1"
          leaveTo="opacity-0 translate-y-0"
        >
          <Popover.Panel className={`absolute z-30 ${x === 'left' ? 'right-1' : 'left-1'} ${y === 'up' ? 'bottom-15' : 'top-15'}`}>
            {children}
          </Popover.Panel>
        </Transition>
      </Popover>
    </div>
  )
}

export { Dropdown }
