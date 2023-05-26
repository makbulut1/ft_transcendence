import React, { ReactNode, useEffect, useState } from 'react'
import ReactDOM from 'react-dom'

import { useModal } from '@/store/useModal'

import { Modal } from './Modal'

interface IModalPortalProps {
  children: ReactNode
}

const ModalPortal = ({ children }: IModalPortalProps) => {
  const [modalRoot, setModalRoot] = useState<HTMLElement | null>(null)

  useEffect(() => {
    const root = document.getElementById('modal-root')
    setModalRoot(root)
  }, [])

  if (!modalRoot) {
    return null
  }

  return ReactDOM.createPortal(children, modalRoot)
}

const ModalController = () => {
  const { isOpen, content, closeModal } = useModal()

  return (
    <ModalPortal>
      <Modal show={isOpen} onClose={closeModal}>
        {content}
      </Modal>
    </ModalPortal>
  )
}

export { ModalController }
