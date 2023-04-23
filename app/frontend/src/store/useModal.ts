import React from 'react'
import { create } from 'zustand'

/**
 * Modal state
 * @param isOpen - Whether the modal is open
 * @param content - The content of the modal
 * @param openModal - Open the modal
 * @param closeModal - Close the modal
 */
type ModalState = {
  isOpen: boolean
  content: React.ReactNode | null
  openModal: (content: React.ReactNode) => void
  closeModal: () => void
}

/**
 * Modal state
 * @example
 * ```tsx
 * const {openModal} = useModal();
 * const handleClick = () => openModal(<ModalContent />);
 * ```
 */

export const useModal = create<ModalState>(set => ({
  isOpen: false,
  content: null,
  openModal: content => set(() => ({ isOpen: true, content })),
  closeModal: () => set(() => ({ isOpen: false})),
}))
