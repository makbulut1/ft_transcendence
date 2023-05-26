import { Dialog, Transition } from '@headlessui/react'
import React, { Fragment } from 'react'

/**
 * Modal component props
 * @param show - boolean to show or hide the modal
 * @param children - children to render inside the modal
 * @param onClose - function to close the modal
 */
type IModalProps = {
  show: boolean
  children: React.ReactNode
  onClose(): void
}
/**
 * Abstracts modal component
 * @example
 * ```tsx
 * export function ModalExample () {
 *   const [show, setShow] = useState(false)
 *   return (
 *     <>
 *     <button onClick={() => setShow(true)}>Open Modal</button>
 *     <Modal show={show} onClose={() => setShow(false)}>
 *       <div>Children</div>
 *       <button className="bg-amber-200 text-white p-2 rounded-2xl" onClick={() => setShow(false)}>Close modal</button>
 *     </Modal>
 *     </>
 *   )
 * }
 * ```
 */
const Modal = ({ show, children, onClose }: IModalProps) => (
  <Transition appear show={show} as={Fragment}>
    <Dialog as="div" className="relative z-10" onClose={onClose}>
      <Transition.Child
        as={Fragment}
        enter="ease-out duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="ease-in duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="fixed inset-0 bg-black bg-opacity-25" />
      </Transition.Child>
      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-[#24203B] p-6 text-left align-middle shadow-xl transition-all">
              {children}
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </div>
    </Dialog>
  </Transition>
)

export { Modal }
